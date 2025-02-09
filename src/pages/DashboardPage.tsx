import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import OverallDifficulty from "../components/Dashboard/OverallDifficulty";
import { TopicFrequency } from "../types/types";
import TopicsCovered from "../components/Dashboard/TopicsCovered";
import { DifficultyFrequencyAndAverageDifficultyForTopic } from "../types/types";
import AverageDifficultyByTopic from "../components/Dashboard/AverageDifficultyByTopic";
import TopicsNotCovered from "../components/Dashboard/TopicsNotCovered";
// Type declarations

interface Question {
    description: string;
    difficulty: number;
    topics: string[];
    uuid: string;
}

const DashboardPage = () => {
    // get the saved paper from previous page
    // #TODO: to decide between retrieving or from db or from previous page?
    const location = useLocation();
    const {
        savedPaper: { title, questions, allTopics },
    } = location.state;

    const [topicFrequencies, setTopicsFrequencyMap] = useState<
        TopicFrequency[]
    >([]); // This is the frequency of each topic

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

                <OverallDifficulty
                    paperAverageDifficulty={paperAverageDifficulty}
                />
                <TopicsCovered topicFrequencies={topicFrequencies} />
                <AverageDifficultyByTopic
                    difficultyFrequencyAndAverageDifficultyForEachTopic={
                        difficultyFrequencyAndAverageDifficultyForEachTopic
                    }
                />
                <TopicsNotCovered notCoveredTopics={notCoveredTopics} />
            </Box>
        </Box>
    );
};

export default DashboardPage;
