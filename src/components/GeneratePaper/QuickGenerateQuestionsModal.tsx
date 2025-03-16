import { Box, Button, CircularProgress, Modal, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreatableSelect from "react-select/creatable";
import { formatGeneratedQuestions } from "./utils";
import { DataItemWithUUID } from "../../types/types";
import { modalVariants } from "./styles";
import { Topic } from "./types";
import { generatePaperApi } from "./generatePaperApi";
import { useTopics } from "../../hooks";
import { scrollbarStyle } from "../../styles";

interface QuickGenerateModalProps {
    open: boolean;
    handleClose: () => void;
    setQuestions: React.Dispatch<React.SetStateAction<DataItemWithUUID[]>>;
}

/**
 * Interface for topic data structure used in React Select component.
 * Extends the base topic data with additional fields required.
 */
interface TopicForReactSelect {
    label: string; // Required by React Select
    value: string; // Required by React Select
    marksAllocated: number; // Number of marks allocated to this topic for question generation
    topicId: number; // Database ID of the topic for backend API calls
}

interface SelectedTopicsSectionProps {
    selectedTopics: TopicForReactSelect[];
    onMarksChange: (index: number, mark: number) => void;
    marksErrors: boolean[];
}

const SelectedTopicsSection: React.FC<SelectedTopicsSectionProps> = ({
    selectedTopics,
    onMarksChange,
    marksErrors,
}) => (
    <Box
        sx={{
            height: { lg: "8rem", xl: "17rem" },
            overflowY: "auto", // Enable vertical scrolling
            ...scrollbarStyle,
        }}
    >
        {selectedTopics.map((t, index) => (
            <Box
                key={t.topicId}
                display="flex"
                sx={{
                    alignItems: "center",
                    gap: 2,
                }}
            >
                {/* hard coded mt value based on MUI margin for their input components */}
                <Typography
                    sx={{
                        mt: "20px",
                        width: { xs: "95%", lgxl: "80%" },
                    }}
                >
                    {t.label}
                </Typography>
                <TextField
                    required
                    id="standard-basic"
                    label="Marks Allocated"
                    type="number"
                    variant="standard"
                    error={marksErrors[index]}
                    helperText={marksErrors[index] ? "Marks must be greater than 0" : ""}
                    sx={{ ml: "auto" }}
                    InputProps={{
                        inputProps: { min: 0 },
                    }}
                    onChange={(event) => onMarksChange(index, parseInt(event.target.value))}
                />
            </Box>
        ))}
    </Box>
);

const QuickGenerateQuestionsModal: React.FC<QuickGenerateModalProps> = ({ open, handleClose, setQuestions }) => {
    const { topics, isFetchingTopics, fetchTopics } = useTopics(); // Custom react hook to fetch full list of topics from the database
    const [selectedTopics, setSelectedTopics] = useState<TopicForReactSelect[]>([]); // Stores the selected topics with their allocated marks
    const [marksErrors, setMarksErrors] = useState<boolean[]>([]); // Tracks validation errors for marks allocation of each topic
    const [isSubmitting, setIsSubmitting] = useState(false); // Tracks form submission state

    const ModalHeader = () => (
        <>
            <Box display={"flex"}>
                <Typography
                    fontWeight={"bolder"}
                    sx={{
                        fontSize: { xs: "1.5rem", xl: "1.8rem" },
                        mb: "0.5rem",
                    }}
                >
                    Quick Generate Questions
                </Typography>
            </Box>

            <Typography
                fontWeight={"bolder"}
                sx={{
                    fontSize: "17px",
                }}
            >
                Instructions
            </Typography>
            <Typography fontWeight={"bolder"} sx={{ opacity: "0.7", mt: "0.2rem" }} fontSize={"15px"}>
                This tool will help you quickly generate a set of questions from database. Simply choose the topics that
                you wish to generate questions from and enter the total marks worth of questions that you wish to
                generate for each topic.
            </Typography>
        </>
    );

    //// Helper functions

    /**
     * Formats topics for react-select dropdown, mapping database fields
     * to required select options format (label, value) plus marks allocated and ID for API calls.
     */
    const formatTopicsForReactSelect = (topics: Topic[]) => {
        return topics.map((topic) => {
            return {
                label: topic.title, // required for react-select
                value: topic.title, // required for react-select
                marksAllocated: 0, // for tracking of allocated marks for each topic
                topicId: topic.id,
            } as TopicForReactSelect;
        });
    };

    /**
     * Generates questions based on selected topics and their marks.
     * Maps topics to API format, calls backend, and updates parent state.
     */
    const quickGenerateQuestions = async (selectedTopics: TopicForReactSelect[]) => {
        try {
            const topics = selectedTopics.map((topic) => ({
                topic_id: topic.topicId,
                max_allocated_marks: topic.marksAllocated,
            }));

            const generatedQuestions = await generatePaperApi.quickGenerateQuestions(topics);

            const formattedQuestionsWithTopic = formatGeneratedQuestions(generatedQuestions);
            setQuestions(formattedQuestionsWithTopic);
            handleClose();
        } catch (error) {
            toast.error("Error in quick generating questions");
        }
    };

    //// Event handlers

    /**
     * Handles the form submission for generating questions.
     *
     * @param event - The form submission event
     */
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        // Validate all fields
        const errors = selectedTopics.map((topic) => topic.marksAllocated <= 0);
        setMarksErrors(errors);

        // Check if form is valid
        if (selectedTopics.length === 0) {
            toast.error("Please select at least one topic");
            setIsSubmitting(false);
            return;
        } else if (errors.some((error) => error)) {
            toast.error("Please ensure that marks allocated is greater than 0");
            setIsSubmitting(false);
            return;
        }
        // send to backend
        quickGenerateQuestions(selectedTopics);
        setIsSubmitting(false);
    };

    /**
     * Updates the marks allocated for a specific topic in the selected topics list.
     * @param index - The array index of the topic to update
     * @param mark - The new marks value to be allocated
     */
    const handleMarksChange = (index: number, mark: number) => {
        const updatedTopics = [...selectedTopics];
        updatedTopics[index].marksAllocated = mark;
        setSelectedTopics(updatedTopics);
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalVariants.quickGenerate} component="form" onSubmit={handleSubmit}>
                <ModalHeader />
                <CreatableSelect
                    isMulti
                    required
                    isValidNewOption={() => false} // disable option for creating new chip on the go
                    value={selectedTopics}
                    options={formatTopicsForReactSelect(topics)}
                    onChange={(newChip) => setSelectedTopics(newChip as any)}
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

                <Typography
                    fontWeight={"bolder"}
                    sx={{
                        fontSize: "17px",
                        mt: "1rem",
                    }}
                >
                    Selected Topics
                </Typography>

                <SelectedTopicsSection
                    selectedTopics={selectedTopics}
                    onMarksChange={handleMarksChange}
                    marksErrors={marksErrors}
                />

                {isFetchingTopics && <CircularProgress sx={{ my: "auto", mx: "auto" }} />}

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isFetchingTopics || isSubmitting || selectedTopics.length === 0}
                    sx={{ mt: 2 }}
                >
                    Generate Questions
                </Button>
            </Box>
        </Modal>
    );
};

export default QuickGenerateQuestionsModal;
