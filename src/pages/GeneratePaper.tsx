import { Box, Tooltip, Typography } from "@mui/material";
import TextsmsIcon from "@mui/icons-material/Textsms";
import ContentTable from "../components/GeneratePaper/ContentTable";
import { DataItemWithUUID } from "../types/types";
import { useState } from "react";
import export_excel from "../assets/icons/export_excel.png";

const GeneratePaper = () => {
    const [questions, setQuestions] = useState<DataItemWithUUID[]>([]); // this is the questions to be rendered in the ContentTable

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
                setQuestions={setQuestions}
                allTopics={[]}
            />
        </Box>
    );
};

export default GeneratePaper;
