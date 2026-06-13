import {
  Box,
  CircularProgress,
  Typography,
  Stack,
  Button,
  Divider,
  Paper as MuiPaper,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "../api/Api";
import { Paper, PaperSummary, GradeDistribution, AIAnalysisPayload } from "../types/types";
import { theme } from "../theme";
import ContentTableFromTitle from "../components/ContentTableFromTitle";
import * as XLSX from "xlsx";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AdjustIcon from "@mui/icons-material/Adjust";
import SchoolIcon from "@mui/icons-material/School";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PsychologyIcon from "@mui/icons-material/Psychology";
import toast from "react-hot-toast";
import "../App.css";

const ViewPdfPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isFetchingList, setIsFetchingList] = useState<boolean>(true);
  const [isFetchingPaper, setIsFetchingPaper] = useState<boolean>(false);
  const [paperList, setPaperList] = useState<PaperSummary[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [histogramData, setHistogramData] = useState<GradeDistribution | null>(
    null,
  );
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [existingAnalysis, setExistingAnalysis] =
    useState<AIAnalysisPayload | null>(null);

  // ✅ Edit Mode States
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [editValues, setEditValues] = useState({
    title: "",
    module_code: "",
    module_name: "",
    academic_year: "",
    semester: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsFetchingList(true);
    Api.getPapersSummary()
      .then((papers) => {
        setPaperList(papers);
        const autoSelectTitle = location?.state?.response?.data?.title ?? "";
        if (autoSelectTitle) {
          const paperToSelect = [...papers]
            .reverse()
            .find((p) => p.title === autoSelectTitle);
          if (paperToSelect) {
            handlePaperSelect(paperToSelect.id);
          }
        }
      })
      .catch((error) => console.error("API Error fetching paper list:", error))
      .finally(() => setIsFetchingList(false));
  }, [location.state]);

  const handlePaperSelect = (id: number) => {
    if (selectedPaper?.id === id) return;
    setIsFetchingPaper(true);
    setSelectedPaper(null);
    setHistogramData(null);
    setIsEditingMetadata(false); // Reset edit mode on switch

    Api.getPaperById(id)
      .then((paper) => {
        setSelectedPaper(paper);
        // Initialize edit values
        setEditValues({
          title: paper.title,
          module_code: paper.module_code || "",
          module_name: paper.module_name || "",
          academic_year: paper.academic_year || "",
          semester: paper.semester || "",
        });
      })
      .catch((error) =>
        console.error(`Error fetching paper with ID ${id}:`, error),
      )
      .finally(() => setIsFetchingPaper(false));

    Api.getGradeDistribution(id)
      .then((data) => {
        if (data) setHistogramData(data);
      })
      .catch(() => console.log("No grade data found for this paper yet."));
    setExistingAnalysis(null);

    Api.getAIAnalysis(id)
      .then((data) => {
        if (data) setExistingAnalysis(data.analysis_data);
      })
      .catch(() => console.log("No AI analysis found for this paper yet."));
  };

  // ✅ Handle Edit/Save/Cancel Logic
  const handleEditClick = () => {
    setIsEditingMetadata(true);
  };

  const handleCancelEdit = () => {
    if (selectedPaper) {
      // Revert values
      setEditValues({
        title: selectedPaper.title,
        module_code: selectedPaper.module_code || "",
        module_name: selectedPaper.module_name || "",
        academic_year: selectedPaper.academic_year || "",
        semester: selectedPaper.semester || "",
      });
    }
    setIsEditingMetadata(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedPaper) return;

    try {
      const updatedPaper = await Api.updatePaperMetadata(
        selectedPaper.id,
        editValues,
      );
      setSelectedPaper(updatedPaper);

      // Update the sidebar list title if it changed
      setPaperList((prev) =>
        prev.map((p) =>
          p.id === updatedPaper.id ? { ...p, title: updatedPaper.title } : p,
        ),
      );

      setIsEditingMetadata(false);
      toast.success("Paper details updated successfully!");
    } catch (error) {
      toast.error("Failed to update paper details.");
      console.error(error);
    }
  };

  const handleGradesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPaper) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, {
          type: file.name.endsWith(".csv") ? "string" : "binary",
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const studentData: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (studentData.length === 0)
          throw new Error("The uploaded file is empty or in the wrong format.");

        const questionHeaders = Object.keys(studentData[0]).filter((key) =>
          key.toUpperCase().startsWith("Q"),
        );
        if (questionHeaders.length === 0)
          throw new Error(
            "No question columns (e.g., Q1, Q2) found in the file.",
          );

        let totalPossibleMarks = 0;
        questionHeaders.forEach((header) => {
          const marks = studentData.map(
            (student) => parseFloat(student[header]) || 0,
          );
          totalPossibleMarks += Math.max(...marks);
        });

        if (totalPossibleMarks === 0)
          throw new Error("Could not determine total marks from the file.");

        const percentageScores = studentData.map((student) => {
          const studentTotalScore = questionHeaders.reduce(
            (sum, header) => sum + (parseFloat(student[header]) || 0),
            0,
          );
          return (studentTotalScore / totalPossibleMarks) * 100;
        });

        const bins = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        const counts = Array(bins.length - 1).fill(0);
        const labels = bins
          .slice(0, -1)
          .map((bin, i) => `${bin}-${bins[i + 1]}%`);

        percentageScores.forEach((score) => {
          const capped = Math.max(0, Math.min(score, 100));
          const idx = capped === 100 ? 9 : Math.floor(capped / 10);
          counts[idx]++;
        });

        const totalStudents = percentageScores.length;
        const averageScore =
          percentageScores.reduce((a, b) => a + b, 0) / totalStudents;

        let stdDev = 0;
        if (totalStudents > 1) {
          const sumOfSquaredDiffs = percentageScores.reduce((acc, score) => {
            return acc + Math.pow(score - averageScore, 2);
          }, 0);

          // Using (n-1) for sample standard deviation
          const variance = sumOfSquaredDiffs / (totalStudents - 1);
          stdDev = Math.sqrt(variance);
        }

        const payload: GradeDistribution = {
          bins: labels,
          counts,
          total_students: totalStudents,
          average_score: parseFloat(averageScore.toFixed(2)),
          standard_deviation: parseFloat(stdDev.toFixed(2)),
        };

        toast.promise(Api.saveGradeDistribution(selectedPaper.id, payload), {
          loading: "Saving grade data...",
          success: (savedData) => {
            setHistogramData(savedData);
            return "Grades saved successfully!";
          },
          error: "Failed to save grades.",
        });
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to process file.",
        );
      }
    };

    if (file.name.endsWith(".csv")) reader.readAsText(file);
    else reader.readAsBinaryString(file);
  };

  const handleAIAnalysisClick = async () => {
    if (!selectedPaper) return;

    // 1. If it already exists, just navigate immediately!
    if (existingAnalysis) {
      navigate("/ai-analysis", {
        state: {
          paperId: selectedPaper.id,
          paperTitle: selectedPaper.title,
          analysisData: existingAnalysis,
        },
      });
      return;
    }

    // 2. If it DOES NOT exist, run the generation sequence
    setIsGeneratingAI(true);
    const toastId = toast.loading(
      "Analyzing paper with AI... This may take a minute.",
    );

    try {
      const analysisResult = await Api.generateAIAnalysis(selectedPaper.id);

      // Update local state so it doesn't regenerate if they click back
      setExistingAnalysis(analysisResult.analysis_data);
      toast.success("AI Analysis generated successfully!", { id: toastId });

      navigate("/ai-analysis", {
        state: {
          paperId: selectedPaper.id,
          paperTitle: selectedPaper.title,
          analysisData: analysisResult.analysis_data,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate AI analysis.", { id: toastId });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const SelectPaperPanel = () => (
    <Stack flex={1} divider={<Divider flexItem />}>
      {paperList.map((paper) => (
        <Button
          key={paper.id}
          sx={{
            justifyContent: "flex-start",
            padding: "1rem",
            lineHeight: "1.4",
            whiteSpace: "normal",
            textAlign: "left",
            textTransform: "none",
          }}
          onClick={() => handlePaperSelect(paper.id)}
          variant={selectedPaper?.id === paper.id ? "contained" : "text"}
        >
          {paper.title}
        </Button>
      ))}
    </Stack>
  );

  return (
    <Box
      sx={{
        flex: 1,
        height: "calc(100vh - 5rem)",
        display: "flex",
        backgroundColor: theme.colors.secondary,
        mt: "5rem",
      }}
    >
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleGradesUpload}
      />

      {/* Sidebar */}
      <Box
        className="scrollable"
        sx={{ flex: 2, display: "flex", overflowY: "auto" }}
      >
        {isFetchingList ? (
          <Box sx={{ flex: 1, alignSelf: "center", textAlign: "center" }}>
            <CircularProgress
              size={"100px"}
              sx={{ color: theme.colors.highlight1 }}
            />
          </Box>
        ) : (
          <SelectPaperPanel />
        )}
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{
          backgroundColor: theme.colors.highlight1,
          width: "0.25rem",
          borderRadius: 3,
          margin: 1,
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          flex: 5,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
        className="scrollable"
      >
        {isFetchingPaper ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size={"100px"} />
          </Box>
        ) : selectedPaper ? (
          <Box p={3}>
            {/* ✅ HEADER SECTION */}
            <MuiPaper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                position: "relative", // For absolute positioning of edit button
              }}
            >
              {/* Edit/Save Actions in Top Right */}
              <Box
                sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}
              >
                {isEditingMetadata ? (
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Cancel">
                      <IconButton
                        size="small"
                        onClick={handleCancelEdit}
                        color="error"
                        sx={{ border: "1px solid", borderColor: "error.main" }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Save Changes">
                      <IconButton
                        size="small"
                        onClick={handleSaveEdit}
                        color="success"
                        sx={{
                          border: "1px solid",
                          borderColor: "success.main",
                          bgcolor: "success.light",
                          color: "white",
                          "&:hover": { bgcolor: "success.main" },
                        }}
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ) : (
                  <Tooltip title="Edit Details">
                    <IconButton onClick={handleEditClick} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                {/* Left Side: Information / Inputs */}
                <Box sx={{ width: "100%", pr: 6 }}>
                  {isEditingMetadata ? (
                    // ✍️ EDIT MODE
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Paper Title"
                        value={editValues.title}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            title: e.target.value,
                          })
                        }
                        variant="outlined"
                        size="small"
                      />
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="Module Code"
                          value={editValues.module_code}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              module_code: e.target.value,
                            })
                          }
                          size="small"
                          sx={{ width: "150px" }}
                        />
                        <TextField
                          label="Module Name"
                          value={editValues.module_name}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              module_name: e.target.value,
                            })
                          }
                          size="small"
                          fullWidth
                        />
                      </Stack>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="Academic Year"
                          value={editValues.academic_year}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              academic_year: e.target.value,
                            })
                          }
                          size="small"
                          sx={{ width: "150px" }}
                        />
                        <TextField
                          label="Semester"
                          value={editValues.semester}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              semester: e.target.value,
                            })
                          }
                          size="small"
                          sx={{ width: "100px" }}
                        />
                      </Stack>
                    </Stack>
                  ) : (
                    // 👀 VIEW MODE
                    <>
                      <Typography
                        variant="h4"
                        fontWeight="800"
                        color="text.primary"
                        sx={{ mb: 1.5, letterSpacing: "-0.5px" }}
                      >
                        {selectedPaper.title}
                      </Typography>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        flexWrap="wrap"
                        rowGap={1}
                      >
                        {selectedPaper.module_code && (
                          <Typography
                            variant="h6"
                            fontWeight="700"
                            sx={{ color: theme.colors.primary }}
                          >
                            {selectedPaper.module_code}
                          </Typography>
                        )}

                        {selectedPaper.module_name && (
                          <>
                            {selectedPaper.module_code && (
                              <Divider
                                orientation="vertical"
                                flexItem
                                sx={{ height: 20, alignSelf: "center" }}
                              />
                            )}
                            <Typography
                              variant="h6"
                              color="text.secondary"
                              fontWeight="500"
                            >
                              {selectedPaper.module_name}
                            </Typography>
                          </>
                        )}

                        {(selectedPaper.academic_year ||
                          selectedPaper.semester) && (
                          <Box
                            sx={{
                              ml: { xs: 0, md: 2 },
                              px: 1.5,
                              py: 0.5,
                              borderRadius: "6px",
                              backgroundColor: "#f5f5f5",
                              border: "1px solid #e0e0e0",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <SchoolIcon
                              sx={{ fontSize: 16, color: "text.disabled" }}
                            />
                            <Typography
                              variant="body2"
                              fontWeight="600"
                              color="text.secondary"
                              sx={{ fontSize: "0.85rem" }}
                            >
                              {selectedPaper.academic_year}
                              {selectedPaper.academic_year &&
                                selectedPaper.semester &&
                                " • "}
                              {selectedPaper.semester
                                ? `Sem ${selectedPaper.semester}`
                                : ""}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </>
                  )}
                </Box>
              </Stack>

              {/* Action Buttons (Always Visible at bottom) */}
              <Stack
                direction="row"
                spacing={1}
                mt={3}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  startIcon={<FileUploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isEditingMetadata}
                >
                  Grades
                  </Button>
                  <Button
                  variant="contained"
                  color="secondary" // Or primary, depending on your theme emphasis
                  startIcon={
                    isGeneratingAI ? <CircularProgress size={20} color="inherit" /> : <PsychologyIcon />
                  }
                  disabled={isEditingMetadata || isGeneratingAI}
                  onClick={handleAIAnalysisClick}
                  sx={{
                    background: "linear-gradient(45deg, #58bbc6 30%, #5884c6 90%)", // Optional: cool AI gradient
                    color: "white",
                  }}
                >
                  {isGeneratingAI ? "Analyzing..." : "AI Insights"}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<DashboardIcon />}
                  disabled={isEditingMetadata}
                  onClick={() =>
                    navigate("/dashboard", {
                      state: {
                        paperId: selectedPaper.id,
                        paperTitle: selectedPaper.title,
                      },
                    })
                  }
                >
                  Dashboard
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<AdjustIcon />}
                  disabled={isEditingMetadata}
                  onClick={() =>
                    navigate("/overview", {
                      state: {
                        paperId: selectedPaper.id,
                        paperTitle: selectedPaper.title,
                      },
                    })
                  }
                >
                  Overview
                </Button>
              </Stack>
            </MuiPaper>

            <ContentTableFromTitle paper={selectedPaper} />
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              fontSize={"2rem"}
              fontWeight={"bold"}
              fontFamily={"monospace"}
              color="text.disabled"
            >
              Select a previously uploaded paper to view.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ViewPdfPage;
