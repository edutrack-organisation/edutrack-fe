import {
    Box,
    Modal,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import GptIcon from "../../assets/icons/gpt_icon.png";
import DatabaseIcon from "../../assets/icons/database_icon.png";

import { DataItemWithUUID } from "../../types/types";
import GenerateQuestionFromDB from "./GenerateQuestionFromDB";
import GenerateQuestionFromGPT from "./GenerateQuestionFromGPT";

interface AddQuestionModalProps {
    open: boolean;
    handleClose: () => void;
    questions: DataItemWithUUID[];
    setQuestions: React.Dispatch<React.SetStateAction<DataItemWithUUID[]>>;
    setHighlightIndex: React.Dispatch<React.SetStateAction<number>>;
    selectedIndex: number; // Add selectedIndex prop
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

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
    open,
    handleClose,
    setQuestions,
    selectedIndex,
    setHighlightIndex,
    questions,
}) => {
    const [method, setMethod] = useState("gpt"); // This is to handle the toggling between different mode (gpt and DB)

    /**
     * This method filters off the duplicates and add the first (non duplicate) question into the list. We only want to add to the list if the question is not already in the list.
     * @param formattedNewQuestions
     */

    // EVENT HANDLERS

    // This is to handle the toggling between using database and openAI
    const handleChangeMethod = (
        _: React.MouseEvent<HTMLElement>,
        newMethod: string
    ) => {
        setMethod(newMethod);
    };

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
                        Add a Question
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
                    This tool will help you generate and add a question. You can
                    either use ChatGPT API to generate question from scratch by
                    passing in a prompt or generate question by retrieving from
                    database based on a topic.
                </Typography>

                {method === "gpt" ? (
                    <GenerateQuestionFromGPT
                        setQuestions={setQuestions}
                        selectedIndex={selectedIndex}
                        handleModalClose={handleClose}
                        setHighlightIndex={setHighlightIndex}
                    />
                ) : (
                    <GenerateQuestionFromDB
                        setQuestions={setQuestions}
                        selectedIndex={selectedIndex}
                        handleModalClose={handleClose}
                        questions={questions}
                        setHighlightIndex={setHighlightIndex}
                    />
                )}
            </Box>
        </Modal>
    );
};

export default AddQuestionModal;
