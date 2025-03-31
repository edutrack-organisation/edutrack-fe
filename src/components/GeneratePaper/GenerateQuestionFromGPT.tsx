import { Box, Button, CircularProgress, Typography } from "@mui/material";
import TextArea from "../DoneUpload/TextArea";
import { useState } from "react";
import toast from "react-hot-toast";
import { DataItemWithUUID } from "../../types/types";
import { generatePaperApi } from "./generatePaperApi";

interface GeneratedQuestionFromGPTProps {
    setQuestions: React.Dispatch<React.SetStateAction<DataItemWithUUID[]>>;
    setHighlightIndex: React.Dispatch<React.SetStateAction<number>>;
    selectedIndex: number;
    handleModalClose: () => void;
}

const GenerateQuestionFromGPT: React.FC<GeneratedQuestionFromGPTProps> = ({
    setQuestions,
    selectedIndex,
    handleModalClose,
    setHighlightIndex,
}) => {
    const [prompt, setPrompt] = useState(""); // Stores the user's input prompt for GPT question generation
    const [generating, setGenerating] = useState(false); // Loading state for question generation

    /**
     * This method fetch the question generate from GPT (via the backend) by passing in the prompt
     * @param prompt
     */
    const generateQuestionFromGPT = async (prompt: string) => {
        try {
            setGenerating(true);
            const generatedQuestion = await generatePaperApi.generateQuestionFromGPT(prompt);
            appendGeneratedQuestion(generatedQuestion);
            setPrompt(""); // reset the prompt
            handleModalClose();
        } catch (error) {
            toast.error((error as Error).message || "Error in generating question using GPT");
        } finally {
            setGenerating(false);
        }
    };

    /**
     * This method append the newly generated question to the list of questions.
     * @param generatedQuestion
     */
    const appendGeneratedQuestion = (generatedQuestion: DataItemWithUUID) => {
        setQuestions((prevQuestions) => {
            const updatedData = [...prevQuestions]; // make a copy of the old set of questions before addition

            // insert at the correct position
            updatedData.splice(selectedIndex + 1, 0, generatedQuestion);

            // to trigger highlighting
            setHighlightIndex(selectedIndex);
            return updatedData; // return statement for setQuestions
        });
    };

    // Event handlers
    // This is to handle the clicking of generate button for GPT
    const handleGenerateQuestionGPT = () => {
        generateQuestionFromGPT(prompt);
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
                    Generate questions from scratch (by passing in prompt to GPT-4o)
                </Typography>
            </Box>

            <TextArea
                required
                className="textarea"
                placeHolder={"Type your prompt here..."}
                onChange={(event) => setPrompt(event.target.value)}
            />
            {generating && <CircularProgress sx={{ my: "auto", mx: "auto" }} />}
            <Button
                variant="contained"
                sx={{ mt: "auto", alignSelf: "flex-start" }}
                onClick={() => handleGenerateQuestionGPT()}
                disabled={generating || prompt === ""}
            >
                Generate
            </Button>
        </>
    );
};

export default GenerateQuestionFromGPT;
