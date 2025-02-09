import {
    Box,
    Card,
    Chip,
    Grid,
    LinearProgress,
    Tooltip,
    Typography,
} from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import { DatasetElementType } from "@mui/x-charts/internals";

// Type declarations
interface TopicFrequency {
    id: number;
    value: number;
    label: string;
}

interface Question {
    description: string;
    difficulty: number;
    topics: string[];
    uuid: string;
}

// This is for each topic, rather than overall for the paper
interface DifficultyFrequencyAndAverageDifficultyForTopic {
    label: string;
    topicDifficultyFrequency: DatasetElementType<
        string | number | Date | null | undefined
    >[]; // [{frequency, difficulty}...]
    topicAverageDifficulty: number;
}

const DashboardPage = () => {
    // get the saved paper from previous page
    // #TODO: to decide between retrieving or from db or from previous page?
    const location = useLocation();
    const {
        savedPaper: { title, questions, allTopics },
    } = location.state;

    const [topicFrequency, setTopicsFrequencyMap] = useState<TopicFrequency[]>(
        []
    ); // This is the frequency of each topic

    const [notCoveredTopics, setNotCoveredTopics] = useState<string[]>([]); // This are the topics that are not covered by this exam papers
    const [paperAverageDifficulty, setPaperAverageDifficulty] =
        useState<number>(0); // This is the overall paper average difficulty

    const [
        difficultyFrequencyAndAverageDifficultyForEachTopic,
        setDifficultyFrequencyAndAverageDifficultyForEachTopic,
    ] = useState<DifficultyFrequencyAndAverageDifficultyForTopic[]>([]);

    /**
     * This function serve to count the frequency of each difficulty level and the average difficulty for each topic
     * @param questions
     * @returns An object containing the formattedDifficultyFrequency and the paperAverageDifficulty
     */
    const countDifficultyFrequencyAndAverageDifficultyForEachTopic = (
        questions: Question[]
    ) => {
        let totalDifficulty = 0;
        const numberOfQuestionForThisTopic = questions.length;
        const difficultyFrequency = new Map();
        questions.forEach((question) => {
            if (difficultyFrequency.has(question.difficulty)) {
                difficultyFrequency.set(
                    question.difficulty,
                    difficultyFrequency.get(question.difficulty) + 1
                );
            } else {
                difficultyFrequency.set(question.difficulty, 1);
            }
            totalDifficulty += question.difficulty;
        });

        // convert the difficultyFrequency map to series for BarChart for each topic
        const topicDifficultyFrequency = Array.from(difficultyFrequency).map(
            ([difficulty, frequency]) => ({
                difficulty: difficulty,
                frequency: frequency,
            })
        );

        return {
            topicDifficultyFrequency, // This is the [{difficulty: difficulty, frequency: frequency}] for each topic
            topicAverageDifficulty:
                totalDifficulty / numberOfQuestionForThisTopic,
        };
    };

    /**
     * This function takes in an array of questions and returns a map of [topic, questions] pairs. It's used to extract the questions for each topic.
     * @param questions
     * @returns An array of [topic, questions] pairs
     */
    const retrieveQuestionsForEachTopic = (questions: Question[]) => {
        const questionsForEachTopic = new Map();

        questions.forEach((question) => {
            question.topics.forEach((topic: string) => {
                if (questionsForEachTopic.has(topic)) {
                    questionsForEachTopic.get(topic).push(question);
                } else {
                    questionsForEachTopic.set(topic, [question]);
                }
            });
        });

        // convert the map to an array of [topic, questions] pairs
        return Array.from(questionsForEachTopic);
    };

    /**
     * This function counts the frequency of each topic in the questions array and sets the state for the PieChart
     * @param questions
     */
    function countTopicsFrequency(questions: Question[]) {
        const localTopicsFrequencyMap = new Map();
        questions.forEach((question) => {
            question.topics.forEach((topic: string) => {
                if (localTopicsFrequencyMap.has(topic)) {
                    localTopicsFrequencyMap.set(
                        topic,
                        localTopicsFrequencyMap.get(topic) + 1
                    );
                } else {
                    localTopicsFrequencyMap.set(topic, 1);
                }
            });
        });

        // convert topicsFrequencyMap to series for PieChart
        const pieChartTopicsFrequencySeries = Array.from(
            localTopicsFrequencyMap
        ).map(([topic, frequency], index) => ({
            id: index,
            value: frequency,
            label: topic,
        }));

        setTopicsFrequencyMap(pieChartTopicsFrequencySeries);

        // get the topics that are not covered by this exam paper
        const allTopicsSet: Set<string> = new Set(allTopics);
        const coveredTopicsSet: Set<string> = new Set(
            localTopicsFrequencyMap.keys()
        );
        const notCoveredTopics: string[] = Array.from(allTopicsSet).filter(
            (topic) => !coveredTopicsSet.has(topic)
        );
        setNotCoveredTopics(notCoveredTopics);
    }

    /**
     * This function calculates the average difficulty of the paper
     * @param questions
     */
    function calculateAverageDifficulty(questions: Question[]) {
        let totalDifficulty = 0;
        questions.forEach((question) => {
            totalDifficulty += question.difficulty;
        });
        setPaperAverageDifficulty(totalDifficulty / questions.length);
    }

    useEffect(() => {
        countTopicsFrequency(questions);
        calculateAverageDifficulty(questions);

        const questionsForEachTopic = retrieveQuestionsForEachTopic(questions);
        const topicsDifficultyFrequencyAndAverageDifficulty =
            questionsForEachTopic.map(
                ([topic, questions]: [string, Question[]]) => {
                    const details =
                        countDifficultyFrequencyAndAverageDifficultyForEachTopic(
                            questions
                        );

                    //return type of DifficultyFrequencyAndAverageDifficultyForTopic
                    return {
                        label: topic,
                        ...details,
                    };
                }
            );

        setDifficultyFrequencyAndAverageDifficultyForEachTopic(
            topicsDifficultyFrequencyAndAverageDifficulty
        );
    }, [questions]);

    return (
        <Box
            className="outer-page-container"
            mt={"6rem"} // margin to accomodate fixed navbar
            padding={"2rem"}
            textAlign={"start"}
            mx="auto"
            sx={{
                width: { lg: "91%", xl: "79%" },
                height: { xs: "10%", lg: "12%" },
                backgroundColor: "#fff8f6",
                borderRadius: "3rem",
            }}
        >
            <Typography
                fontWeight={"bolder"}
                sx={{
                    fontSize: { xs: "1.2rem", xl: "1.8rem" },
                }}
            >
                {title}
            </Typography>
            <Box
                className="dashboard-widget-container"
                display={"flex"}
                flexDirection={"column"}
                sx={{
                    backgroundColor: "#fff8f6",
                    borderRadius: "3rem",
                    height: "100vh",
                    mt: "1rem",
                    gap: "1.3rem",
                }}
            >
                <Typography fontWeight={"bolder"} fontSize={"22px"}>
                    Exam Paper Summary
                </Typography>

                <Box className="overall-difficulty-container">
                    <Typography
                        fontWeight={"bolder"}
                        fontSize={"17px"}
                        mb="0.5rem"
                    >
                        Overall Difficulty
                    </Typography>
                    <Box
                        className="progress-bar-container"
                        display={"flex"}
                        flexDirection={"column"}
                        sx={{ gap: "0.5rem" }}
                    >
                        <Typography fontWeight={"Medium"}>
                            Average difficulty level:
                            {paperAverageDifficulty}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={(paperAverageDifficulty / 5) * 100}
                            sx={{
                                height: "0.8rem",
                                borderRadius: "1rem",
                            }}
                        />
                        <Typography fontWeight={"light"}>
                            Based on the average difficulty rating of all
                            questions
                        </Typography>
                    </Box>
                </Box>
                <Box className="topics-covered-container">
                    <Typography
                        fontWeight={"bolder"}
                        fontSize={"17px"}
                        mb="0.5rem"
                    >
                        Topics Covered
                    </Typography>
                    <Box
                        className="topics-container"
                        display={"flex"}
                        flexWrap={"wrap"} // Ensure the content wraps
                        sx={{
                            gap: "0.5rem",
                            mb: "2rem",
                        }}
                    >
                        {/* NOTE: dummy all topics covered only */}
                        {/* iterate through the key of topicFrequency  */}
                        {topicFrequency.map((t: any, index: number) => (
                            <Tooltip title={t.label} key={index}>
                                <Chip
                                    label={t.label}
                                    sx={{
                                        width: "15rem",
                                    }}
                                />
                            </Tooltip>
                        ))}
                    </Box>

                    <Typography
                        fontWeight={"bolder"}
                        fontSize={"17px"}
                        mb="0.5rem"
                    >
                        Topics Covered to Frequency Pie Chart
                    </Typography>
                    <PieChart
                        series={[
                            {
                                data: topicFrequency,

                                highlightScope: {
                                    fade: "global",
                                    highlight: "item",
                                },
                                faded: {
                                    innerRadius: 30,
                                    additionalRadius: -30,
                                    color: "gray",
                                },
                                innerRadius: 30,
                            },
                        ]}
                        width={400}
                        height={250}
                        slotProps={{ legend: { hidden: true } }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            gap: "0.5rem",
                            mt: "0.5rem",
                            alignItems: "center",
                        }}
                    >
                        <InfoIcon sx={{ fontSize: "1.3rem" }} />
                        <Typography fontWeight={"light"}>
                            Hover over the pie chart to see the frequency of
                            each topic
                        </Typography>
                    </Box>
                </Box>
                <Box className="average-difficulty-by-topic-container">
                    <Typography
                        fontWeight={"bolder"}
                        fontSize={"17px"}
                        mb="0.5rem"
                    >
                        Average Difficulty by Topic
                    </Typography>
                    <Grid container spacing={2}>
                        {difficultyFrequencyAndAverageDifficultyForEachTopic.map(
                            (perTopic, index) => (
                                <Grid item xs={3} key={index}>
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
                                            {perTopic.topicAverageDifficulty.toFixed(
                                                1
                                            )}
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
                                            dataset={
                                                perTopic.topicDifficultyFrequency
                                            }
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
                <Box className="topics-not-covered-container">
                    <Typography
                        fontWeight={"bolder"}
                        fontSize={"17px"}
                        mb="0.5rem"
                    >
                        Topics Not Covered
                    </Typography>
                    <Box
                        className="topics-not-used-container"
                        display={"flex"}
                        flexWrap={"wrap"} // Ensure the content wraps
                        sx={{
                            gap: "0.5rem",
                            mb: "2rem",
                        }}
                    >
                        {/* NOTE: dummy all topics covered only */}
                        {/* iterate through the key of topicFrequency  */}
                        {notCoveredTopics.map((t: string, index: number) => (
                            <Tooltip title={t} key={index}>
                                <Chip
                                    label={t}
                                    sx={{
                                        width: "15rem",
                                    }}
                                />
                            </Tooltip>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardPage;
