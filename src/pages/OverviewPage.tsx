import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Button,
  Alert,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import Api from "../api/Api"; // Your Api.tsx file
import OverviewQuestionList from "../components/Overview/OverviewQuestionList";
import * as XLSX from "xlsx"; // For file parsing
import StudentChoicePieChart from "../components/Overview/StudentChoicePieChart"; // The new component

// Define the shape of your statistics payload (matches types in Api.tsx)
interface QuestionChoiceStatistics {
  question_id: number;
  statistics: { [key: string]: number };
  grade_statistics?: { [key: string]: number };
}

interface StudentChoiceData {
  questions: QuestionChoiceStatistics[];
}

const OverviewPage = () => {
  const location = useLocation();
  const { paperId, paperTitle } = location.state || {};

  const [paper, setPaper] = useState<any>(null);
  // const [grades, setGrades] = useState<any>(null); // No longer needed
  const [isLoading, setIsLoading] = useState(true);

  // --- State for file upload ---
  const [isUploadingStats, setIsUploadingStats] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  /**
   * Calculates the normalized Shannon entropy (0 to 1).
   * @param statistics - An object like { "A": 0.5, "B": 0.25, "C": 0.25 }
   * @returns A value between 0 (total certainty) and 1 (total randomness).
   */
  const calculateEntropy = (statistics: { [key: string]: number }): number => {
    // Get all non-zero proportions
    const proportions = Object.values(statistics).filter((p) => p > 0);
    const n = proportions.length;

    // If only one option was chosen (or no options), entropy is 0
    if (n <= 1) {
      return 0;
    }

    // We use log base 'n' to normalize the entropy between 0 and 1.
    // Formula: H_n(X) = (-1 / log(n)) * SUM[ p * log(p) ]
    // We use Math.log (natural log) for all calculations.
    const logOfN = Math.log(n);

    const entropySum = proportions.reduce((sum, p) => {
      // p * log(p)
      return sum + p * Math.log(p);
    }, 0);

    // Note: entropySum is negative, so (-1 / logOfN) * entropySum becomes positive.
    const normalizedEntropy = (-1 / logOfN) * entropySum;

    // Handle potential floating point inaccuracies (e.g., -0.0)
    return Math.max(0, normalizedEntropy);
  };


  /**
   * Fetches all data for the overview page.
   * Can be called on initial load and after an upload.
   */
  const fetchData = () => {
    if (!paperId) return;

    if (!paper) {
      setIsLoading(true);
    }

    // We only need to get the paper data now
    Api.getPaperById(paperId)
      .then((paperData) => {
        setPaper(paperData);
      })
      .catch((err) => {
        console.error("Error loading overview data:", err);
        setUploadError("Failed to load paper data.");
      })
      .finally(() => setIsLoading(false));
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [paperId]);

  /**
   * Handles the file upload event.
   * Parses the file, calculates statistics, and sends them to the API.
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !paper) return;

    setIsUploadingStats(true);
    setUploadError(null);
    setUploadSuccess(null);

    // --- DEBUG CHECKPOINT 1 ---
    console.log("File upload started. Reading file...");

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // --- DEBUG CHECKPOINT 2 ---
        console.log("File loaded. Parsing with XLSX...");

        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        // --- DEBUG CHECKPOINT 3 ---
        console.log("File parsed. JSON data:", jsonData);

        const statsPayload: StudentChoiceData = { questions: [] };

        if (jsonData.length === 0) {
          throw new Error("File is empty or in the wrong format.");
        }

        // 1. Find the answer row (case-insensitive check on the 'question' column)
        const answerRow = jsonData.find(
          (row) =>
            String(row["question"] || "")
              .toLowerCase()
              .trim() === "answer",
        );

        // 2. Filter out the answer row to get only student responses
        const studentRows = jsonData.filter(
          (row) =>
            String(row["question"] || "")
              .toLowerCase()
              .trim() !== "answer",
        );
        const totalStudents = studentRows.length;

        if (totalStudents === 0) {
          throw new Error("No student rows found (only answer key?)");
        }

        console.log(
          `Found answer key: ${!!answerRow}. Processing ${totalStudents} student rows.`,
        );

        // --- DEBUG CHECKPOINT 4 ---
        console.log(`Processing ${totalStudents} student entries...`);

        paper.questions.forEach((question: any, index: number) => {
          // --- DEBUG CHECKPOINT 5 (will log for each question) ---
          console.log(
            `Processing Question ${index + 1} (ID: ${question.id}, Number: ${
              question.question_number
            })`,
          );

          const questionKey = question.question_number.toString();
          const choiceCounts: { [key: string]: number } = {};
          let validChoicesFound = 0;

          let correctAnswer: string | null = null;
          let correctCount = 0;
          let incorrectCount = 0;

          if (answerRow && answerRow[questionKey]) {
            correctAnswer = String(answerRow[questionKey]).toUpperCase().trim();
          }

          studentRows.forEach((studentRow) => {
            if (studentRow[questionKey]) {
              const choice = studentRow[questionKey]
                .toString()
                .toUpperCase()
                .trim();

              if (choice) {
                // Choice Stats
                if (!choiceCounts[choice]) {
                  choiceCounts[choice] = 0;
                }
                choiceCounts[choice]++;
                validChoicesFound++;

                // Grade Stats
                if (correctAnswer) {
                  if (choice === correctAnswer) {
                    correctCount++;
                  } else {
                    incorrectCount++;
                  }
                }
              }
            }
          });

          // Calculate Choice Proportions
          const statistics: { [key: string]: number } = {};
          for (const [option, count] of Object.entries(choiceCounts)) {
            statistics[option] =
              validChoicesFound > 0 ? count / validChoicesFound : 0;
          }

          // Calculate Grade Proportions
          const gradeStats: { [key: string]: number } = {};
          if (validChoicesFound > 0 && correctAnswer) {
            gradeStats["correct"] = correctCount / validChoicesFound;
            gradeStats["incorrect"] = incorrectCount / validChoicesFound;
          }

          // Build Payload Item
          const payloadItem: QuestionChoiceStatistics = {
            question_id: question.id,
            statistics: statistics,
          };

          // Only add grade statistics if we actually calculated them
          if (Object.keys(gradeStats).length > 0) {
            payloadItem.grade_statistics = gradeStats;
          }

          statsPayload.questions.push(payloadItem);
        });

        // 3. Save the new statistics
        await Api.saveStudentChoiceStatistics(statsPayload);

        // 4. Refetch data to update UI
        await fetchData();

        setUploadSuccess("Student choices and grades uploaded successfully!");
      } catch (err: any) {
        // --- DEBUG CHECKPOINT FAILED ---
        console.error("CRITICAL ERROR during file processing:", err);
        setUploadError(`Error: ${err.message || "Failed to process file."}`);
        setUploadSuccess(null);
      } finally {
        setIsUploadingStats(false);
        event.target.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };
  // --- Render Logic ---

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!paper) {
    return (
      <Typography variant="h5" textAlign="center" mt={10}>
        No paper data found.
      </Typography>
    );
  }

  // Updated check:
  const hasStudentChoices =
    paper.questions.length > 0 && paper.questions[0].student_choice_statistics;

  return (
    <Box sx={{ p: 3, pt: 15 }}>
      {/* --- Page Header & Upload Button --- */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Overview — {paperTitle || paper.title}
        </Typography>

        <Button
          variant="contained"
          component="label"
          disabled={isUploadingStats}
          color="primary"
        >
          {isUploadingStats ? "Uploading..." : "Upload Student Choices"}
          <input
            type="file"
            hidden
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileUpload}
          />
        </Button>
      </Box>

      {/* --- Upload Status --- */}
      {isUploadingStats && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}
      {uploadSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {uploadSuccess}
        </Alert>
      )}
      {uploadError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {uploadError}
        </Alert>
      )}

      <Divider sx={{ mb: 3, mt: 2 }} />

      {/* --- Main Content --- */}
      {!hasStudentChoices ? (
        // If no student choices, show the question list
        <OverviewQuestionList questions={paper.questions} />
      ) : (
        // Otherwise, show the new student choice pie charts
        <Box>
          <Typography variant="h6" gutterBottom>
            Choice Overview
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box display="flex" flexDirection="column" gap={3}>
            {[...paper.questions]
              .sort((a, b) => a.question_number - b.question_number)
                .map((q: any, index: number) => {
                  const statistics = q.student_choice_statistics || {};
                  const entropy = calculateEntropy(statistics);
                  return (
                    <Box
                      key={q.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "2fr 2fr 1fr" },
                        alignItems: "flex-start",
                        gap: 2,
                        p: 3,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        backgroundColor: "#fff",
                      }}
                    >
                      {/* Column 1: Question */}
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Q{q.question_number}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ whiteSpace: "pre-line", fontSize: "0.95rem" }}
                        >
                          {q.description}
                        </Typography>
                      </Box>

                      {/* Column 2: Overview */}
                      <Box>
                        {q.overview && (
                          <>
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              gutterBottom
                            >
                              Overview
                            </Typography>
                            {Object.entries(q.overview).map(
                              ([opt, detail]: any) => (
                                <Box key={opt} mb={1.5}>
                                  <Typography variant="subtitle2" fontWeight="bold">
                                    Option {opt}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Interpretation:</strong>{" "}
                                    {detail.interpretation}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Likely misunderstanding:</strong>{" "}
                                    {detail.likely_misunderstanding}
                                  </Typography>
                                </Box>
                              )
                            )}
                          </>
                        )}
                      </Box>

                      {/* Column 3: Pie Chart */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <StudentChoicePieChart
                          questionNumber={q.question_number}
                          statistics={q.student_choice_statistics || {}}
                          grade_statistics={q.grade_statistics || {}}
                          entropy={entropy}
                          small
                        />
                      </Box>
                    </Box>
                  )
                })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OverviewPage;
