import {
    Box,
    Modal,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import TextArea from "../ViewPdf/TextArea";
import React, { useState } from "react";
import GptIcon from "../../assets/icons/gpt_icon.png";
import DatabaseIcon from "../../assets/icons/database_icon.png";

import { DataItemWithUUID } from "../../types/types";
import GenerateQuestionFromDB from "./GenerateQuestionFromDB";
import GenerateQuestionFromGPT from "./GenerateQuestionFromGPT";

interface AddQuestionModalProps {
    open: boolean;
    handleClose: () => void;
    setQuestions: React.Dispatch<React.SetStateAction<DataItemWithUUID[]>>;
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
                    // <Box mt={"1rem"}>
                    //     <Typography
                    //         fontWeight={"bolder"}
                    //         sx={{
                    //             fontSize: "17px",
                    //             mb: "0.5rem",
                    //         }}
                    //     >
                    //         Generate questions from scratch (by passing in
                    //         prompt to GPT-4o)
                    //     </Typography>
                    //     <TextArea
                    //         className="textarea"
                    //         placeHolder={"Type your prompt here..."}
                    //         // onChange={(event) =>
                    //         //     handlers.handleTitleChange(event.target.value)
                    //         // }
                    //     />
                    // </Box>
                    <GenerateQuestionFromGPT />
                ) : (
                    <GenerateQuestionFromDB
                        setQuestions={setQuestions}
                        selectedIndex={selectedIndex}
                    />
                )}
            </Box>
        </Modal>
    );
};

export default AddQuestionModal;
