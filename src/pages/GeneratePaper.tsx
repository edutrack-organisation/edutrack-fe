import { Box, Tooltip, Typography } from "@mui/material";
import TextsmsIcon from "@mui/icons-material/Textsms";
import ContentTable from "../components/GeneratePaper/ContentTable";
import { DataItemWithUUID } from "../types/types";
import { useEffect, useState } from "react";
import export_excel from "../assets/icons/export_excel.png";
import { useTopics } from "../hooks";
import { PieChartData, Topic } from "../components/GeneratePaper/types";
import toast from "react-hot-toast";
import { countGeneratedQuestionStatistic, exportToExcel } from "../components/GeneratePaper/utils";
import GeneratedQuestionStatistic from "../components/GeneratePaper/GeneratedQuestionStatistic";

const GeneratePaper = () => {
    const [questions, setQuestions] = useState<DataItemWithUUID[]>([]); // this is the questions to be rendered in the ContentTable
    const { topics, fetchTopics } = useTopics(); // Custom react hook to fetch full list of topics from the database

    const [pieChartTopicsMarksSeries, setPieChartTopicsMarksSeries] = useState<PieChartData[]>([]);
    const [pieChartWeightedTopicsMarksSeries, setPieChartWeightedTopicsMarksSeries] = useState<PieChartData[]>([]);

    const handleExportExcel = () => {
        if (questions.length === 0) {
            toast.error("No questions to export!");
            return;
        }
        exportToExcel(questions);
    };

    const PageHeader = () => {
        return (
            <Box display={"flex"}>
                <Box className="left-container">
                    <Typography
                        fontWeight={"bolder"}
                        sx={{
                            fontSize: { xs: "1.5rem", xl: "1.8rem" },
                            mb: "0.5rem",
                        }}
                    >
                        Generate a Paper
                    </Typography>
                    <Typography
                        fontWeight={"bolder"}
                        sx={{
                            fontSize: "17px",
                        }}
                    >
                        Take questions from the database or generate them using GPT-4o
                    </Typography>
                    <Box display={"flex"} flexDirection={"row"} gap={"1rem"} textAlign={"center"} mt={"1rem"}>
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
                        <Box display={"flex"} flexDirection={"column"} alignItems={"flex-start"}>
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
                            <img src={export_excel} style={{ marginLeft: "1rem" }} onClick={handleExportExcel} />
                        </Tooltip>
                    </Box>
                </Box>
                <Box className="right-container" sx={{ ml: "auto", width: "40%", mr: "1rem" }}>
                    <GeneratedQuestionStatistic
                        pieChartTopicsMarksSeries={pieChartTopicsMarksSeries}
                        pieChartWeightedTopicsMarksSeries={pieChartWeightedTopicsMarksSeries}
                    />
                </Box>
            </Box>
        );
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    useEffect(() => {
        const { pieChartTopicsMarksSeries, pieChartWeightedTopicsMarksSeries } =
            countGeneratedQuestionStatistic(questions);
        setPieChartTopicsMarksSeries(pieChartTopicsMarksSeries);
        setPieChartWeightedTopicsMarksSeries(pieChartWeightedTopicsMarksSeries);
    }, [questions]);

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
            <PageHeader />

            {/* content table: includes content table component and logic for modal popup */}
            <ContentTable
                questions={questions}
                setQuestions={setQuestions}
                allTopics={topics.map((t: Topic) => t.title)}
            />
        </Box>
    );
};

export default GeneratePaper;
