import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import TextArea from "./TextArea";
import { MuiChipsInput } from "mui-chips-input";
import { DataItem, Handlers } from "../../types/types";
import { useEffect, useState } from "react";
import Api, { ApiError } from "../../api/Api";
import { v4 as uuidv4 } from "uuid";

interface ContentTableProps {
    title: String;
}

const ContentTableFromTitle: React.FC<ContentTableProps> = ({ title }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isUploadingScores, setIsUploadingScores] = useState<boolean>(false);
    const [data, setData] = useState<DataItem[]>([]);

    // TODO: optimisation to event handlers(?)
    // Event Handlers
    const handleTopicsChange = (index: number, newChips: string[]) => {
        const updatedData = [...data];
        updatedData[index].topics = newChips;
        setData(updatedData);
        Api.changePaperQuestionTopics(title, index, newChips);
    };

    const handleDescriptionChange = (index: number, newDescription: string) => {
        const updatedData = [...data];
        updatedData[index].description = newDescription;
        setData(updatedData);
        Api.changePaperQuestionDescription(title, index, newDescription);
    };

    const handleMarksChange = (index: number, newMarks: number) => {
        const updatedData = [...data];
        updatedData[index].marks = newMarks;
        setData(updatedData);
        Api.changePaperQuestionMarks(title, index, newMarks);
    };

    const handleDifficultyChange = (index: number, newDifficulty: number) => {
        const updatedData = [...data];
        updatedData[index].difficulty = newDifficulty;
        setData(updatedData);
        Api.changePaperQuestionDifficulty(title, index, newDifficulty);
    };

    const handleQuestionDelete = (index: number) => {
        const updatedData = [...data];
        updatedData.splice(index, 1);
        setData(updatedData);
        Api.deletePaperQuestion(title, index);
    };

    const handlers: Handlers = {
        handleTopicsChange,
        handleDescriptionChange,
        handleDifficultyChange,
        handleQuestionDelete,
    };

    const handleUploadDifficulty = () => {
        // TODO: to be implemented
    };

    const handleViewScores = () => {
        // TODO: to be implemented
    };

    const handleUploadScores = () => {
        setIsUploadingScores(true);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        // TODO: Make a one time push to BE when saving instead of pushing to API with every change.
    };

    useEffect(() => {
        setIsLoading(true);
        setIsEditing(false);
        Api.getPaper(title)
            .then((response) => {
                setIsLoading(false);
                setData(response.data.questionData);
            })
            .catch((error) => {
                if (error instanceof ApiError) {
                    // Handle specific API errors
                    console.error("API Error uploading file:", error.message);
                } else {
                    // Handle any unexpected errors
                    console.error("Unexpected error uploading file:", error);
                }
                setIsLoading(false);
            });
    }, [title]);

    return (
        <>
            {/* Paper title */}
            <Typography fontWeight={"bold"} fontSize={"1.8rem"}>
                {title}
            </Typography>
            {isLoading
                ? <Box><CircularProgress size={"100px"} /></Box>
                :
                <>
                    <Box sx={{ display: "flex", gap: 2, marginRight: 3, alignSelf: 'flex-end' }}>
                        <Button variant="contained"
                            onClick={handleUploadDifficulty}
                        >
                            Upload Difficulty
                        </Button>
                        <Button variant="contained"
                            onClick={handleViewScores}
                        >
                            View Scores
                        </Button>
                        <Button variant="contained"
                            onClick={handleUploadScores}
                        >
                            Upload Scores
                        </Button>
                        {isEditing
                            ? <Button variant="contained"
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            : <Button variant="contained"
                                onClick={handleEdit}
                            >
                                Edit
                            </Button>}
                    </Box>
                    <TableContainer
                        component={Paper}
                        sx={{
                            // width: { lg: "90%", xl: "80%" },
                            mt: "1.5rem",
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
                                    <TableCell sx={{ width: "10%" }} align="center">Marks</TableCell>
                                    <TableCell sx={{ width: "10%" }} align="center">Difficulty</TableCell>
                                    {isEditing && <TableCell />}
                                </TableRow>
                            </TableHead>
                            {isEditing
                                ? <TableBody>
                                    {data.map((row, index) => (
                                        <TableRow
                                            sx={{
                                                "&:last-child td, &:last-child th": {
                                                    border: 0,
                                                },
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell align="left">
                                                <TextArea
                                                    textContent={row.description}
                                                    onChange={(event) =>
                                                        handlers.handleDescriptionChange(
                                                            index,
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell align="left">
                                                <MuiChipsInput
                                                    value={row.topics}
                                                    onChange={(newChip) =>
                                                        handlers.handleTopicsChange(
                                                            index,
                                                            newChip
                                                        )
                                                    }
                                                    sx={{
                                                        width: "350px",
                                                        "& .MuiOutlinedInput-root": {
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
                                                    defaultValue={row.marks || 0}
                                                    variant="outlined"
                                                    onChange={(event) =>
                                                        handlers.handleMarksChange(
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
                                                        handlers.handleDifficultyChange(
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
                                                <Button
                                                    onClick={() => {
                                                        handlers.handleQuestionDelete(
                                                            index
                                                        );
                                                    }}
                                                    sx={{
                                                        alignSelf: "flex-end",
                                                        margin: "1rem",
                                                    }}
                                                    variant="contained"
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                : <TableBody>
                                    {data.map((row, index) => (
                                        <TableRow key={uuidv4()} >
                                            <TableCell component="th" scope="row">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography> {row.description} </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.topics.map(topic => <Chip label={topic} sx={{ margin: 1 }} />)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography> {row.marks || 0} </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography> {row.difficulty || 0} </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            }
                        </Table>
                    </TableContainer></>
            }
        </>
    );
};

export default ContentTableFromTitle;
