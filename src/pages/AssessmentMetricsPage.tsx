import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper as MuiPaper,
  IconButton,
  Collapse,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Api from "../api/Api";
import { Paper, GradeDistribution } from "../types/types"; // UPDATED: Use the 'Paper' type
import StudentGradesHistogram from "../components/AssessmentMetrics/StudentGradesHistogram";
import "../index.css"; // Assuming your badge styles are here

// This new type combines the paper metrics with its grade data
interface PaperWithGrades extends Paper {
  gradeData: GradeDistribution;
}

// A sub-component to render each row of the table
const Row: React.FC<{ paper: PaperWithGrades }> = ({ paper }) => {
  const [open, setOpen] = useState(false);

  const getDifficultyClass = (difficulty: number) => {
    if (difficulty >= 3.8) return "difficulty-hard";
    if (difficulty >= 2.5) return "difficulty-medium";
    return "difficulty-easy";
  };

  // Reverse the normalization formula to get the raw average score for display
  const difficulty = paper.overall_difficulty ?? 1;
  const normalizedScore = paper.statistics?.normalised_average_marks ?? 0;
  const averageScore = paper.gradeData.average_score;

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {/* UPDATED: Use correct property names from the 'Paper' type */}
        <TableCell component="th" scope="row">
          {paper.title}
        </TableCell>
        <TableCell>{averageScore.toFixed(1)}%</TableCell>
        <TableCell>
          <span
            className={`difficulty-badge ${getDifficultyClass(difficulty)}`}
          >
            {difficulty.toFixed(1)}
          </span>
        </TableCell>
        <TableCell className="normalized-score-cell">
          <strong>{normalizedScore.toFixed(1)}</strong>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <StudentGradesHistogram data={paper.gradeData} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const AssessmentMetricsPage: React.FC = () => {
  const [papersWithGrades, setPapersWithGrades] = useState<PaperWithGrades[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetricsAndGrades = async () => {
      try {
        // UPDATED: Fetch from the new getPaperMetrics function
        const allMetrics = await Api.getPaperMetrics();

        const gradePromises = allMetrics.map((paper) =>
          Api.getGradeDistribution(paper.id)
        );
        const results = await Promise.allSettled(gradePromises);

        const filteredData: PaperWithGrades[] = [];
        results.forEach((result, index) => {
          if (result.status === "fulfilled" && result.value) {
            filteredData.push({
              ...allMetrics[index],
              gradeData: result.value,
            });
          }
        });

        setPapersWithGrades(filteredData);
      } catch (err) {
        console.error("Failed to load paper metrics and grades", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricsAndGrades();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      mt={"6rem"}
      padding={"2rem"}
      mx="auto"
      sx={{ width: { lg: "91%", xl: "79%" } }}
    >
      <Typography variant="h4" fontWeight="bold">
        Assessment Metrics
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Showing papers with available student grade distributions.
      </Typography>
      <TableContainer component={MuiPaper} sx={{ mt: 2 }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Paper Name</TableCell>
              <TableCell>Average Score (Raw)</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Normalized Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {papersWithGrades.length > 0 ? (
              papersWithGrades.map((paper) => (
                <Row key={paper.id} paper={paper} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No papers with grade distributions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AssessmentMetricsPage;
