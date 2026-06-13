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

import { Box, Button, Typography, TextField, Grid } from "@mui/material";
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
import OverviewEditor from "../components/DoneUpload/OverviewEditor";

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
    
const PaperMetadataInputs = ({
  moduleCode,
  setModuleCode,
  moduleName,
  setModuleName,
  academicYear,
  setAcademicYear,
  semester,
  setSemester,
}: any) => {
  return (
    <Grid container spacing={2} mt={1}>
      <Grid item xs={6} md={3}>
        <TextField
          label="Module Code"
          placeholder="e.g. CS2105"
          value={moduleCode}
          onChange={(e) => setModuleCode(e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          label="Module Name"
          placeholder="e.g. Computer Networks"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          label="Academic Year"
          placeholder="e.g. AY23/24"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          label="Semester"
          placeholder="e.g. 1 or 2"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
};

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

  const [moduleCode, setModuleCode] = useState<string>("");
  const [moduleName, setModuleName] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("");
  const [semester, setSemester] = useState<string>("");

  // Debounced functions
  const debouncedSetData = useCallback(
    debounce(
      (updatedData: DataItemWithUUID[]) => setData(updatedData),
      DEBOUNCE_DELAY,
    ),
    [],
  );

  const debouncedSetTitle = useCallback(
    debounce((newTitle: string) => setTitle(newTitle), DEBOUNCE_DELAY),
    [],
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

  const handleLevelChange = (index: number, newLevel: string) => {
    const updatedData = [...data];
    updatedData[index].level = newLevel;
    setData(updatedData);
  };

  const handleTypeChange = (index: number, newType: string) => {
    const updatedData = [...data];
    updatedData[index].type = newType;
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
      level: "Remember",
      type: "MCQ",
    });
    setData(updatedData);
  };

  const handleTitleChange = (newTitle: string) => {
    debouncedSetTitle(newTitle);
    setisEditingTitle(true);
  };

  const handleOverviewChange = (
    questionIndex: number,
    optionKey: string,
    field: "interpretation" | "likely_misunderstanding",
    value: string,
  ) => {
    const updatedData = [...data];
    const question = updatedData[questionIndex];

    if (!question.overview) return;

    question.overview[optionKey] = {
      ...question.overview[optionKey],
      [field]: value,
    };

    debouncedSetData(updatedData);
  };

  const handlers: Handlers = {
    handleTopicsChange,
    handleDescriptionChange,
    handleDifficultyChange,
    handleQuestionDelete,
    handleQuestionAdd,
    handleTitleChange,
    handleMarkChange,
    handleOverviewChange,
    handleLevelChange,
    handleTypeChange,
  };

  const sendParsedToBackend = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const questionsWithNumbers = data.map(({ uuid, ...rest }, index) => ({
        ...rest,
        question_number: index + 1, // Add the sequential number
      }));
      const savedPaper = await parsedPdfApi.saveParsedPDF({
        title,
        questions: questionsWithNumbers,
        module_code: moduleCode,
        module_name: moduleName,
        academic_year: academicYear,
        semester: semester,
      });

      toast.success("Paper saved successfully!");

      navigate("/dashboard", {
        state: {
          paperId: savedPaper.id,
          savedPaper: {
            title: savedPaper.title,
            questions: data,
            allTopics: allTopics,
            // You can also pass the metadata to dashboard if needed
            moduleCode,
            moduleName,
            academicYear,
            semester,
          },
        },
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error in saving paper",
      );
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
      component="form"
      onSubmit={sendParsedToBackend}
      display={"flex"}
      alignItems={"center"}
      flexDirection={"column"}
      sx={{ width: { lg: "90%", xl: "78%" } }}
      mx={"auto"}
    >
      <PdfViewer pdffile={pdffile} showPDF={showPDF} setShowPDF={setShowPDF} />

      {/* ✅ Fixed Header Section - Modified to fit new inputs */}
      <Box
        display={"flex"}
        flexDirection={"column"} // Changed to column to stack title and inputs
        justifyContent={"flex-start"}
        mt={"5rem"}
        pt={"1.5rem"}
        pb={"1rem"}
        px={"2rem"}
        position={"fixed"}
        sx={{
          width: { lg: "91%", xl: "79%" },
          height: "auto", // ✅ Changed to auto to fit content
          minHeight: "15%", // ensure enough space
          backgroundColor: "white",
          zIndex: 2,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.05)", // Optional: adds subtle separation
          borderRadius: "0 0 1rem 1rem",
        }}
      >
        {/* Top Row: Title + Buttons */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          width="100%"
        >
          <Box flex={1}>
            <TitleSection
              title={title}
              isEditingTitle={isEditingTitle}
              setisEditingTitle={setisEditingTitle}
              handlers={handlers}
            />
          </Box>

          <Box display="flex" gap={2} alignItems="center">
            {!showPDF && (
              <Button onClick={() => setShowPDF(!showPDF)} variant="outlined">
                Open PDF
              </Button>
            )}
            <Box
              padding={"0.8rem"}
              borderRadius={"0.5rem"}
              sx={{ background: "rgb(222, 242, 255)", maxWidth: "200px" }}
            >
              <Typography
                textAlign={"start"}
                sx={{ fontSize: { xs: "0.75rem", xl: "0.9rem" } }}
              >
                Please verify parsed content.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ✅ Second Row: Metadata Inputs */}
        <PaperMetadataInputs
          moduleCode={moduleCode}
          setModuleCode={setModuleCode}
          moduleName={moduleName}
          setModuleName={setModuleName}
          academicYear={academicYear}
          setAcademicYear={setAcademicYear}
          semester={semester}
          setSemester={setSemester}
        />
      </Box>

      {/* Spacer to push content below the fixed header (adjusted for new height) */}
      <Box sx={{ height: "14rem" }} />

      <ContentTable data={data} handlers={handlers} allTopics={allTopics} />

      <Button
        type="submit"
        sx={{ alignSelf: "flex-end", margin: "1rem" }}
        variant="contained"
        size="large"
      >
        Continue
      </Button>
    </Box>
  );
};

export default DoneUploadPage;
