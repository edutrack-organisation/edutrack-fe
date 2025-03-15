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
import { modalVariants } from "./styles";

// Type for question generation method
type GenerationMethod = "db" | "gpt";

interface AddSingleQuestionModalProps {
    open: boolean;
    handleClose: () => void;
    questions: DataItemWithUUID[];
    setQuestions: React.Dispatch<React.SetStateAction<DataItemWithUUID[]>>;
    setHighlightIndex: React.Dispatch<React.SetStateAction<number>>;
    selectedIndex: number;
}

const AddSingleQuestionModal: React.FC<AddSingleQuestionModalProps> = ({
    open,
    handleClose,
    setQuestions,
    selectedIndex,
    setHighlightIndex,
    questions,
}) => {
    const [method, setMethod] = useState<GenerationMethod>("db"); // This is to handle the toggling between different mode (gpt and DB)

    /**
     * Modal header component
     */
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
        </>
    );

    // Event handlers

    /**
     * Handles the toggle between GPT and Database question generation methods
     * @param _ - Unused mouse event
     * @param newMethod - The newly selected method ('gpt' or 'db')
     */
    const handleChangeMethod = (
        _: React.MouseEvent<HTMLElement>,
        newMethod: GenerationMethod
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
            <Box sx={modalVariants.addQuestion}>
                <ModalHeader />
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

export default AddSingleQuestionModal;
