import {
    Button,
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
import TextArea from "./ViewPdf/TextArea";
import { MuiChipsInput } from "mui-chips-input";
import { DataItem, Handlers } from "../types/types";
import { useEffect, useState } from "react";
import Api, { ApiError } from "../api/Api";

interface ContentTableProps {
    title: String,
}

const ContentTableFromTitle: React.FC<ContentTableProps> = ({ title }) => {

    const [isFetchingPaper, setIsFetchingPaper] = useState<Boolean>(true);
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

    useEffect(() => {
        Api.getPaper(title).then((response) => {
            setIsFetchingPaper(false);
            setData(response.data.questionData);
        }).catch((error) => {
            if (error instanceof ApiError) {
                // Handle specific API errors
                console.error("API Error uploading file:", error.message);
            } else {
                // Handle any unexpected errors
                console.error("Unexpected error uploading file:", error);
            }
            setIsFetchingPaper(false);
        });
    }, []);

    return (
        <>
            <Typography fontWeight={"bolder"} fontSize={"1.8rem"}>
                {title}
            </Typography>
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
                            <TableCell sx={{ width: "30%" }} align="left">
                                Topics
                            </TableCell>
                            <TableCell align="right">Difficulty</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow
                                key={row.question_uuid}
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
                </Table>
            </TableContainer>
        </>
    );
};

export default ContentTableFromTitle;
