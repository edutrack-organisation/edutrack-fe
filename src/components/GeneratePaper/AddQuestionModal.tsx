import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import TextArea from "../ViewPdf/TextArea";
import React, { useEffect, useState } from "react";
import GptIcon from "../../assets/icons/gpt_icon.png";
import { v4 as uuidv4 } from "uuid";
import DatabaseIcon from "../../assets/icons/database_icon.png";
import { SelectChangeEvent } from "@mui/material/Select";
import toast from "react-hot-toast";
import { DataItemWithUUID } from "../../types/types";

interface AddQuestionModalProps {
    open: boolean;
    handleClose: () => void;
    questions: DataItemWithUUID[];
    setQuestions: React.Dispatch<React.SetStateAction<DataItemWithUUID[]>>;
}

interface Topic {
    id: number;
    title: string;
}

// Interface for questions retrieved from db. This can contain additional fields such as FK and hence != DataItem WithUUID;
interface QuestionFromDB {
    id: number;
    paper_id: number;
    question_number: number;
    description: string;
    topics: Topic[];
    difficulty: number;
}

// This is the style for the outer box container
const style = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    minHeight: { xs: "60%", xl: "40%" },
    bgcolor: "background.paper",
    borderRadius: "1rem",
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
    p: 4,
};

// generatedQuestions have other field such as FK etc
const formatGeneratedQuestions = (generatedQuestions: QuestionFromDB[]) => {
    return generatedQuestions.map((q) => {
        return {
            description: q.description,
            difficulty: q.difficulty,
            uuid: uuidv4(), // uuid from content table uses id from database
            topics: q.topics.map((t: Topic) => t.title),
        } as DataItemWithUUID;
    });
};

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
    open,
    handleClose,
    questions,
    setQuestions,
}) => {
    const [method, setMethod] = useState("gpt"); // This is to handle the toggling between different mode (gpt and DB)
    const [topics, setTopics] = useState<Topic[]>([]); // This is to manage the retrived list of Topics from the database
    const [selectedTopic, setSelectedTopic] = useState<Number>(0); // This is to manage the selectedTopic
    const [isFetchingTopics, setIsFetchingTopics] = useState(false); // This is for fetching the list of topics from the database
    const [isFetchingQuestionsWithTopic, setIsFetchingQuestionWithTopic] =
        useState(false); // This is for fetching the questions with topic

    // This method fetch the list of available topics from the backend
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
            toast.error("Error in parsing PDF");
            setIsFetchingTopics(false);
        }
    };

    // This method get the questions with list of topics containing selectedTopic
    const getQuestionsWithTopic = async (selectedTopic: Number) => {
        try {
            setIsFetchingQuestionWithTopic(true);
            const response = await fetch(
                `http://127.0.0.1:8000/questions?topic_id=${selectedTopic}`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to questions with this topic");
            }

            const newQuestions = await response.json();
            const formattedNewQuestions =
                formatGeneratedQuestions(newQuestions);
            // append to existing questions

            const appendedQuestionsWithoutDuplicates =
                appendAndHandleDuplicates(questions, formattedNewQuestions);
            // setQuestions(appendedQuestionsWithoutDuplicates); // update questions

            setIsFetchingQuestionWithTopic(false);
        } catch (error) {
            toast.error("Error in fetch questions with this topic");
            setIsFetchingQuestionWithTopic(false);
        }
    };

    const appendAndHandleDuplicates = (
        questions: DataItemWithUUID[],
        formattedNewQuestions: DataItemWithUUID[]
    ) => {
        const newQuestionsNotAlreadyInside = formattedNewQuestions.filter(
            (fnq) => !questions.some((q) => q.uuid === fnq.uuid)
        );

        if (newQuestionsNotAlreadyInside.length === 0) {
            toast.error(
                "All of the questions with this topic is already included in the list of generated questions"
            );
        }

        // #TODO: for now we just append one to it instead of a list because we want to let user choose

        // adding the inserted data (just 1) to the appropriate index
        const updatedData = [...questions];
        // updatedData.splice(index + 1, 0, {
        //     uuid: uuidv4(),
        //     description: "",
        //     topics: [],
        //     difficulty: 1,
        // });

        setQuestions(updatedData);
        // };

        // return [...questions, ...newQuestionsNotAlreadyInside];
    };

    // This is to handleChange for the dropdown select
    const handleChangeSelect = (event: SelectChangeEvent) => {
        setSelectedTopic(Number(event.target.value));
    };

    // This is to handle the toggling between using database and openAI
    const handleChangeMethod = (
        _: React.MouseEvent<HTMLElement>,
        newMethod: string
    ) => {
        setMethod(newMethod);
    };

    // This is to handle the clicking of generate button for database
    const handleGenerateQuestionDB = (selectedTopic: Number) => {
        getQuestionsWithTopic(selectedTopic);
    };

    useEffect(() => {
        fetchAndSetTopics();
    }, []);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box display={"flex"}>
                    <Typography
                        fontWeight={"bolder"}
                        sx={{
                            fontSize: { xs: "1.5rem", xl: "1.8rem" },
                            mb: "0.5rem",
                        }}
                    >
                        Generate Question
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={method}
                        exclusive
                        onChange={handleChangeMethod}
                        sx={{ ml: "auto" }}
                    >
                        <ToggleButton value="gpt">
                            <img src={GptIcon} width={30} height={30} />
                        </ToggleButton>
                        <ToggleButton value="db">
                            <img src={DatabaseIcon} width={30} height={30} />
                        </ToggleButton>
                    </ToggleButtonGroup>
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
                    This tool will help you generate questions. You can either
                    use ChatGPT API to generate questions from scratch by
                    passing in a prompt or generate questions by retrieving from
                    database based on a topic.
                </Typography>

                {method === "gpt" ? (
                    <Box mt={"1rem"}>
                        <Typography
                            fontWeight={"bolder"}
                            sx={{
                                fontSize: "17px",
                                mb: "0.5rem",
                            }}
                        >
                            Generate questions from scratch (by passing in
                            prompt to GPT-4o)
                        </Typography>
                        <TextArea
                            className="textarea"
                            placeHolder={"Type your prompt here..."}
                            // onChange={(event) =>
                            //     handlers.handleTitleChange(event.target.value)
                            // }
                        />
                    </Box>
                ) : (
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
                        <FormControl
                            sx={{
                                display: "flex",
                            }}
                        >
                            <InputLabel id="select-label">Topic</InputLabel>
                            <Select
                                labelId="topic-select-label"
                                id="topic-select"
                                value={selectedTopic.toString()}
                                label="Selected Topic"
                                onChange={handleChangeSelect}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            maxHeight: { xs: 200, xl: 400 },
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
                                        },
                                    },
                                }}
                            >
                                {topics.map((t, index) => (
                                    <MenuItem value={t.id} key={index}>
                                        {t.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}
                <Button
                    variant="contained"
                    sx={{ mt: "auto", alignSelf: "flex-start" }}
                    onClick={() => handleGenerateQuestionDB(selectedTopic)}
                >
                    Generate
                </Button>
            </Box>
        </Modal>
    );
};

export default AddQuestionModal;
