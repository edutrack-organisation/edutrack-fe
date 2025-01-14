import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DataItem, DataItemWithUUID, Handlers } from "../types/types";
import ContentTable from "../components/ViewPdf/ContentTable";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import PdfViewer from "../components/ViewPdf/PdfViewer";

const DoneUploadPage = () => {
    // get the response from the previous page
    const location = useLocation();
    const { response, file } = location.state;
    const [data, setData] = useState<DataItemWithUUID[]>([]);
    const [title, setTitle] = useState<string>("");
    const [pdffile, setPDFFile] = useState<File | null>(null);
    const [showPDF, setShowPDF] = useState<boolean>(false);

    // set the data to the response
    useEffect(() => {
        if (response) {
            // #NOTE: the item type may not be DataItem as it does not have uuid
            const dataWithUUIDs = response.questions.map((item: DataItem) => ({
                ...item,
                uuid: uuidv4(),
            }));
            setData(dataWithUUIDs);
            setTitle(response.title);
        }
        if (file) {
            setPDFFile(file);
        }
    }, [response]);

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

    // add a question (empty row) to the table
    const handleQuestionAdd = (index: number) => {
        const updatedData = [...data];
        updatedData.splice(index + 1, 0, {
            uuid: uuidv4(),
            description: "",
            topics: [],
            difficulty: 1,
        });
        setData(updatedData);
    };

    // #TODO: Desmond: Refactor into API routes
    const sendParsedToBackend = async () => {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/saveParsedPDF/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: title,
                        questions: data,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail);
            }

            toast.success("Paper saved successfully!");
        } catch (error) {
            if (error instanceof Error) {
                toast.error("Error: " + error.message);
            } else {
                toast.error("An unknown error occurred.");
            }
        }
    };

    // #TODO: we need a handler for title change as well
    const handlers: Handlers = {
        handleTopicsChange,
        handleDescriptionChange,
        handleDifficultyChange,
        handleQuestionDelete,
        handleQuestionAdd,
    };

    return (
        <Box
            display={"flex"}
            alignItems={"center"}
            flexDirection={"column"}
            sx={{ width: { lg: "90%", xl: "78%" } }}
            mx={"auto"}
        >
            <PdfViewer
                pdffile={pdffile}
                showPDF={showPDF}
                setShowPDF={setShowPDF}
            />

            <Box
                display={"flex"}
                justifyContent={"space-between"}
                mt={"5rem"} // margin to accomodate fixed navbar
                pt={"2.5rem"}
                position={"fixed"}
                sx={{
                    width: { lg: "91%", xl: "79%" },
                    backgroundColor: "white",
                    zIndex: 2,
                }}
            >
                {/* This is the uploaded paper title */}
                <Typography
                    fontWeight={"bolder"}
                    sx={{
                        fontSize: { xs: "1.5rem", xl: "1.8rem" },
                        width: { xs: "60%", xl: "75%" },
                    }}
                >
                    {title}
                    {/* CS2105 - Computer Networks Finals 2023/2024 Semester 2 */}
                </Typography>
                <Button onClick={() => setShowPDF(true)}>Open PDF</Button>
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

            <Button
                sx={{ alignSelf: "flex-end", margin: "1rem" }}
                variant="contained"
                size="large"
                onClick={() => sendParsedToBackend()}
            >
                Continue
            </Button>
        </Box>
    );
};

export default DoneUploadPage;
