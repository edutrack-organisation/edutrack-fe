import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DataItemWithUUID } from "../../types/types";
import CreatableSelect from "react-select/creatable";
import { Topic } from "./types";
import { formatGeneratedQuestions } from "./utils";
import { generatePaperApi } from "./generatePaperApi";

interface TopicForReactSelect {
    label: string;
    value: string;
    id: number; // this is the id for the topic in the backend
}

interface GenerateQuestionFromDBProps {
    setQuestions: React.Dispatch<React.SetStateAction<DataItemWithUUID[]>>;
    setHighlightIndex: React.Dispatch<React.SetStateAction<number>>;
    questions: DataItemWithUUID[];
    selectedIndex: number;
    handleModalClose: () => void;
}

const GenerateQuestionFromDB: React.FC<GenerateQuestionFromDBProps> = ({
    setQuestions,
    setHighlightIndex,
    selectedIndex,
    questions,
    handleModalClose,
}) => {
    const [selectedTopic, setSelectedTopic] = useState<number>(0); // This is to manage the selectedTopic
    const [topics, setTopics] = useState<Topic[]>([]); // This is to manage the retrived list of Topics from the database
    const [isFetchingTopics, setIsFetchingTopics] = useState(false); // This is for fetching the list of topics from the database
    const [isFetchingQuestionsWithTopic, setIsFetchingQuestionWithTopic] =
        useState(false); // This is for fetching the questions with topic

    //// Helper functions

    /**
     * Formats topics for react-select dropdown, mapping database fields
     * to required select options format (label, value) plus ID for API calls.
     */
    const formatTopicsForReactSelect = (topics: Topic[]) => {
        return topics.map((topic) => {
            return {
                label: topic.title, // required for react-select
                value: topic.title, // required for react-select
                id: topic.id, // for generating questions for this topic from backend
            } as TopicForReactSelect;
        });
    };

    /**
     * This method fetch the full list of topics from the database.
     */
    const fetchAndSetTopics = async () => {
        try {
            setIsFetchingTopics(true);
            const topics = await generatePaperApi.fetchTopics();
            setTopics(topics);
        } catch (error) {
            toast.error("Failed to fetch list of topics");
        } finally {
            setIsFetchingTopics(false);
        }
    };

    /**
     * This method fetch the list of questions from the backend that topics containing selectedTopic
     * @param selectedTopic
     */
    const getQuestionsWithTopic = async (selectedTopic: number) => {
        try {
            setIsFetchingQuestionWithTopic(true);
            const questionsWithTopic =
                await generatePaperApi.generateQuestionByTopic(selectedTopic);

            // const questionsWithTopic = await response.json();
            const formattedQuestionsWithTopic =
                formatGeneratedQuestions(questionsWithTopic);
            appendAndHandleDuplicates(formattedQuestionsWithTopic);

            handleModalClose();
            setIsFetchingQuestionWithTopic(false);
        } catch (error) {
            toast.error("Error in fetch questions with this topic");
            setIsFetchingQuestionWithTopic(false);
        }
    };

    /**
     * This method filters off the duplicates and add the first (non duplicate) question into the list. We only want to add to the list if the question is not already in the list.
     * @param formattedNewQuestions
     */

    const appendAndHandleDuplicates = (
        formattedNewQuestions: DataItemWithUUID[]
    ) => {
        /**
         * We filter questions based on description.
         * Even if questions have the exact same description (but different paper), we still consider them as duplicates as we do not want to generate the same questions.
         * Note that 2 question can be very similar but not duplicates due to having extra characters (e.g. new line character during different run of the paper parsing process)
         */
        const newQuestionsNotAlreadyInside = formattedNewQuestions.filter(
            (fnq) => {
                return !questions.some(
                    (q) => q.description === fnq.description
                );
            }
        );

        // If there are no questions of this topic that is to be added to the list of questions in the table
        if (newQuestionsNotAlreadyInside.length === 0) {
            toast.error(
                "All of the questions with this topic are already included in the list of generated questions"
            );
            setHighlightIndex(-2);
            return;
        }

        const updatedData = [...questions]; // make a copy of the old set of questions before addition
        const toInsertQuestion = newQuestionsNotAlreadyInside[0]; // always inserting the first element that is not already inside the list
        // insert at the correct position
        updatedData.splice(selectedIndex + 1, 0, toInsertQuestion);
        setQuestions(updatedData);

        // to trigger highlighting
        setHighlightIndex(selectedIndex);
    };

    // Event handlers
    // This is to handle the clicking of generate button for database
    const handleGenerateQuestionDB = (selectedTopic: number) => {
        getQuestionsWithTopic(selectedTopic);
    };

    useEffect(() => {
        fetchAndSetTopics();
    }, []);
    return (
        <>
            <Box mt={"1rem"}>
                <Typography
                    fontWeight={"bolder"}
                    sx={{
                        fontSize: "17px",
                        mb: "0.5rem",
                    }}
                >
                    Generate questions based on topic (from database)
                </Typography>

                <CreatableSelect
                    required
                    isValidNewOption={() => false} // disable option for creating new chip on the go
                    options={formatTopicsForReactSelect(topics)}
                    onChange={(newChip) => setSelectedTopic(newChip?.id as any)}
                    styles={{
                        control: (baseStyles) => ({
                            ...baseStyles,
                            marginTop: "1rem",
                            padding: "0.2rem",
                            borderRadius: "1rem",
                            maxHeight: "200px",
                            overflowY: "auto",
                            "@media (max-width: 1300px)": {
                                // below lgxl size
                                maxHeight: "120px",
                            },
                            "::-webkit-scrollbar": {
                                width: "6px", // Width of the scrollbar
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#ebebeb", // Background of the scrollbar track
                                borderRadius: "8px",
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: "#c2c2c2", // Color of the scrollbar thumb
                                borderRadius: "8px", // Rounded corners for the scrollbar thumb
                            },
                        }),
                        menuList: (baseStyles) => ({
                            ...baseStyles,
                            maxHeight: "200px", // Set max height for the dropdown
                            overflowY: "auto", // Enable vertical scrolling
                            "::-webkit-scrollbar": {
                                width: "6px", // Width of the scrollbar
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#ebebeb", // Background of the scrollbar track
                                borderRadius: "8px",
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: "#c2c2c2", // Color of the scrollbar thumb
                                borderRadius: "8px", // Rounded corners for the scrollbar thumb
                            },
                        }),
                    }}
                />
            </Box>
            {isFetchingTopics ||
                (isFetchingQuestionsWithTopic && (
                    <CircularProgress sx={{ my: "auto", mx: "auto" }} />
                ))}

            <Button
                variant="contained"
                sx={{ mt: "auto", alignSelf: "flex-start" }}
                onClick={() => handleGenerateQuestionDB(selectedTopic)}
            >
                Generate
            </Button>
        </>
    );
};

export default GenerateQuestionFromDB;
