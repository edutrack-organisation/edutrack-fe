import React from "react";
import { Box, Typography, Paper, Divider, Grid } from "@mui/material";

interface OverviewData {
  interpretation: string;
  likely_misunderstanding: string;
}

interface Question {
  question_number: number;
  description: string;
  overview?: {
    [option: string]: OverviewData;
  };
}

interface OverviewQuestionListProps {
  questions: Question[];
}

const OverviewQuestionList: React.FC<OverviewQuestionListProps> = ({
  questions,
}) => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {questions.map((q, index) => (
        <Paper key={q.question_number ?? index} elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Typography variant="h6" gutterBottom>
                Q{index + 1}
              </Typography>
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-line", fontSize: "0.95rem" }}
              >
                {q.description}
              </Typography>
            </Grid>

            {/* Vertical Divider */}
            <Grid
              item
              md={1}
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
              }}
            >
              <Divider orientation="vertical" flexItem />
            </Grid>

            {/* Right Column: Overview */}
            <Grid item xs={12} md={6}>
              {q.overview && (
                <>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Overview
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {Object.entries(q.overview).map(([optionKey, detail]) => (
                    <Box key={optionKey} mb={2}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Option {optionKey}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.85rem", ml: 2 }}
                      >
                        <strong>Interpretation:</strong> {detail.interpretation}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.85rem", ml: 2 }}
                      >
                        <strong>Likely misunderstanding:</strong>{" "}
                        {detail.likely_misunderstanding}
                      </Typography>
                    </Box>
                  ))}
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default OverviewQuestionList;
