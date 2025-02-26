import { Box, Card, Grid, styled, Tooltip, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { DifficultyFrequencyAndAverageDifficultyForTopic } from "../../types/types";
import InfoIcon from "@mui/icons-material/Info";

interface AverageDifficultyByTopicProps {
    difficultyFrequencyAndAverageDifficultyForEachTopic: DifficultyFrequencyAndAverageDifficultyForTopic[];
}

const StyledCard = styled(Card)(({}) => ({
    height: "15rem",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "1.5rem",
    bgcolor: `background: rgb(255,255,255);
background: -moz-linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(254,241,251,1) 90%);
background: -webkit-linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(254,241,251,1) 90%);
background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(254,241,251,1) 90%);
filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ffffff",endColorstr="#fef1fb",GradientType=1);`,
}));

const AverageDifficultyByTopic = ({
    difficultyFrequencyAndAverageDifficultyForEachTopic,
}: AverageDifficultyByTopicProps) => {
    return (
        <Box className="average-difficulty-by-topic-container">
            <Box display={"flex"} alignItems={"center"} sx={{ mb: "0.5rem" }}>
                <Typography fontWeight={"bolder"} fontSize={"17px"}>
                    Difficulty by Topic
                </Typography>

                <Tooltip
                    title="These are the difficulty levels for each topic based on the questions in the exam paper"
                    placement="right"
                >
                    <InfoIcon sx={{ fontSize: "1.3rem", ml: "0.5rem" }} />
                </Tooltip>
            </Box>
            <Grid container spacing={2}>
                {difficultyFrequencyAndAverageDifficultyForEachTopic.map(
                    (perTopic, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <StyledCard variant="outlined">
                                <Tooltip
                                    title={perTopic.label}
                                    placement="bottom-end"
                                >
                                    <Typography
                                        fontWeight={"bolder"}
                                        sx={{
                                            // Below is to clamp if the text is more than 3 lines
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {perTopic.label}
                                    </Typography>
                                </Tooltip>
                                <Typography
                                    fontWeight={"bolder"}
                                    fontSize={"1.5rem"}
                                    sx={{ mt: "0.2rem" }}
                                >
                                    {perTopic.topicAverageDifficulty.toFixed(1)}
                                </Typography>
                                <Typography
                                    fontWeight={"lighter"}
                                    fontSize={"0.7rem"}
                                >
                                    Average Difficulty
                                </Typography>
                                <BarChart
                                    series={[
                                        {
                                            dataKey: "frequency",
                                        },
                                    ]}
                                    dataset={perTopic.topicDifficultyFrequency}
                                    xAxis={[
                                        {
                                            scaleType: "band",
                                            dataKey: "difficulty",
                                            label: "Difficulty",
                                        },
                                    ]}
                                    width={300}
                                    height={150}
                                    borderRadius={5}
                                    // Below is to add the y-axis label
                                    yAxis={[
                                        {
                                            label: "Frequency",
                                            tickMinStep: 1,
                                        },
                                    ]}
                                />
                            </StyledCard>
                        </Grid>
                    )
                )}
            </Grid>
        </Box>
    );
};

export default AverageDifficultyByTopic;
