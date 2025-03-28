import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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

interface DifficultyFrequencyType {
    difficulty: number;
    frequency: number;
    [key: string]: number; // Add index signature for MUI X Charts
}

// NOTE: to render the page, current flow to pass in the questions and allTopics from the previous page
const DashboardPage = () => {
    const location = useLocation();
    const {
        savedPaper: { title, questions, allTopics },
    }: {
        savedPaper: {
            title: string;
            questions: Question[];
            allTopics: string[];
        };
    } = location.state; // Retrieve state passed from previous page

    const [toSubCategorise, setToSubCategorise] = useState<boolean>(true); // Controls whether topics should be displayed in categorized or flat view
    const [topicFrequencies, setTopicsFrequencyMap] = useState<TopicFrequency[]>([]); // This is the frequency of each topic
    const [notCoveredTopics, setNotCoveredTopics] = useState<string[]>([]); // This are the topics that are not covered by this exam paper
    const [paperAverageDifficulty, setPaperAverageDifficulty] = useState<number>(0); // This is the overall paper average difficulty
    const [
        difficultyFrequencyAndAverageDifficultyForEachTopic,
        setDifficultyFrequencyAndAverageDifficultyForEachTopic,
    ] = useState<DifficultyFrequencyAndAverageDifficultyForTopic[]>([]); // This the difficulty frequency and average difficulty for each topic
    const [difficultyFrequency, setDifficultyFrequency] = useState<DifficultyFrequencyType[]>([]); // This is the frequency of each difficulty level for the entire paper

    /**
     * This function calculates the average difficulty of the paper
     * @param questions
     */
    function calculateAverageDifficulty(questions: Question[]) {
        const totalDifficulty = questions.reduce((sum, question) => sum + question.difficulty, 0);
        setPaperAverageDifficulty(totalDifficulty / questions.length);
    }

    /**
     * Renders the header section of the dashboard
     * @param title - The title of the exam paper
     * @returns JSX element containing the paper title and a fixed "Exam Paper Summary" subtitle
     */
    const DashboardPageHeader = ({ title }: { title: string }) => {
        return (
            <>
                <Typography
                    fontWeight={"bolder"}
                    sx={{
                        fontSize: { xs: "1.5rem", xl: "1.8rem" },
                    }}
                >
                    {title}
                </Typography>

                <Typography fontWeight={"bolder"} fontSize={"22px"} marginTop={"1rem"}>
                    Exam Paper Summary
                </Typography>
            </>
        );
    };

    /**
     * Renders the topics covered section with toggle functionality
     * Switches between categorized and flat view based on toSubCategorise state
     * @returns JSX element containing either SubcategorisedTopicsCovered or TopicsCovered component
     */
    const TopicsCoveredSection = () => (
        <>
            {toSubCategorise ? (
                <SubcategorisedTopicsCovered topicFrequencies={topicFrequencies} onChange={setToSubCategorise} />
            ) : (
                <TopicsCovered topicFrequencies={topicFrequencies} onChange={setToSubCategorise} />
            )}
        </>
    );

    /**
     * Renders the topics not covered section with toggle functionality
     * Switches between categorized and flat view based on toSubCategorise state
     * @returns JSX element containing either SubcategorisedTopicsNotCovered or TopicsNotCovered component
     */
    const NotCoveredTopicsSection = () => (
        <>
            {toSubCategorise ? (
                <SubcategorisedTopicsNotCovered notCoveredTopics={notCoveredTopics} onChange={setToSubCategorise} />
            ) : (
                <TopicsNotCovered notCoveredTopics={notCoveredTopics} onChange={setToSubCategorise} />
            )}
        </>
    );

    useEffect(() => {
        // Calculate topic frequencies and not covered topics
        const { pieChartTopicsFrequencySeries, notCoveredTopics } = countTopicsFrequency(questions, allTopics);
        setTopicsFrequencyMap(pieChartTopicsFrequencySeries);
        setNotCoveredTopics(notCoveredTopics);

        // Calculate average difficulty of the paper
        calculateAverageDifficulty(questions);

        // Retrieves the questions for each topic
        const questionsForEachTopic = retrieveQuestionsForEachTopic(questions);
        // Calculate difficulty frequency and average difficulty for each topic
        const topicsDifficultyFrequencyAndAverageDifficulty = questionsForEachTopic.map(
            ([topic, questions]: [string, Question[]]) => {
                const details = countDifficultyFrequencyAndAverageDifficultyForEachTopic(questions);
                return {
                    label: topic,
                    ...details,
                };
            }
        );
        setDifficultyFrequencyAndAverageDifficultyForEachTopic(topicsDifficultyFrequencyAndAverageDifficulty);

        // count the frequency of each difficulty level
        const frequencyForEachDifficultyLevel = calculateFrequencyForEachDifficultyLevel(
            topicsDifficultyFrequencyAndAverageDifficulty
        );
        setDifficultyFrequency(frequencyForEachDifficultyLevel);
    }, [questions]);

    return (
        <Box
            className="outer-page-container"
            mt={"6rem"} // margin to accomodate fixed navbar
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
            <DashboardPageHeader title={title} />
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
};

export default DashboardPage;
