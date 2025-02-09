import { Box, Card, Grid, Tooltip, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { DifficultyFrequencyAndAverageDifficultyForTopic } from "../../types/types";

interface AverageDifficultyByTopicProps {
    difficultyFrequencyAndAverageDifficultyForEachTopic: DifficultyFrequencyAndAverageDifficultyForTopic[];
}

const AverageDifficultyByTopic = ({
    difficultyFrequencyAndAverageDifficultyForEachTopic,
}: AverageDifficultyByTopicProps) => {
    return (
        <Box className="average-difficulty-by-topic-container">
            <Typography fontWeight={"bolder"} fontSize={"17px"} mb="0.5rem">
                Average Difficulty by Topic
            </Typography>
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
                                        },
                                    ]}
                                    width={300}
                                    height={150}
                                    borderRadius={5}
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
