import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DataItemWithUUID } from "../../types/types";
import CreatableSelect from "react-select/creatable";
import { Topic } from "./types";
import { formatGeneratedQuestions } from "./utils";
import { generatePaperApi } from "./generatePaperApi";
import { scrollbarStyle } from "./styles";
import { SingleValue } from "react-select"; // Add this import at the top
import { useTopics } from "../../hooks";

/**
 * Interface for topic data structure used in React Select component.
 * Extends the base topic data with additional fields required.
 */
interface TopicForReactSelect {
    label: string; // Required by React Select
    value: string; // Required by React Select
    id: number; // Database ID of the topic used for API calls to fetch questions
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
    const [selectedTopic, setSelectedTopic] = useState<number>(-1); // ID of the currently selected topic from the dropdown
    const { topics, isFetchingTopics, fetchTopics } = useTopics(); // Custom react hook to fetch full list of topics from the database

    const [isFetchingQuestionsWithTopic, setIsFetchingQuestionWithTopic] =
        useState(false); // Loading state for question generation with selected topic

    // Helper functions

    /**
     * Formats topics for react-select dropdown, mapping database fields
     * to required select options format (label, value) plus ID for API calls.
     */
    const formatTopicsForReactSelect = (topics: Topic[]) => {
        return topics.map((topic) => {
            return {
                label: topic.title, // Required by React Select
                value: topic.title, // Required by React Select
                id: topic.id, // Database ID of the topic used for API calls to fetch questions
            } as TopicForReactSelect;
        });
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
        } catch (error) {
            toast.error("Error in fetch questions with this topic");
        } finally {
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
            setHighlightIndex(-2); // reset highlight index
            return;
        }

        const updatedData = [...questions]; // make a copy of the old set of questions before addition
        const toInsertQuestion = newQuestionsNotAlreadyInside[0]; // always inserting the first element that is not already inside the list
        // insert at the correct position
        updatedData.splice(selectedIndex + 1, 0, toInsertQuestion);
        setQuestions(updatedData);

        setHighlightIndex(selectedIndex); // to trigger highlighting of newly inserted question in table
    };

    // Event handlers
    // This is to handle the clicking of generate button for database
    const handleGenerateQuestionDB = (selectedTopic: number) => {
        getQuestionsWithTopic(selectedTopic);
    };

    useEffect(() => {
        fetchTopics();
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
                    onChange={(newChip: SingleValue<TopicForReactSelect>) =>
                        setSelectedTopic(newChip?.id ?? -1)
                    }
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
                            ...scrollbarStyle,
                        }),
                        menuList: (baseStyles) => ({
                            ...baseStyles,
                            maxHeight: "200px", // Set max height for the dropdown
                            overflowY: "auto", // Enable vertical scrolling
                            ...scrollbarStyle,
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
                disabled={selectedTopic === -1}
            >
                Generate
            </Button>
        </>
    );
};

export default GenerateQuestionFromDB;
