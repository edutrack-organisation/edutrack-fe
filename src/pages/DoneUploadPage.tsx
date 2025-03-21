/**
 * @file DoneUploadPage.tsx
 * @description Page component for reviewing and editing parsed PDF questions
 * Features:
 * - PDF viewer integration
 * - Editable title and questions
 * - Question management (add, delete, modify)
 * - Debounced updates for performance
 * - Save functionality with backend integration
 */

import { Box, Button, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { DataItem, DataItemWithUUID, Handlers } from "../types/types";
import ContentTable from "../components/DoneUpload/ContentTable";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { debounce } from "lodash";

import "react-pdf/dist/Page/AnnotationLayer.css"; // Required for PDF Viewer
import "react-pdf/dist/Page/TextLayer.css"; // Required for PDF Viewer
import PdfViewer from "../components/DoneUpload/PdfViewer";
import TextArea from "../components/DoneUpload/TextArea";
import EditIcon from "@mui/icons-material/Edit";
import { parsedPdfApi } from "../components/DoneUpload/doneUploadAPI";

// Constants
const DEBOUNCE_DELAY = 300;
interface TitleSectionProps {
    title: string;
    isEditingTitle: boolean;
    setisEditingTitle: (value: boolean) => void;
    handlers: Handlers;
}

const TitleSection: React.FC<TitleSectionProps> = ({ title, isEditingTitle, setisEditingTitle, handlers }) =>
    !isEditingTitle ? (
        <Box display="flex" sx={{ width: { xs: "60%", xl: "75%" } }}>
            <Typography fontWeight="bolder" sx={{ fontSize: { xs: "1.2rem", xl: "1.8rem" } }}>
                {title}
            </Typography>
            <EditIcon
                onClick={() => setisEditingTitle(true)}
                sx={{ cursor: "pointer", ml: { xs: "1rem", xl: "3rem" } }}
            />
        </Box>
    ) : (
        <TextArea
            className="textarea-title"
            textContent={title}
            onChange={(event) => handlers.handleTitleChange(event.target.value)}
        />
    );

const DoneUploadPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { response, file } = location.state; // get the response from the previous page
    const [data, setData] = useState<DataItemWithUUID[]>([]);
    const [title, setTitle] = useState<string>("");
    const [allTopics, setAllTopics] = useState<string[]>([]);
    const [isEditingTitle, setisEditingTitle] = useState<boolean>(false); // keep track if editing title to conditionally render textarea or typography
    const [pdffile, setPDFFile] = useState<File | null>(null);
    const [showPDF, setShowPDF] = useState<boolean>(false);

    // Debounced functions
    const debouncedSetData = useCallback(
        debounce((updatedData: DataItemWithUUID[]) => setData(updatedData), DEBOUNCE_DELAY),
        []
    );

    const debouncedSetTitle = useCallback(
        debounce((newTitle: string) => setTitle(newTitle), DEBOUNCE_DELAY),
        []
    );

    // Event Handlers
    const handleTopicsChange = (index: number, newChips: string[]) => {
        const updatedData = [...data];
        updatedData[index].topics = newChips;
        setData(updatedData);
    };

    const handleDescriptionChange = (index: number, newDescription: string) => {
        const updatedData = [...data];
        updatedData[index].description = newDescription;
        debouncedSetData(updatedData);
    };

    const handleDifficultyChange = (index: number, newDifficulty: number) => {
        const updatedData = [...data];
        updatedData[index].difficulty = newDifficulty;
        setData(updatedData);
    };

    const handleMarkChange = (index: number, newMark: number) => {
        const updatedData = [...data];
        updatedData[index].mark = newMark;
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
            mark: 0,
            difficulty: 0,
        });
        setData(updatedData);
    };

    const handleTitleChange = (newTitle: string) => {
        debouncedSetTitle(newTitle);
        setisEditingTitle(true);
    };

    const handlers: Handlers = {
        handleTopicsChange,
        handleDescriptionChange,
        handleDifficultyChange,
        handleQuestionDelete,
        handleQuestionAdd,
        handleTitleChange,
        handleMarkChange,
    };

    const sendParsedToBackend = async () => {
        try {
            const questionsWithoutUUID = data.map(({ uuid, ...rest }) => rest);
            await parsedPdfApi.saveParsedPDF({
                title,
                questions: questionsWithoutUUID,
            });

            toast.success("Paper saved successfully!");

            navigate("/dashboard", {
                state: {
                    savedPaper: {
                        title: title,
                        questions: data,
                        allTopics: allTopics,
                    },
                },
            });
        } catch (error) {
            toast.error(error instanceof Error ? `Error: ${error.message}` : "Error in saving paper");
        }
    };

    /**
     * Initialize page data from navigation state
     * - Transforms question data by adding UUIDs for unique row identification
     * - Sets initial title from parsed PDF
     * - Sets available topics for topic selection
     * - Sets PDF file for viewer if available
     *
     * This effect runs only when response changes, handling the initial data setup
     * from the PDF parsing results passed through react-router navigation state.
     */
    useEffect(() => {
        if (response) {
            const dataWithUUIDs = response.questions.map((item: DataItem) => ({
                ...item,
                uuid: uuidv4(),
            }));
            setData(dataWithUUIDs);
            setTitle(response.title);
            setAllTopics(response.all_topics);
        }
        if (file) {
            setPDFFile(file);
        }
    }, [response, file]);

    return (
        <Box
            display={"flex"}
            alignItems={"center"}
            flexDirection={"column"}
            sx={{ width: { lg: "90%", xl: "78%" } }}
            mx={"auto"}
        >
            <PdfViewer pdffile={pdffile} showPDF={showPDF} setShowPDF={setShowPDF} />

            <Box
                display={"flex"}
                justifyContent={"space-between"}
                mt={"5rem"} // margin to accomodate fixed navbar
                pt={"2.5rem"}
                position={"fixed"}
                sx={{
                    width: { lg: "91%", xl: "79%" },
                    height: { xs: "10%", lg: "12%" },
                    backgroundColor: "white",
                    zIndex: 2,
                }}
            >
                <TitleSection
                    title={title}
                    isEditingTitle={isEditingTitle}
                    setisEditingTitle={setisEditingTitle}
                    handlers={handlers}
                />
                {!showPDF && <Button onClick={() => setShowPDF(!showPDF)}>Open PDF</Button>}
                <Box width={"13rem"} padding={"1rem"} borderRadius={"0.5rem"} sx={{ background: "rgb(222, 242, 255)" }}>
                    <Typography textAlign={"start"} sx={{ fontSize: { xs: "0.8rem", xl: "1rem" } }}>
                        Please Check Through The Parsed Paper Before Proceeding.
                    </Typography>
                </Box>
            </Box>

            {/* This is the table of questions and its details */}
            <ContentTable data={data} handlers={handlers} allTopics={allTopics} />

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
