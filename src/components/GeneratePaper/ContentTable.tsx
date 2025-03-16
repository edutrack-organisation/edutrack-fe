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
import TextArea from "../DoneUpload/TextArea";
import { DataItemWithUUID } from "../../types/types";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreatableSelect from "react-select/creatable";
import { MultiValue } from "react-select";
import AddSingleQuestionModal from "./AddSingleQuestionModal";
import { useState } from "react";
import QuickGenerateQuestionsModal from "./QuickGenerateQuestionsModal";
import { scrollbarStyle } from "./styles";
import { tableStyles } from "../../styles";

interface ActionButtonsProps {
    onQuickGenerate: () => void;
    onAddQuestion: () => void;
}

interface ContentTableProps {
    questions: DataItemWithUUID[];
    setQuestions: React.Dispatch<React.SetStateAction<DataItemWithUUID[]>>;
    allTopics: string[];
}

/**
 * ActionButtons component renders two buttons for question management:
 * 1. Quick Generate - Opens modal for quick question generation
 * 2. Add a question - Opens modal for adding individual questions
 *
 * @param onQuickGenerate - Callback function for quick generate button click
 * @param onAddQuestion - Callback function for add question button click
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({ onQuickGenerate, onAddQuestion }) => (
    <Box display="flex">
        <Button variant="text" sx={tableStyles.button} onClick={onQuickGenerate}>
            <Typography fontWeight={"bolder"} sx={{ opacity: "0.8" }}>
                Quick Generate
            </Typography>
            <AddCircleIcon sx={{ opacity: "0.8", ml: "0.2rem" }} />
        </Button>

        <Button variant="text" sx={tableStyles.button} onClick={onAddQuestion}>
            <Typography fontWeight={"bolder"} sx={{ opacity: "0.8" }}>
                Add a question
            </Typography>
            <AddCircleIcon sx={{ opacity: "0.8", ml: "0.2rem" }} />
        </Button>
    </Box>
);

const ContentTable: React.FC<ContentTableProps> = ({ questions, setQuestions, allTopics }) => {
    const [indivQuestionModalOpen, setIndivQuestionModalOpen] = useState(false); // Controls the visibility of the individual question modal
    const [quickGenerateModalOpen, setQuickGenerateModalOpen] = useState(false); // Controls the visibility of the quick generate questions modal
    /**
     * Tracks the index of the currently selected question
     * -2: No question selected
     */
    const [selectedIndex, setSelectedIndex] = useState<number>(-2);
    /**
     * Tracks the index of the question to highlight in the table
     * -2: No highlight
     * n: Highlights the (n+1)th question with a red border
     */
    const [highlightIndex, setHighlightIndex] = useState<number>(-2);

    /**
     * Formats topics for react-select dropdown, mapping string format
     * to required select options format (label, value)
     */
    const formatTopicsForReactSelect = (topics: string[]) => {
        return topics.map((topic) => {
            return { label: topic, value: topic };
        });
    };

    /**
     * Converts the format of topics from react-select dropdown to string format
     */
    const deformatTopicsForReactSelect = (topicsLabelValue: MultiValue<{ label: string; value: string }>) => {
        return topicsLabelValue.map((t) => {
            return t.label;
        });
    };

    /**
     * Resets the highlightIndex to -2 to remove the highlight
     */
    const resetHighlight = () => {
        setHighlightIndex(-2);
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
        resetHighlight();
    };

    const handleIndivQuestionModalClose = () => {
        setIndivQuestionModalOpen(false);
    };

    const handleIndivQuestionModalOpen = (index: number) => {
        setIndivQuestionModalOpen(true);
        setSelectedIndex(index); // pass into the modal state
        resetHighlight();
    };

    const handleQuickGenerateQuestionsModalClose = () => {
        setQuickGenerateModalOpen(false);
        resetHighlight();
    };

    const handleQuickGenerateQuestionsModalCloseOpen = () => {
        setQuickGenerateModalOpen(true);
        resetHighlight();
    };

    return (
        <>
            <TableContainer component={Paper} sx={tableStyles.container}>
                <Table sx={tableStyles.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: "10%" }}>Question Number</TableCell>
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
                                        highlightIndex + 1 === index && !indivQuestionModalOpen
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
                                        onChange={(event) => handleDescriptionChange(index, event.target.value)}
                                    />
                                </TableCell>
                                <TableCell align="left">
                                    <CreatableSelect
                                        isMulti
                                        value={formatTopicsForReactSelect(row.topics)}
                                        options={formatTopicsForReactSelect(allTopics)}
                                        onChange={(newChip) =>
                                            handleTopicsChange(index, deformatTopicsForReactSelect(newChip))
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
                                                ...scrollbarStyle, // Apply custom scrollbar styles
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
                                        onChange={(event) => handleMarkChange(index, parseInt(event.target.value))}
                                        sx={tableStyles.textField}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <TextField
                                        type="number"
                                        id="outlined-basic"
                                        defaultValue={row.difficulty || 0}
                                        variant="outlined"
                                        onChange={(event) =>
                                            handleDifficultyChange(index, parseInt(event.target.value))
                                        }
                                        sx={tableStyles.textField}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Delete Question">
                                        <IconButton
                                            onClick={() => {
                                                handleQuestionDelete(index);
                                            }}
                                        >
                                            <DeleteOutlineIcon sx={tableStyles.icon} />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Add Question">
                                        <IconButton
                                            onClick={() => {
                                                handleIndivQuestionModalOpen(index);
                                            }}
                                        >
                                            <AddCircleOutlineIcon sx={tableStyles.icon} />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal for adding individual question */}
            <AddSingleQuestionModal
                open={indivQuestionModalOpen}
                handleClose={handleIndivQuestionModalClose}
                questions={questions}
                setQuestions={setQuestions}
                selectedIndex={selectedIndex} // Pass the selected index to the modal
                setHighlightIndex={setHighlightIndex}
            />

            {/* Modal for quick generation of questions */}
            <QuickGenerateQuestionsModal
                open={quickGenerateModalOpen}
                setQuestions={setQuestions}
                handleClose={handleQuickGenerateQuestionsModalClose}
            />

            {/* Buttons for modal */}
            <ActionButtons
                onQuickGenerate={handleQuickGenerateQuestionsModalCloseOpen}
                onAddQuestion={() => {
                    setSelectedIndex(questions.length - 1);
                    setIndivQuestionModalOpen(true);
                }}
            />
        </>
    );
};

export default ContentTable;
