import { Box, Button, Tooltip, Typography } from "@mui/material";
import TextsmsIcon from "@mui/icons-material/Textsms";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { v4 as uuidv4 } from "uuid";
import ContentTable from "../components/GeneratePaper/ContentTable";
import { DataItemWithUUID, Handlers } from "../types/types";
import AddQuestionModal from "../components/GeneratePaper/AddQuestionModal";
import { useState } from "react";
import export_excel from "../assets/icons/export_excel.png";

const GeneratePaper = () => {
    const [open, setOpen] = useState(false); // indicates whether the modal for generating question is open or close
    const [questions, setQuestions] = useState<DataItemWithUUID[]>([]); // this is the questions to be rendered in the ContentTable

    const handleClose = () => {
        setOpen(false);
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

    const handleDifficultyChange = (index: number, newDifficulty: number) => {
        const updatedData = [...questions];
        updatedData[index].difficulty = newDifficulty;
        setQuestions(updatedData);
    };

    const handleQuestionDelete = (index: number) => {
        const updatedData = [...questions];
        updatedData.splice(index, 1);
        setQuestions(updatedData);
    };

    // add a question (empty row) to the table
    const handleQuestionAdd = (index: number) => {
        const updatedData = [...questions];
        updatedData.splice(index + 1, 0, {
            uuid: uuidv4(),
            description: "",
            topics: [],
            difficulty: 1,
        });

        setQuestions(updatedData);
    };

    const handlers: Handlers = {
        handleTopicsChange,
        handleDescriptionChange,
        handleDifficultyChange,
        handleQuestionDelete,
        handleQuestionAdd,
        setQuestions,
    };

    return (
        <Box
            className="outer-page-container"
            mt={"6rem"} // margin to accomodate fixed navbar
            padding={"2rem"}
            textAlign={"start"}
            mx="auto"
            sx={{
                width: { lg: "91%", xl: "79%" },
                height: { xs: "10%", lg: "12%" },
                minHeight: "100vh",
                backgroundColor: "#fff8f6",
                borderRadius: "3rem",
            }}
        >
            <Typography
                fontWeight={"bolder"}
                sx={{
                    fontSize: { xs: "1.5rem", xl: "1.8rem" },
                    mb: "0.5rem",
                }}
            >
                Generate a Paper
            </Typography>
            {/* <Typography>Title of Generated Paper</Typography>
            <TextField>Title</TextField> */}
            <Typography
                fontWeight={"bolder"}
                sx={{
                    fontSize: "17px",
                }}
            >
                Take questions from the database or generate them using GPT-4o
            </Typography>
            <Box
                display={"flex"}
                flexDirection={"row"}
                gap={"1rem"}
                textAlign={"center"}
                mt={"1rem"}
            >
                <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    sx={{
                        backgroundColor: "#d0d0d0",
                        padding: "0.7rem",
                        borderRadius: "0.5rem",
                    }}
                >
                    <TextsmsIcon
                        sx={{
                            fontSize: "1.5rem",
                        }}
                    />
                </Box>
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"flex-start"}
                >
                    <Typography
                        fontWeight={"bolder"}
                        sx={{
                            fontSize: "15px",
                        }}
                    >
                        Generated
                    </Typography>
                    <Typography
                        fontWeight={"bolder"}
                        sx={{
                            fontSize: "15px",
                            opacity: "0.8",
                        }}
                    >
                        {questions.length} questions
                    </Typography>
                </Box>
                <Tooltip title="Export as Excel Spreadsheet">
                    <img src={export_excel} style={{ marginLeft: "1rem" }} />
                </Tooltip>
            </Box>
            {/* generated question section */}
            <ContentTable
                questions={questions}
                handlers={handlers}
                allTopics={[]}
            />

            <AddQuestionModal
                selectedIndex={questions.length} // always add to the end of the list if modal is opened from here
                open={open}
                handleClose={handleClose}
                setQuestions={setQuestions}
            />
            {/* add a question section */}
            <Button
                variant="text"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: "1rem",
                    variant: "contained",
                }}
                onClick={() => setOpen(true)}
            >
                <Typography fontWeight={"bolder"} sx={{ opacity: "0.8" }}>
                    Add a question
                </Typography>
                <AddCircleIcon sx={{ opacity: "0.8", ml: "0.2rem" }} />
            </Button>
        </Box>
    );
};

export default GeneratePaper;
