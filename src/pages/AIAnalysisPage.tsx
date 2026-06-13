import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Collapse
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupsIcon from "@mui/icons-material/Groups";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PsychologyIcon from "@mui/icons-material/Psychology";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import RuleIcon from "@mui/icons-material/Rule";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ExpandLess } from "@mui/icons-material";
import { ExpandMore } from "@mui/icons-material";
import toast from "react-hot-toast";

import { AIAnalysisPayload } from "../types/types";
import { theme } from "../theme";
import Api from "../api/Api"; // Make sure Api is imported!

const AIAnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Extract the initial data passed from ViewPdfPage
  const {
    paperId,
    paperTitle,
    analysisData: initialData,
  } = (location.state as {
    paperId?: number;
    paperTitle?: string;
    analysisData?: AIAnalysisPayload;
  }) || {};

  // 2. Put the data into a state variable so we can overwrite it when regenerating
  const [analysisData, setAnalysisData] = useState<
    AIAnalysisPayload | undefined
  >(initialData);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  // Fallback if the user navigates directly to this URL without data
  if (!analysisData || !paperId) {
    return (
      <Box sx={{ p: 4, mt: "5rem", textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No analysis data found.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Return to Papers
        </Button>
      </Box>
    );
  }

  // 3. The Regenerate Handler
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const toastId = toast.loading(
      "Regenerating AI Analysis... This may take a minute.",
    );

    try {
      // Calls the same POST endpoint, which will overwrite the database record
      const result = await Api.generateAIAnalysis(paperId);

      // Instantly update the UI with the fresh data
      setAnalysisData(result.analysis_data);
      toast.success("Analysis updated successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to regenerate analysis.", { id: toastId });
    } finally {
      setIsRegenerating(false);
    }
  };

  const parseMarkdownBold = (text: string) => {
    // Splits the string at every instance of **text**, keeping the asterisks
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return (
      <>
        {parts.map((part, index) => {
          // If the part starts and ends with **, remove them and render as strong
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <Box
                component="strong"
                sx={{ color: "text.primary" }}
                key={index}
              >
                {part.slice(2, -2)}
              </Box>
            );
          }
          // Otherwise, return the normal text
          return part;
        })}
      </>
    );
  };

  // 4. Collapsible Item Component
  const CollapsibleInsightItem = ({
    item,
    iconColor,
  }: {
    item: string;
    iconColor: string;
  }) => {
    // Default open to true so users see full content initially
    const [open, setOpen] = useState(true);

    // Regex to extract the first bolded segment as the heading, and the rest as content.
    // Handles leading dashes/bullets and trailing colons.
    const match = item.match(/^\s*(?:[-*]\s*)?\*\*(.*?)\*\*(.*)/s);

    if (!match) {
      // Fallback: If the string doesn't start with a bold heading, render standard list item
      return (
        <ListItem sx={{ alignItems: "flex-start", px: 0 }}>
          <ListItemIcon sx={{ minWidth: 28, mt: 0.5, color: iconColor }}>
            •
          </ListItemIcon>
          <ListItemText
            primary={parseMarkdownBold(item)}
            primaryTypographyProps={{
              variant: "body1",
              color: "text.secondary",
              lineHeight: 1.6,
            }}
          />
        </ListItem>
      );
    }

    const heading = match[1].trim();
    // Clean up leading punctuation from content (like ":" or "-")
    const content = match[2].trim().replace(/^[:\-.]\s*/, "");

    return (
      <ListItem
        sx={{ flexDirection: "column", alignItems: "flex-start", px: 0, py: 1 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            width: "100%",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => setOpen(!open)}
        >
          <ListItemIcon sx={{ minWidth: 28, mt: 0.25, color: iconColor }}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
          <ListItemText
            primary={heading}
            primaryTypographyProps={{
              variant: "body1",
              fontWeight: "bold",
              color: "text.primary",
            }}
            sx={{ m: 0 }}
          />
        </Box>
        <Collapse in={open} timeout="auto" unmountOnExit sx={{ width: "100%" }}>
          <Box sx={{ pl: 3.5, pt: 1 }}>
            <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
              {parseMarkdownBold(content)}
            </Typography>
          </Box>
        </Collapse>
      </ListItem>
    );
  };

  // Helper component to render each section cleanly
  const AnalysisSection = ({
    title,
    items,
    icon,
    iconColor,
  }: {
    title: string;
    items: string[];
    icon: React.ReactNode;
    iconColor: string;
  }) => (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 2,
        borderTop: `4px solid ${iconColor}`,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
        <Box sx={{ color: iconColor, display: "flex" }}>{icon}</Box>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      {items && items.length > 0 ? (
        <List dense sx={{ p: 0 }}>
          {items.map((item, index) => (
            <CollapsibleInsightItem
              key={index}
              item={item}
              iconColor={iconColor}
            />
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.disabled">
          No insights generated for this section.
        </Typography>
      )}
    </Paper>
  );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        mt: "5rem",
        backgroundColor: theme.colors.secondary || "#f8f9fa",
        minHeight: "calc(100vh - 5rem)",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        mb={4}
      >
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)} // Goes back to ViewPdfPage
            sx={{ mb: 1 }}
          >
            Back to Paper
          </Button>
          <Typography variant="h4" fontWeight="800" color="text.primary">
            AI Pedagogical Analysis
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {paperTitle}
          </Typography>
        </Box>

        {/* 🚀 The new Regenerate Button 🚀 */}
        <Button
          variant="outlined"
          color="primary"
          startIcon={
            isRegenerating ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <RefreshIcon />
            )
          }
          onClick={handleRegenerate}
          disabled={isRegenerating}
          sx={{ mt: 4 }} // Aligns it nicely with the title
        >
          {isRegenerating ? "Updating..." : "Regenerate Analysis"}
        </Button>
      </Stack>

      {/* Grid Layout for Insights */}
      <Grid container spacing={3}>
        {/* Row 1 */}
        <Grid item xs={12} md={6}>
          <AnalysisSection
            title="Key Performance Patterns"
            items={analysisData.patterns}
            icon={<TrendingUpIcon />}
            iconColor="#1976d2"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AnalysisSection
            title="Actionable Recommendations"
            items={analysisData.recommendations}
            icon={<LightbulbIcon />}
            iconColor="#ed6c02"
          />
        </Grid>

        {/* Row 2 */}
        <Grid item xs={12} md={6}>
          <AnalysisSection
            title="Cognitive Depth (Bloom's)"
            items={analysisData.cognitive_depth}
            icon={<PsychologyIcon />}
            iconColor="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AnalysisSection
            title="Distractor Effectiveness"
            items={analysisData.distractor_analysis}
            icon={<RuleIcon />}
            iconColor="#d32f2f"
          />
        </Grid>

        {/* Row 3 */}
        <Grid item xs={12} md={6}>
          <AnalysisSection
            title="Quartile Analysis"
            items={analysisData.quartile_analysis}
            icon={<GroupsIcon />}
            iconColor="#00838f" // A nice teal color for the new section
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AnalysisSection
            title="Assessment Quality"
            items={analysisData.assessment_quality}
            icon={<FactCheckIcon />}
            iconColor="#2e7d32"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIAnalysisPage;
