import { Box, Typography, Button } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import OverallDifficulty from "../components/Dashboard/OverallDifficulty";
import { TopicFrequency } from "../types/types";
import TopicsCovered from "../components/Dashboard/TopicsCovered";
import { DifficultyFrequencyAndAverageDifficultyForTopic } from "../types/types";
import AverageDifficultyByTopic from "../components/Dashboard/AverageDifficultyByTopic";
import TopicsNotCovered from "../components/Dashboard/TopicsNotCovered";
import SubcategorisedTopicsCovered from "../components/Dashboard/SubcategorisedTopicsCovered";
import SubcategorisedTopicsNotCovered from "../components/Dashboard/SubcategorisedTopicsNotCovered";
import DifficultyFrequency from "../components/Dashboard/DifficultyFrequency";
import {
  calculateFrequencyForEachDifficultyLevel,
  countDifficultyFrequencyAndAverageDifficultyForEachTopic,
  countTopicsFrequency,
  retrieveQuestionsForEachTopic,
} from "../components/Dashboard/utils";
import { Question } from "../components/Dashboard/types";
import Api from "../api/Api";

// async function fetchPaperDashboard(paperId: number) {
//   try {
//     const res = await fetch(
//       `${import.meta.env.VITE_API_BASE_URL}/papers/${paperId}/dashboard`
//     );
//     if (!res.ok) {
//       if (res.status === 404) return null; // no dashboard yet
//       throw new Error(`Failed to fetch dashboard for paper ${paperId}`);
//     }
//     return await res.json();
//   } catch (err) {
//     console.error("Error fetching dashboard data:", err);
//     return null;
//   }
// }
// Lightweight fetchers so we don’t have to touch Api.tsx for this change
async function fetchPaperById(id: number) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/papers/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch paper ${id}`);
  return res.json();
}
async function fetchAvailableTopics() {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/topics/available`
  );
  if (!res.ok) throw new Error("Failed to fetch available topics");
  return res.json();
}
async function savePaperDashboard(paperId: number, payload: any) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/papers/${paperId}/dashboard`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Save failed (${res.status}): ${text || res.statusText}`);
  }
  return res.json();
}

interface DifficultyFrequencyType {
  difficulty: number;
  frequency: number;
  [key: string]: number;
}

