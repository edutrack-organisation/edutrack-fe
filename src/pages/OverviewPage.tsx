import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Button,
  Alert,
  Chip,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import Api from "../api/Api";
import OverviewQuestionList from "../components/Overview/OverviewQuestionList";
import * as XLSX from "xlsx";
import StudentChoicePieChart from "../components/Overview/StudentChoicePieChart";
import { QuestionChoiceStatistics } from "../types/types";

interface StudentChoiceData {
  questions: QuestionChoiceStatistics[];
}

const OverviewPage = () => {
  const location = useLocation();
  const { paperId, paperTitle } = location.state || {};

  const [paper, setPaper] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isUploadingStats, setIsUploadingStats] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const calculateEntropy = (statistics: { [key: string]: number }): number => {
    const proportions = Object.values(statistics).filter((p) => p > 0);
    const n = proportions.length;
    if (n <= 1) return 0;
    const logOfN = Math.log(n);
    const entropySum = proportions.reduce((sum, p) => sum + p * Math.log(p), 0);
    return Math.max(0, (-1 / logOfN) * entropySum);
  };

  const fetchData = () => {
    if (!paperId) return;
    if (!paper) setIsLoading(true);

    Api.getPaperById(paperId)
      .then((paperData) => setPaper(paperData))
      .catch((err) => {
        console.error("Error loading overview data:", err);
        setUploadError("Failed to load paper data.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [paperId]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !paper) return;

    setIsUploadingStats(true);
    setUploadError(null);
    setUploadSuccess(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });

        const statsPayload: StudentChoiceData = { questions: [] };

        if (rows.length === 0) throw new Error("File is empty.");

        const questionColMap = new Map<number, number>();
        let headerRowIndex = -1;

        for (let i = 0; i < Math.min(10, rows.length); i++) {
          const row = rows[i];
          if (!row) continue;

          let foundAnyQuestion = false;
          paper.questions.forEach((q: any) => {
            const qNum = q.question_number;
            const colIndex = row.findIndex((cell) => {
              if (cell == null) return false;
              const str = String(cell).toLowerCase().trim();
              return (
                str === String(qNum) ||
                str === `q${qNum}` ||
                str === `question ${qNum}`
              );
            });

            if (colIndex !== -1) {
              questionColMap.set(qNum, colIndex);
              foundAnyQuestion = true;
            }
          });

          if (foundAnyQuestion) {
            headerRowIndex = i;
            break;
          }
        }

        if (headerRowIndex === -1 || questionColMap.size === 0) {
          throw new Error("Could not find question columns in the file.");
        }

        let answerRow: any[] | null = null;
        const studentRows: any[][] = [];

        for (let i = headerRowIndex + 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const isAnswerKey = row.some(
            (cell) =>
              String(cell || "")
                .toLowerCase()
                .trim() === "answer" ||
              String(cell || "")
                .toLowerCase()
                .trim() === "answer key",
          );

          if (isAnswerKey) {
            answerRow = row;
          } else {
            studentRows.push(row);
          }
        }

        const totalStudents = studentRows.length;
        if (totalStudents === 0) throw new Error("No student responses found.");

        // Helper to resolve the correct answer (Treats empty cells as "BLANK")
        const resolveAnswer = (q: any, colIdx?: number) => {
          if (answerRow && colIdx !== undefined) {
            const rawExcelAns = answerRow[colIdx];
            if (rawExcelAns == null || String(rawExcelAns).trim() === "") {
              return "BLANK"; // Literal "None" answer
            }
            return String(rawExcelAns).toUpperCase().trim();
          }
          if (q.answer !== undefined && q.answer !== null) {
            if (String(q.answer).trim() === "") return "BLANK";
            return String(q.answer).toUpperCase().trim();
          }
          return null; // Only null if neither Excel nor DB has any record
        };

        const mrqOptionsPoolMap = new Map<number, Set<string>>();
        paper.questions.forEach((q: any) => {
          if (q.type === "MRQ") {
            const colIdx = questionColMap.get(q.question_number);
            const resolvedAns = resolveAnswer(q, colIdx);
            const optionsSet = new Set<string>();

            if (resolvedAns) {
              resolvedAns
                .split(/[,\s;]+/)
                .filter((c) => c && c !== "BLANK")
                .forEach((c) => optionsSet.add(c));
            }

            if (colIdx !== undefined) {
              studentRows.forEach((row) => {
                const rawAns = row[colIdx];
                if (rawAns) {
                  String(rawAns)
                    .toUpperCase()
                    .split(/[,\s;]+/)
                    .filter((c) => c && c !== "BLANK")
                    .forEach((c) => optionsSet.add(c));
                }
              });
            }
            mrqOptionsPoolMap.set(q.question_number, optionsSet);
          }
        });

        let scoredStudents = studentRows.map((row) => {
          let score = 0;
          paper.questions.forEach((q: any) => {
            const colIdx = questionColMap.get(q.question_number);

            if (colIdx !== undefined) {
              const activeAnswer = resolveAnswer(q, colIdx);
              if (!activeAnswer) return;

              const rawStudent = row[colIdx];

              if (q.type === "MRQ") {
                const correctAnsArr =
                  activeAnswer === "BLANK"
                    ? []
                    : activeAnswer.split(/[,\s;]+/).filter((c) => c);
                const studentAnsArr =
                  !rawStudent ||
                  String(rawStudent).trim() === "" ||
                  String(rawStudent).trim().toUpperCase() === "BLANK"
                    ? []
                    : String(rawStudent)
                        .toUpperCase()
                        .split(/[,\s;]+/)
                        .filter((c) => c);

                const correctSet = new Set(correctAnsArr);
                const studentSet = new Set(studentAnsArr);
                const optionsPool = mrqOptionsPoolMap.get(q.question_number);
                const numOptions = optionsPool ? optionsPool.size : 0;

                if (numOptions > 0) {
                  let marks = 0;
                  optionsPool!.forEach((opt) => {
                    if (correctSet.has(opt) === studentSet.has(opt)) marks++;
                  });
                  score += marks / numOptions;
                }
              } else {
                const studentAns =
                  !rawStudent || String(rawStudent).trim() === ""
                    ? "BLANK"
                    : String(rawStudent).toUpperCase().trim();
                if (studentAns === activeAnswer) score++;
              }
            }
          });
          return { rowData: row, score };
        });

        scoredStudents.sort((a, b) => b.score - a.score);

        paper.questions.forEach((question: any) => {
          const qNum = question.question_number;
          const colIndex = questionColMap.get(qNum);

          if (colIndex === undefined) return;

          const qType = question.type || "MCQ";
          const choiceCounts: { [key: string]: number } = {};
          const individualChoiceCounts: { [key: string]: number } = {};
          let validChoicesFound = 0;

          const activeAnswer = resolveAnswer(question, colIndex);
          let totalNormalizedScore = 0;

          studentRows.forEach((studentRow) => {
            const rawStudent = studentRow[colIndex];
            const choice =
              rawStudent == null || String(rawStudent).trim() === ""
                ? "BLANK"
                : String(rawStudent).toUpperCase().trim();

            if (!choiceCounts[choice]) choiceCounts[choice] = 0;
            choiceCounts[choice]++;
            validChoicesFound++;

            if (qType === "MRQ") {
              if (choice === "BLANK") {
                individualChoiceCounts["BLANK"] =
                  (individualChoiceCounts["BLANK"] || 0) + 1;
              } else {
                const individualChoices = choice
                  .split(/[,\s;]+/)
                  .filter((c) => c);
                new Set(individualChoices).forEach((c) => {
                  individualChoiceCounts[c] =
                    (individualChoiceCounts[c] || 0) + 1;
                });
              }
            }

            if (activeAnswer) {
              if (qType === "MRQ") {
                const studentAnsArr =
                  choice === "BLANK"
                    ? []
                    : choice.split(/[,\s;]+/).filter((c) => c);
                const correctAnsArr =
                  activeAnswer === "BLANK"
                    ? []
                    : activeAnswer.split(/[,\s;]+/).filter((c) => c);
                const studentSet = new Set(studentAnsArr);
                const correctSet = new Set(correctAnsArr);

                const optionsPool = mrqOptionsPoolMap.get(qNum);
                const numOptions = optionsPool ? optionsPool.size : 0;

                if (numOptions > 0) {
                  let marks = 0;
                  optionsPool!.forEach((opt) => {
                    if (correctSet.has(opt) === studentSet.has(opt)) marks++;
                  });
                  totalNormalizedScore += marks / numOptions;
                }
              } else {
                if (choice === activeAnswer) totalNormalizedScore += 1;
              }
            }
          });

          const statistics: { [key: string]: number } = {};
          for (const [option, count] of Object.entries(choiceCounts)) {
            statistics[option] =
              validChoicesFound > 0 ? count / validChoicesFound : 0;
          }

          const gradeStats: { [key: string]: number } = {};
          if (validChoicesFound > 0 && activeAnswer) {
            const avgScore = totalNormalizedScore / validChoicesFound;
            gradeStats["correct"] = avgScore;
            gradeStats["incorrect"] = 1 - avgScore;
          }

          let quartileStats: any = undefined;

          if (scoredStudents.length > 0 && activeAnswer) {
            const cohortSize = Math.max(
              1,
              Math.floor(scoredStudents.length * 0.25),
            );
            const topCohort = scoredStudents
              .slice(0, cohortSize)
              .map((s) => s.rowData);
            const bottomCohort = scoredStudents
              .slice(-cohortSize)
              .map((s) => s.rowData);

            const calculateCohortStats = (cohortRows: any[][]) => {
              let cohortTotalScore = 0;
              let cohortValid = 0;
              const cohortChoices: { [key: string]: number } = {};

              cohortRows.forEach((row) => {
                const rawCell = row[colIndex];
                const choice =
                  rawCell == null || String(rawCell).trim() === ""
                    ? "BLANK"
                    : String(rawCell).toUpperCase().trim();

                cohortChoices[choice] = (cohortChoices[choice] || 0) + 1;
                cohortValid++;

                if (qType === "MRQ") {
                  const studentAnsArr =
                    choice === "BLANK"
                      ? []
                      : choice.split(/[,\s;]+/).filter((c) => c);
                  const correctAnsArr =
                    activeAnswer === "BLANK"
                      ? []
                      : activeAnswer.split(/[,\s;]+/).filter((c) => c);
                  const studentSet = new Set(studentAnsArr);
                  const correctSet = new Set(correctAnsArr);

                  const optionsPool = mrqOptionsPoolMap.get(qNum);
                  const numOptions = optionsPool ? optionsPool.size : 0;

                  if (numOptions > 0) {
                    let marks = 0;
                    optionsPool!.forEach((opt) => {
                      if (correctSet.has(opt) === studentSet.has(opt)) marks++;
                    });
                    cohortTotalScore += marks / numOptions;
                  }
                } else {
                  if (choice === activeAnswer) cohortTotalScore += 1;
                }
              });

              const choicesProportions: { [key: string]: number } = {};
              for (const [opt, count] of Object.entries(cohortChoices)) {
                choicesProportions[opt] =
                  cohortValid > 0 ? count / cohortValid : 0;
              }

              return {
                correct_rate:
                  cohortValid > 0 ? cohortTotalScore / cohortValid : 0,
                choices: choicesProportions,
              };
            };

            quartileStats = {
              top_25: calculateCohortStats(topCohort),
              bottom_25: calculateCohortStats(bottomCohort),
            };
          }

          let indStats: { [key: string]: number } | undefined = undefined;
          if (
            qType === "MRQ" &&
            Object.keys(individualChoiceCounts).length > 0
          ) {
            indStats = {};
            for (const [opt, count] of Object.entries(individualChoiceCounts)) {
              indStats[opt] =
                validChoicesFound > 0 ? count / validChoicesFound : 0;
            }
          }

          const payloadItem: QuestionChoiceStatistics = {
            question_id: question.id,
            statistics: statistics,
            answer: activeAnswer || undefined,
          };

          if (indStats) payloadItem.individual_choice_statistics = indStats;
          if (Object.keys(gradeStats).length > 0)
            payloadItem.grade_statistics = gradeStats;
          if (quartileStats) payloadItem.quartile_statistics = quartileStats;

          statsPayload.questions.push(payloadItem);
        });

        await Api.saveStudentChoiceStatistics(statsPayload);
        await fetchData();

        setUploadSuccess("Student choices and grades uploaded successfully!");
      } catch (err: any) {
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

  const hasStudentChoices =
    paper.questions.length > 0 && paper.questions[0].student_choice_statistics;

  const formatDescription = (description: string, q: any) => {
    const answerKey = q.answer;
    if (!description || !answerKey) return description;

    if (answerKey === "BLANK") {
      return description + "\n\n✅ Correct Action: Leave Blank (None)";
    }

    let formattedDesc = description;
    const individualAnswers = String(answerKey)
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean);

    individualAnswers.forEach((ans) => {
      const regex = new RegExp(`^\\s*(${ans}[.)].*)`, "gim");
      formattedDesc = formattedDesc.replace(regex, "$1  ✅ (correct)");
    });

    return formattedDesc;
  };

  return (
    <Box sx={{ p: 3, pt: 15 }}>
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

      {!hasStudentChoices ? (
        <OverviewQuestionList questions={paper.questions} />
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            Choice Overview
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box display="flex" flexDirection="column" gap={3}>
            {[...paper.questions]
              .sort((a, b) => a.question_number - b.question_number)
              .map((q: any) => {
                const statistics = q.student_choice_statistics || {};
                const entropy = calculateEntropy(statistics);
                const correctAnswer = q.answer || null;

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
                    <Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={2}
                      >
                        <Typography variant="h6">
                          Q{q.question_number}
                        </Typography>
                        <Box display="flex" gap={1}>
                          <Chip
                            label={q.type}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          {q.answer ? (
                            <Chip
                              label={`Answer: ${q.answer === "BLANK" ? "None (Blank)" : q.answer}`}
                              size="small"
                              color="success"
                            />
                          ) : (
                            <Chip
                              label="No Answer Key"
                              size="small"
                              color="error"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />

                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-line", fontSize: "0.95rem" }}
                      >
                        {formatDescription(q.description, q)}
                      </Typography>

                      {!q.answer && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{ mt: 2, fontStyle: "italic" }}
                        >
                          * No answer key assigned in the database for this
                          question. Re-upload the Excel sheet containing the
                          'Answer Key' row.
                        </Typography>
                      )}
                    </Box>

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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="bold"
                                >
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
                            ),
                          )}
                        </>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <StudentChoicePieChart
                        questionNumber={q.question_number}
                        type={q.type}
                        statistics={q.student_choice_statistics || {}}
                        individual_choice_statistics={
                          q.individual_choice_statistics
                        }
                        grade_statistics={q.grade_statistics || {}}
                        entropy={entropy}
                        correctAnswer={correctAnswer}
                        small
                      />
                    </Box>
                  </Box>
                );
              })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OverviewPage;
