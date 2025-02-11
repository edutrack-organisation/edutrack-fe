import { Box, Card, Grid, Tooltip, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { DifficultyFrequencyAndAverageDifficultyForTopic } from "../../types/types";
import InfoIcon from "@mui/icons-material/Info";

interface AverageDifficultyByTopicProps {
    difficultyFrequencyAndAverageDifficultyForEachTopic: DifficultyFrequencyAndAverageDifficultyForTopic[];
}

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
                            <Card
                                variant="outlined"
                                sx={{
                                    height: "15rem",
                                    padding: "1rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
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
                            </Card>
                        </Grid>
                    )
                )}
            </Grid>
        </Box>
    );
};

export default AverageDifficultyByTopic;
