import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreatableSelect from "react-select/creatable";
import { formatGeneratedQuestions } from "./generate.utils";
import { DataItemWithUUID } from "../../types/types";

interface QuickGenerateModalProps {
    open: boolean;
    handleClose: () => void;
    setQuestions: React.Dispatch<React.SetStateAction<DataItemWithUUID[]>>;
    // selectedIndex: number; // Add selectedIndex prop
}

// This is the style for the outer box container
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    minHeight: { xs: "80%", xl: "60%" },
    bgcolor: "background.paper",
    borderRadius: "1rem",
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
    p: 4,
};

const scrollbarStyle = {
    "::-webkit-scrollbar": {
        width: "6px",
    },
    "::-webkit-scrollbar-track": {
        background: "#ebebeb",
        borderRadius: "8px",
    },
    "::-webkit-scrollbar-thumb": {
        background: "#c2c2c2",
        borderRadius: "8px",
    },
};

// interface for topic retrieved from database
interface Topic {
    id: number;
    title: string;
}

// interface for topic for rendering for React Select
interface TopicForReactSelect {
    label: string; // required by React Select
    value: string; // required by React Select
    marksAllocated: number; // this is used to keep track of allocated marks for that topic
    topicId: number; // to send to the backend for processing
}

const QuickGenerateQuestionModal: React.FC<QuickGenerateModalProps> = ({
    open,
    handleClose,
    setQuestions,
}) => {
    const [topics, setTopics] = useState<Topic[]>([]); // This is to manage the retrived list of Topics from the database
    const [isFetchingTopics, setIsFetchingTopics] = useState(false); // This is for fetching the list of topics from the database
    // TODO: clean up the types
    const [selectedTopics, setSelectedTopics] = useState<TopicForReactSelect[]>(
        []
    );
    const [marksErrors, setMarksErrors] = useState<boolean[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helper functions to format topics properly for react-select rendering
    // React-select requires the value to be in the format {label: string, value: string}
    // #TODO: clean up, this is different from the one in content table because that one takes in array of string
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
     * This method fetch the full list of topics from the database.
     */
    // #TODO: clean up code and aabstract them into common method
    const fetchAndSetTopics = async () => {
        try {
            setIsFetchingTopics(true);
            const response = await fetch("http://127.0.0.1:8000/topics/", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch list of topics");
            }

            setTopics(await response.json());
            setIsFetchingTopics(false);
            return;
        } catch (error) {
            toast.error("Failed to fetch list of topics");
            setIsFetchingTopics(false);
        }
    };

    useEffect(() => {
        fetchAndSetTopics();
    }, []);

    // Event handlers
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        // Validate all fields
        const errors = selectedTopics.map(
            (topic) => !topic.marksAllocated || topic.marksAllocated <= 0
        );
        setMarksErrors(errors);

        // Check if form is valid
        if (errors.some((error) => error) || selectedTopics.length === 0) {
            toast.error("Please fill in all required fields");
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(false);

        // Proceed with form submission
        // Your submission logic here
        // #TODO: send the selected topics to the backend for processing

        // send to backend
        quickGenerateQuestions(selectedTopics);
    };

    const quickGenerateQuestions = async (
        selectedTopics: TopicForReactSelect[]
    ) => {
        try {
            const requestBody = {
                topics: selectedTopics.map((topic) => ({
                    topic_id: topic.topicId,
                    max_allocated_marks: topic.marksAllocated,
                })),
            };

            const response = await fetch(
                "http://127.0.0.1:8000/quick-generate/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                toast.error("Error in quick generating questions");
                // return;
            }

            const generatedQuestions = await response.json();

            console.log(generatedQuestions);
            // add to list etc
            const formattedQuestionsWithTopic =
                formatGeneratedQuestions(generatedQuestions);
            setQuestions(formattedQuestionsWithTopic);
            handleClose();
            // #TODO: loading
        } catch (error) {
            toast.error("Error in quick generating questions");
        }
    };

    const handleMarksChange = (index: number, mark: number) => {
        const updatedTopics = [...selectedTopics];
        updatedTopics[index].marksAllocated = mark;
        setSelectedTopics(updatedTopics);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} component="form" onSubmit={handleSubmit}>
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
                <Typography
                    fontWeight={"bolder"}
                    sx={{ opacity: "0.7", mt: "0.2rem" }}
                    fontSize={"15px"}
                >
                    This tool will help you quickly generate a set of questions
                    from database. Simply choose the topics that you wish to
                    generate questions from and enter the total marks worth of
                    questions that you wish to generate for each topic.
                </Typography>

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

                {/* container for selected topics */}
                <Box
                    sx={{
                        height: { lg: "8rem", xl: "17rem" },
                        overflowY: "auto", // Enable vertical scrolling
                        ...scrollbarStyle,
                    }}
                >
                    {selectedTopics.map((t, index) => (
                        <Box
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
                                sx={{ ml: "auto" }} // This will push the TextField to the righ}}
                                InputProps={{
                                    inputProps: { min: 0 },
                                }}
                                onChange={(event) =>
                                    handleMarksChange(
                                        index,
                                        parseInt(event.target.value)
                                    )
                                }
                            />
                        </Box>
                    ))}
                </Box>

                {/* Add submit button */}
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || selectedTopics.length === 0}
                    sx={{ mt: 2 }}
                >
                    Generate Questions
                </Button>
            </Box>
        </Modal>
    );
};

export default QuickGenerateQuestionModal;
