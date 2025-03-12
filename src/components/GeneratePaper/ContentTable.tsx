import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import TextArea from "../ViewPdf/TextArea";
import { DataItemWithUUID } from "../../types/types";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreatableSelect from "react-select/creatable";
import { MultiValue } from "react-select";
import AddQuestionModal from "./AddQuestionModal";
import { useState } from "react";
import QuickGenerateQuestionModal from "./QuickGenerateQuestionModal";
interface ContentTableProps {
    questions: DataItemWithUUID[];
    setQuestions: React.Dispatch<React.SetStateAction<DataItemWithUUID[]>>;
    allTopics: string[];
}

const ContentTable: React.FC<ContentTableProps> = ({
    questions,
    setQuestions,
    allTopics,
}) => {
    const [indivQuestionModalOpen, setIndivQuestionModalOpen] = useState(false); // indicates whether the modal for adding individual question is open or close
    const [quickGenerateModalOpen, setQuickGenerateModalOpen] = useState(false); // indicates whether the modal for quick generation of questions is open or close
    const [selectedIndex, setSelectedIndex] = useState<number>(-2); // this is the index of the selected question
    const [highlightIndex, setHighlightIndex] = useState<number>(-2); // this is the index of the highlight question

    // Helper functions to format topics properly for react-select rendering
    // React-select requires the value to be in the format {label: string, value: string}
    const formatTopicsForReactSelect = (topics: string[]) => {
        return topics.map((topic) => {
            return { label: topic, value: topic };
        });
    };

    // Helper function to deformat topics for react-select (from {label: string, value: string} to string[])
    const deformatTopicsForReactSelect = (
        topicsLabelValue: MultiValue<{ label: string; value: string }>
    ) => {
        return topicsLabelValue.map((t) => {
            return t.label;
        });
    };

    // Event Handlers
    const handleTopicsChange = (index: number, newChips: string[]) => {
        const updatedData = [...questions];
        updatedData[index].topics = newChips;
        setQuestions(updatedData);
    };

    const handleDescriptionChange = (index: number, newDescription: string) => {
        const updatedData = [...questions];
        updatedData[index].description = newDescription;
        setQuestions(updatedData);
    };

    const handleMarkChange = (index: number, newMark: number) => {
        const updatedData = [...questions];
        updatedData[index].mark = newMark;
        setQuestions(updatedData);
    };

    const handleDifficultyChange = (index: number, newDifficulty: number) => {
        const updatedData = [...questions];
        updatedData[index].difficulty = newDifficulty;
        setQuestions(updatedData);
    };

    const handleQuestionDelete = (index: number) => {
        const updatedData = [...questions];
        updatedData.splice(index, 1);
        setQuestions(updatedData);
        setHighlightIndex(-2); // reset selected index to -2 to remove the highlight
    };

    const handleIndivQuestionModalClose = () => {
        setIndivQuestionModalOpen(false);
    };

    const handleIndivQuestionModalOpen = (index: number) => {
        setIndivQuestionModalOpen(true);
        setSelectedIndex(index); // pass into the modal state
    };

    const handleQuickGenerateQuestionModalClose = () => {
        setQuickGenerateModalOpen(false);
        setSelectedIndex(-2); // reset selected index to -2 to remove the highlight
    };

    const handleQuickGenerateQuestionModalCloseOpen = () => {
        setQuickGenerateModalOpen(true);
        setSelectedIndex(-2); // reset selected index to -2 to remove the highlight
    };

    return (
        <>
            <TableContainer
                component={Paper}
                sx={{
                    mt: "2rem",
                }}
            >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: "10%" }}>
                                Question Number
                            </TableCell>
                            <TableCell sx={{ width: "50%" }} align="left">
                                Description
                            </TableCell>
                            <TableCell sx={{ width: "20%" }} align="left">
                                Topics
                            </TableCell>
                            <TableCell sx={{ width: "10%" }} align="left">
                                Marks
                            </TableCell>
                            <TableCell align="right">Difficulty</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((row, index) => (
                            <TableRow
                                key={row.uuid}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                    border:
                                        highlightIndex + 1 === index &&
                                        !indivQuestionModalOpen
                                            ? "3px solid #E4CACA"
                                            : "none",
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell align="left">
                                    <TextArea
                                        className="textarea"
                                        textContent={row.description}
                                        onChange={(event) =>
                                            handleDescriptionChange(
                                                index,
                                                event.target.value
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell align="left">
                                    <CreatableSelect
                                        isMulti
                                        value={formatTopicsForReactSelect(
                                            row.topics
                                        )}
                                        options={formatTopicsForReactSelect(
                                            allTopics
                                        )}
                                        onChange={(newChip) =>
                                            handleTopicsChange(
                                                index,
                                                deformatTopicsForReactSelect(
                                                    newChip
                                                )
                                            )
                                        }
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                width: "350px",
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
                                </TableCell>
                                <TableCell align="left">
                                    <TextField
                                        type="number"
                                        id="outlined-basic"
                                        defaultValue={row.mark || 0}
                                        variant="outlined"
                                        onChange={(event) =>
                                            handleMarkChange(
                                                index,
                                                parseInt(event.target.value)
                                            )
                                        }
                                        sx={{
                                            "& .MuiTextField-root": {
                                                "& fieldset": {
                                                    borderColor: "#E5EAF2", // Custom border color
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "#B0BEC5", // Border color on hover
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#1E88E5", // Border color when focused
                                                },
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <TextField
                                        type="number"
                                        id="outlined-basic"
                                        defaultValue={row.difficulty || 0}
                                        variant="outlined"
                                        onChange={(event) =>
                                            handleDifficultyChange(
                                                index,
                                                parseInt(event.target.value)
                                            )
                                        }
                                        sx={{
                                            "& .MuiTextField-root": {
                                                "& fieldset": {
                                                    borderColor: "#E5EAF2", // Custom border color
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "#B0BEC5", // Border color on hover
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#1E88E5", // Border color when focused
                                                },
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Delete Question">
                                        <IconButton
                                            onClick={() => {
                                                handleQuestionDelete(index);
                                            }}
                                        >
                                            <DeleteOutlineIcon
                                                sx={{
                                                    height: "2rem",
                                                    width: "2rem",
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Add Question">
                                        <IconButton
                                            onClick={() => {
                                                handleIndivQuestionModalOpen(
                                                    index
                                                );
                                            }}
                                        >
                                            <AddCircleOutlineIcon
                                                sx={{
                                                    height: "2rem",
                                                    width: "2rem",
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <AddQuestionModal
                open={indivQuestionModalOpen}
                handleClose={handleIndivQuestionModalClose}
                questions={questions}
                setQuestions={setQuestions}
                selectedIndex={selectedIndex} // Pass the selected index to the modal
                setHighlightIndex={setHighlightIndex}
            />

            {/* modal for quick generation of questions */}
            <QuickGenerateQuestionModal
                open={quickGenerateModalOpen}
                setQuestions={setQuestions}
                handleClose={handleQuickGenerateQuestionModalClose}
            />

            {/* Buttons for modal */}
            <Box display="flex">
                {/* button for quick generation of questions */}
                <Button
                    variant="text"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: "1rem",
                        variant: "contained",
                    }}
                    onClick={() => {
                        handleQuickGenerateQuestionModalCloseOpen();
                    }}
                >
                    <Typography fontWeight={"bolder"} sx={{ opacity: "0.8" }}>
                        Quick Generate
                    </Typography>
                    <AddCircleIcon sx={{ opacity: "0.8", ml: "0.2rem" }} />
                </Button>

                {/* button for adding new question */}
                <Button
                    variant="text"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: "1rem",
                        variant: "contained",
                    }}
                    onClick={() => {
                        setSelectedIndex(questions.length - 1); // selectedIndex set to -1 as after adding we want to highlight index 0 element
                        setIndivQuestionModalOpen(true);
                    }}
                >
                    <Typography fontWeight={"bolder"} sx={{ opacity: "0.8" }}>
                        Add a question
                    </Typography>
                    <AddCircleIcon sx={{ opacity: "0.8", ml: "0.2rem" }} />
                </Button>
            </Box>
        </>
    );
};

export default ContentTable;