const DashboardPage = () => {
  const location = useLocation() as any;

  // Two entry shapes:
  // 1) Old flow: state.savedPaper = { title, questions, allTopics }
  // 2) New flow: state.paperId (+ optional paperTitle)
  const savedPaperState = location?.state?.savedPaper;
  const paperIdFromState = location?.state?.paperId as number | undefined;
  const paperTitleFromState = location?.state?.paperTitle as string | undefined;

  const [title, setTitle] = useState<string>(
    savedPaperState?.title ?? paperTitleFromState ?? "",
  );
  const [questions, setQuestions] = useState<Question[]>(
    savedPaperState?.questions ?? [],
  );
  const [allTopics, setAllTopics] = useState<string[]>(
    savedPaperState?.allTopics ?? [],
  );
  const [paperId, setPaperId] = useState<number | null>(
    paperIdFromState ?? null,
  );

  // UI states
  const [toSubCategorise, setToSubCategorise] = useState<boolean>(true);
  const [topicFrequencies, setTopicsFrequencyMap] = useState<TopicFrequency[]>(
    [],
  );
  const [notCoveredTopics, setNotCoveredTopics] = useState<string[]>([]);
  const [paperAverageDifficulty, setPaperAverageDifficulty] =
    useState<number>(0);
  const [
    difficultyFrequencyAndAverageDifficultyForEachTopic,
    setDifficultyFrequencyAndAverageDifficultyForEachTopic,
  ] = useState<DifficultyFrequencyAndAverageDifficultyForTopic[]>([]);
  const [difficultyFrequency, setDifficultyFrequency] = useState<
    DifficultyFrequencyType[]
  >([]);

  // If we arrived with just an ID, fetch the full paper + available topics
  // Inside DashboardPage.tsx

  // 1. Add this helper function at the top of your component (or outside it)
  const sanitizeTopic = (topic: any): string => {
    if (!topic) return "";
    // If it's an object, extract the title/name/label
    if (typeof topic === "object") {
      return topic.title || topic.name || topic.label || "";
    }
    // Otherwise, force it to be a string
    return String(topic);
  };

  // 2. Replace the main useEffect with this robust version:
  useEffect(() => {
    if (!savedPaperState && paperIdFromState) {
      (async () => {
        console.log(
          "Loading and sanitizing dashboard data for paper:",
          paperIdFromState,
        );
        try {
          const [paperData, rawTopics, dashboard] = await Promise.all([
            Api.getPaperById(paperIdFromState),
            Api.getAvailableTopics(),
            Api.getPaperDashboard(paperIdFromState),
          ]);

          // 🛡️ SANITIZE 1: Questions (The most likely culprit)
          // If your questions API returns topics as [{id:1, title:"Math"}], this flattens them to ["Math"]
          const cleanQuestions = (paperData.questions || []).map((q: any) => ({
            ...q,
            topics: (q.topics || []).map(sanitizeTopic),
          }));

          // 🛡️ SANITIZE 2: Available Topics
          const cleanAllTopics = Array.isArray(rawTopics)
            ? rawTopics.map(sanitizeTopic)
            : [];

          // 🛡️ SANITIZE 3: Dashboard Payload
          let d = dashboard?.payload;

          // Handle the "Double Wrap" case just in case old bad data persists
          if (d && d.payload) {
            console.warn("Detected double-wrapped payload. Unwrapping...");
            d = d.payload;
          }

          if (d) {
            const cleanTopicFreq = (d.topic_frequencies ?? []).map(
              (t: any) => ({
                ...t,
                label: sanitizeTopic(t.label),
              }),
            );

            const cleanPerTopic = (d.per_topic ?? []).map((t: any) => ({
              ...t,
              label: sanitizeTopic(t.label),
            }));

            const cleanNotCovered = (d.not_covered_topics ?? []).map(
              sanitizeTopic,
            );

            setTopicsFrequencyMap(cleanTopicFreq);
            setPaperAverageDifficulty(d.average_difficulty ?? 0);
            setDifficultyFrequency(d.difficulty_frequency ?? []);
            setNotCoveredTopics(cleanNotCovered);
            setDifficultyFrequencyAndAverageDifficultyForEachTopic(
              cleanPerTopic,
            );
          }

          // Update State with SANITIZED data
          setTitle(paperData.title);
          setQuestions(cleanQuestions); // <--- Critical: use the clean version
          setAllTopics(cleanAllTopics); // <--- Critical: use the clean version
          setPaperId(paperIdFromState);
        } catch (err) {
          console.error("Error loading paper/dashboard:", err);
        }
      })();
    }
  }, [paperIdFromState]);

  // Add a NEW useEffect to Auto-Save when metrics are ready
  useEffect(() => {
    // Only auto-save if:
    // 1. We have a paperId (it's a saved paper)
    // 2. We have calculated metrics (e.g. average difficulty is not 0)
    // 3. We haven't fetched a pre-existing dashboard (logic optional, but good for performance)

    if (paperId && paperAverageDifficulty !== 0 && questions.length > 0) {
      const autoSave = async () => {
        // Check if we already have it to avoid spamming (optional optimization)
        const existing = await Api.getPaperDashboard(paperId);
        if (!existing) {
          console.log("Auto-saving generated dashboard...");
          await Api.savePaperDashboard(paperId, paperDataPayload);
        }
      };
      autoSave();
    }
  }, [paperAverageDifficulty, paperId]);

  // Compute metrics whenever we have questions/allTopics ready
  useEffect(() => {
    if (!questions || questions.length === 0 || !allTopics) return;

    const { pieChartTopicsFrequencySeries, notCoveredTopics: notCovered } =
      countTopicsFrequency(questions, allTopics);
    setTopicsFrequencyMap(pieChartTopicsFrequencySeries);
    setNotCoveredTopics(notCovered);

    // average difficulty
    const totalDifficulty = questions.reduce((s, q) => s + q.difficulty, 0);
    setPaperAverageDifficulty(totalDifficulty / questions.length);

    // per-topic difficulty breakdowns
    const questionsForEachTopic = retrieveQuestionsForEachTopic(questions);
    const topicsDifficulty = questionsForEachTopic.map(
      ([topic, qs]: [string, Question[]]) => {
        const details =
          countDifficultyFrequencyAndAverageDifficultyForEachTopic(qs);
        return { label: topic, ...details };
      },
    );
    setDifficultyFrequencyAndAverageDifficultyForEachTopic(topicsDifficulty);

    // global difficulty histogram
    const freqForEachDifficulty =
      calculateFrequencyForEachDifficultyLevel(topicsDifficulty);
    setDifficultyFrequency(freqForEachDifficulty);
  }, [questions, allTopics]);

  const DashboardPageHeader = ({ title }: { title: string }) => (
    <>
      <Typography
        fontWeight={"bolder"}
        sx={{ fontSize: { xs: "1.5rem", xl: "1.8rem" } }}
      >
        {title}
      </Typography>
      <Typography fontWeight={"bolder"} fontSize={"22px"} marginTop={"1rem"}>
        Exam Paper Summary
      </Typography>
    </>
  );

  const TopicsCoveredSection = () =>
    toSubCategorise ? (
      <SubcategorisedTopicsCovered
        topicFrequencies={topicFrequencies}
        onChange={setToSubCategorise}
      />
    ) : (
      <TopicsCovered
        topicFrequencies={topicFrequencies}
        onChange={setToSubCategorise}
      />
    );

  const NotCoveredTopicsSection = () =>
    toSubCategorise ? (
      <SubcategorisedTopicsNotCovered
        notCoveredTopics={notCoveredTopics}
        onChange={setToSubCategorise}
      />
    ) : (
      <TopicsNotCovered
        notCoveredTopics={notCoveredTopics}
        onChange={setToSubCategorise}
      />
    );

  // Build a compact payload to persist
  const paperDataPayload = useMemo(
    () => ({
      title,
      average_difficulty: paperAverageDifficulty,
      topic_frequencies: topicFrequencies, // array of {label,count,...}
      not_covered_topics: notCoveredTopics, // array of strings
      difficulty_frequency: difficultyFrequency, // array of {difficulty,frequency}
      per_topic: difficultyFrequencyAndAverageDifficultyForEachTopic, // array of {label, ...}
    }),
    [
      title,
      paperAverageDifficulty,
      topicFrequencies,
      notCoveredTopics,
      difficultyFrequency,
      difficultyFrequencyAndAverageDifficultyForEachTopic,
    ],
  );

  const handleSavePaperData = async () => {
    try {
      if (!paperId) {
        console.warn("No paperId available — cannot save.");
        return;
      }
      await Api.savePaperDashboard(paperId, paperDataPayload); // <-- wrap it
      console.log("Dashboard data saved successfully for paper", paperId);
    } catch (e) {
      console.error("Error saving dashboard:", e);
    }
  };
  return (
    <Box
      className="outer-page-container"
      mt={"6rem"}
      padding={"2rem"}
      textAlign={"start"}
      mx="auto"
      sx={{
        width: { lg: "91%", xl: "79%" },
        height: { xs: "10%", lg: "12%" },
        backgroundColor: "#fff8f6",
        borderRadius: "3rem",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <DashboardPageHeader title={title} />
        <Button
          variant="contained"
          onClick={handleSavePaperData}
          disabled={!paperId} // only enable when we can associate to a paper
        >
          Save Paper Data
        </Button>
      </Box>

      <Box
        className="dashboard-widget-container"
        display={"flex"}
        flexDirection={"column"}
        sx={{
          backgroundColor: "#fff8f6",
          borderRadius: "3rem",
          mt: "1rem",
          gap: "1.3rem",
        }}
      >
        <OverallDifficulty paperAverageDifficulty={paperAverageDifficulty} />
        <TopicsCoveredSection />
        <AverageDifficultyByTopic
          difficultyFrequencyAndAverageDifficultyForEachTopic={
            difficultyFrequencyAndAverageDifficultyForEachTopic
          }
        />
        <NotCoveredTopicsSection />
        <DifficultyFrequency difficultyFrequency={difficultyFrequency} />
      </Box>
    </Box>
  );
};;;

export default DashboardPage;
