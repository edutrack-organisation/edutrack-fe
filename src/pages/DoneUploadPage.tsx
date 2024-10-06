import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api, { ApiError } from "../api/Api";
import ContentTable from "../components/ViewPdf/ContentTable";
import { DataItem, Handlers } from "../types/types";
import { theme } from "../theme";

const DoneUploadPage = () => {
    const navigate = useNavigate();

    // get the response from the previous page
    const location = useLocation();
    const { title, questionData } = location.state.response.data || [];

    const [data, setData] = useState<DataItem[]>([]);

    // set the data to the response
    useEffect(() => {
        setData(questionData);
    }, [questionData]);

    // TODO (desmond): optimisation to event handlers
    // Event Handlers
    const handleTopicsChange = (index: number, newChips: string[]) => {
        const updatedData = [...data];
        updatedData[index].topics = newChips;
        setData(updatedData);
    };

    const handleDescriptionChange = (index: number, newDescription: string) => {
        const updatedData = [...data];
        updatedData[index].description = newDescription;
        setData(updatedData);
    };

    const handleDifficultyChange = (index: number, newDifficulty: number) => {
        const updatedData = [...data];
        updatedData[index].difficulty = newDifficulty;
        setData(updatedData);
    };

    const handleQuestionDelete = (index: number) => {
        const updatedData = [...data];
        updatedData.splice(index, 1);
        setData(updatedData);
    };

    const handlers: Handlers = {
        handleTopicsChange,
        handleDescriptionChange,
        handleDifficultyChange,
        handleQuestionDelete,
    };


    // Handles submitting of the modified data
    const [isSubmittingData, setIsSubmittingData] = useState<Boolean>(false);

    const handlePdfSubmit = async () => {
        try {
            setIsSubmittingData(true);
            const response = await Api.submitPdfData(title, questionData);
            setIsSubmittingData(false);

            // // Redirect after done
            navigate("/viewpdf", { state: { response: response } });
        } catch (error) {
            if (error instanceof ApiError) {
                // Handle specific API errors
                console.error("API Error uploading file:", error.message);
            } else {
                // Handle any unexpected errors
                console.error("Unexpected error uploading file:", error);
            }
            setIsSubmittingData(false);
        }
    };

    return (
        <Box
            display={"flex"}
            alignItems={"center"}
            flexDirection={"column"}
            sx={{ width: { lg: "90%", xl: "78%" } }}
            mx={"auto"}
        >
            <Box
                display={"flex"}
                width={"100%"}
                padding={"1rem"}
                mt={"2rem"}
                justifyContent={"space-between"}
            >
                {/* This is the uploaded paper title */}
                <Typography fontWeight={"bolder"} fontSize={"1.8rem"}>
                    {title}
                </Typography>
                <Box
                    width={"13rem"}
                    padding={"1rem"}
                    borderRadius={"0.5rem"}
                    sx={{ background: "rgb(222, 242, 255)" }}
                >
                    <Typography textAlign={"start"}>
                        Please Check Through The Parsed Paper Before Proceeding.
                    </Typography>
                </Box>
            </Box>

            {/* This is the table of questions and its details */}
            <ContentTable data={data} handlers={handlers} />

            {isSubmittingData
                ? <CircularProgress
                    size={"50px"}
                    sx={{ alignSelf: "flex-end", margin: "1rem", color: theme.colors.highlight1 }}
                />
                : <Button
                    sx={{ alignSelf: "flex-end", margin: "1rem" }}
                    variant="contained"
                    size="large"
                    onClick={handlePdfSubmit}
                >
                    Continue
                </Button>
            }
        </Box>
    );
};

export default DoneUploadPage;
