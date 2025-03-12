import { Box, Button, CircularProgress, Typography } from "@mui/material";
import TextArea from "../ViewPdf/TextArea";
import { useState } from "react";
import toast from "react-hot-toast";
import { DataItemWithUUID } from "../../types/types";

interface GeneratedQuestionFromGPTProps {
    setQuestions: React.Dispatch<React.SetStateAction<DataItemWithUUID[]>>;
    selectedIndex: number;
    handleModalClose: () => void;
}

const GenerateQuestionFromGPT: React.FC<GeneratedQuestionFromGPTProps> = ({
    setQuestions,
    selectedIndex,
    handleModalClose,
}) => {
    const [prompt, setPrompt] = useState("");
    const [generating, setGenerating] = useState(false);

    const generateQuestionFromGPT = async () => {
        try {
            setGenerating(true);
            const response = await fetch(
                "http://127.0.0.1:8000/generate-gpt/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt: prompt,
                    }),
                }
            );

            if (!response.ok) {
                toast.error("Error in generating question using GPT");
                return;
            }

            const generatedQuestion = await response.json();
            appendGeneratedQuestion(generatedQuestion);
            setGenerating(false);
            handleModalClose();
        } catch (error) {
            toast.error("Error in generating question using GPT");
            setGenerating(false);
        }
    };

    const appendGeneratedQuestion = (generatedQuestion: DataItemWithUUID) => {
        setQuestions((prevQuestions) => {
            const updatedData = [...prevQuestions]; // make a copy of the old set of questions before addition

            // insert at the correct position
            updatedData.splice(selectedIndex + 1, 0, generatedQuestion);

            return updatedData; // return statement for setQuestions
        });
    };

    // Event handlers
    // This is to handle the clicking of generate button for GPT
    const handleGenerateQuestionGPT = () => {
        generateQuestionFromGPT();
    };

    return (
        <>
            <Box mt={"1rem"}>
                <Typography
                    fontWeight={"bolder"}
                    sx={{
                        fontSize: "17px",
                        mb: "0.5rem",
                    }}
                >
                    Generate questions from scratch (by passing in prompt to
                    GPT-4o)
                </Typography>
                <TextArea
                    className="textarea"
                    placeHolder={"Type your prompt here..."}
                    onChange={(event) => setPrompt(event.target.value)}
                />
            </Box>
            {generating && <CircularProgress sx={{ my: "auto", mx: "auto" }} />}
            <Button
                variant="contained"
                sx={{ mt: "auto", alignSelf: "flex-start" }}
                onClick={() => handleGenerateQuestionGPT()}
            >
                Generate
            </Button>
        </>
    );
};

export default GenerateQuestionFromGPT;
