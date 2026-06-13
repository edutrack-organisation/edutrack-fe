import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Divider,
  Paper as MuiPaper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import toast from "react-hot-toast";
import Api from "../api/Api";
import { PaperSummary, PaperComparisonDB } from "../types/types";
import { theme } from "../theme";

const ComparisonPage = () => {
  const [papers, setPapers] = useState<PaperSummary[]>([]);
  const [comparisons, setComparisons] = useState<PaperComparisonDB[]>([]);
  const [selectedComparison, setSelectedComparison] =
    useState<PaperComparisonDB | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for the Modal
  const [baselineId, setBaselineId] = useState<number | "">("");
  const [comparisonId, setComparisonId] = useState<number | "">("");

  // Initial Load: Fetch all papers (for the dropdowns and titles) and all saved comparisons
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [papersData, comparisonsData] = await Promise.all([
          Api.getPapersSummary(),
          Api.getAllComparisons(),
        ]);
        setPapers(papersData);
        setComparisons(comparisonsData);
      } catch (error) {
        toast.error("Failed to load initial data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Helper to get paper title from ID
  const getPaperTitle = (id: number) => {
    const paper = papers.find((p) => p.id === id);
    return paper ? paper.title : `Paper ID ${id}`;
  };

  const handleGenerate = async () => {
    if (baselineId === "" || comparisonId === "") {
      toast.error("Please select both papers.");
      return;
    }
    if (baselineId === comparisonId) {
      toast.error("Please select two different papers.");
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading(
      "Generating AI Comparison... This might take a minute.",
    );

    try {
      const newComparison = await Api.generateComparison(
        baselineId as number,
        comparisonId as number,
      );

      // Update the list and select the new one
      setComparisons((prev) => {
        // Remove if it already existed in state to avoid duplicates, then push new
        const filtered = prev.filter((c) => c.id !== newComparison.id);
        return [...filtered, newComparison];
      });
      setSelectedComparison(newComparison);
      setIsModalOpen(false);
      setBaselineId("");
      setComparisonId("");
      toast.success("Comparison generated!", { id: toastId });
    } catch (error) {
      toast.error("Failed to generate comparison.", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

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
      {/* SIDEBAR: List of Comparisons */}
      <Box
        className="scrollable"
        sx={{
          flex: 2,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          borderRight: "0.25rem solid",
          borderColor: theme.colors.highlight1,
        }}
      >
        <Box p={2}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
            sx={{ backgroundColor: theme.colors.primary }}
          >
            New Comparison
          </Button>
        </Box>
        <Divider />
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack flex={1} divider={<Divider flexItem />}>
            {comparisons.map((comp) => (
              <Button
                key={comp.id}
                onClick={() => setSelectedComparison(comp)}
                variant={
                  selectedComparison?.id === comp.id ? "contained" : "text"
                }
                sx={{
                  justifyContent: "flex-start",
                  padding: "1rem",
                  textAlign: "left",
                  textTransform: "none",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="body2"
                  color={
                    selectedComparison?.id === comp.id
                      ? "inherit"
                      : "text.secondary"
                  }
                >
                  Baseline: {getPaperTitle(comp.baseline_paper_id)}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  mt={0.5}
                  color={
                    selectedComparison?.id === comp.id ? "inherit" : "primary"
                  }
                >
                  vs. {getPaperTitle(comp.comparison_paper_id)}
                </Typography>
              </Button>
            ))}
            {comparisons.length === 0 && (
              <Typography p={2} color="text.secondary" textAlign="center">
                No comparisons yet.
              </Typography>
            )}
          </Stack>
        )}
      </Box>

      {/* MAIN CONTENT AREA */}
      <Box sx={{ flex: 5, overflowY: "auto", p: 4 }} className="scrollable">
        {selectedComparison ? (
          <Stack spacing={4}>
            {/* Header */}
            <MuiPaper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Cohort Comparison
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {getPaperTitle(selectedComparison.baseline_paper_id)}
                <CompareArrowsIcon fontSize="small" />
                {getPaperTitle(selectedComparison.comparison_paper_id)}
              </Typography>
            </MuiPaper>

            {/* Executive Summary & Performance */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <MuiPaper
                elevation={0}
                sx={{
                  p: 3,
                  flex: 1,
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Executive Summary
                </Typography>
                <Typography variant="body1">
                  {selectedComparison.comparison_data.executive_summary}
                </Typography>
              </MuiPaper>
              <MuiPaper
                elevation={0}
                sx={{
                  p: 3,
                  flex: 1,
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Performance Shift
                </Typography>
                <Typography variant="body1">
                  {selectedComparison.comparison_data.performance_shift}
                </Typography>
              </MuiPaper>
            </Stack>

            {/* Topic Insights */}
            <MuiPaper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Topic Mastery Insights
              </Typography>
              <Stack spacing={2}>
                {selectedComparison.comparison_data.topic_insights.map(
                  (topic, idx) => (
                    <Box
                      key={idx}
                      p={2}
                      sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="primary"
                      >
                        {topic.topic_name} (Better:{" "}
                        {topic.better_performing_cohort})
                      </Typography>
                      <Typography variant="body2" mt={1}>
                        {topic.analysis}
                      </Typography>
                    </Box>
                  ),
                )}
              </Stack>
            </MuiPaper>

            {/* Cognitive Depth & Recommendations */}
            <MuiPaper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Cognitive Depth Analysis
              </Typography>
              <Typography variant="body1" mb={3}>
                {selectedComparison.comparison_data.cognitive_depth_analysis}
              </Typography>

              <Typography variant="h6" fontWeight="bold" mb={1}>
                Actionable Recommendations
              </Typography>
              <ul>
                {selectedComparison.comparison_data.actionable_recommendations.map(
                  (rec, idx) => (
                    <li key={idx}>
                      <Typography variant="body1" mb={1}>
                        {rec}
                      </Typography>
                    </li>
                  ),
                )}
              </ul>
            </MuiPaper>
          </Stack>
        ) : (
          <Box
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h5" color="text.disabled">
              Select a comparison or generate a new one.
            </Typography>
          </Box>
        )}
      </Box>

      {/* NEW COMPARISON MODAL */}
      <Dialog
        open={isModalOpen}
        onClose={() => !isGenerating && setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Generate AI Comparison</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Baseline Paper</InputLabel>
              <Select
                value={baselineId}
                label="Baseline Paper"
                onChange={(e) => setBaselineId(e.target.value as number)}
              >
                {papers.map((p) => (
                  <MenuItem
                    key={p.id}
                    value={p.id}
                    disabled={p.id === comparisonId}
                  >
                    {p.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Comparison Paper</InputLabel>
              <Select
                value={comparisonId}
                label="Comparison Paper"
                onChange={(e) => setComparisonId(e.target.value as number)}
              >
                {papers.map((p) => (
                  <MenuItem
                    key={p.id}
                    value={p.id}
                    disabled={p.id === baselineId}
                  >
                    {p.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setIsModalOpen(false)} disabled={isGenerating}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComparisonPage;
