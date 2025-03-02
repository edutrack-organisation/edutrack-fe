import { Alert, Box, Button, Chip, CircularProgress, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography } from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";
import { useEffect, useState } from "react";
import { COLORS } from "../../constants/constants";
import type { PaperItem, QuestionItem } from "../../types/types";
import ScoreAnalysis from "./ScoreAnalysis";
import Api from "../../api/Api";
import { csvFileToNumberArray, csvFileToNumberMatrix, transposeMatrix } from "../../utility/utility";

interface PaperInspectorProps {
    paper: PaperItem;
};

const PaperInspector: React.FC<PaperInspectorProps> = ({ paper }) => {
    /*======================*
     * Handles paper change *
     *======================*/
    const [hasScores, setHasScores] = useState<boolean>(false); // Enables the View Scores tab if scores has been uploaded before
    const handlePaperChange = () => {
        setHasScores(false); // Disable View Scores Tab by default
        Api.getIsPaperScoresAvailable(paper.paperId).then((response) => {
            if (response.data) {
                setHasScores(response.data);
            }
        });
        setTabValue(0); // Set to default tab // Note: Sets the initial rendering tab here to prevent double rendering
    };

    useEffect(() => {
        handlePaperChange();
    }, [paper]);

    /*====================*
     * Handles tab change *
     *====================*/
    /**
     * Tab values
     * 0: View Questions
     * 1: View Scores
     * 2: Upload Scores
     * 3: Upload Difficulty
     */
    const [tabValue, setTabValue] = useState<number>(); // Sets the current inspector mode to render the corresponding UI and controls

    useEffect(() => {
        if (tabValue !== undefined) { // Prevents double rendering on init
            if (tabValue === 0) { // View Question Tab
                // Clear old data
                setPaperQuestions(undefined);
                setIsEditing(false);
                // Fetch new data
                Api.getPaperQuestions(paper.paperId).then((response) => {
                    setPaperQuestions(response.data);
                });
            } else if (tabValue === 1) { // View Scores Tab
                // Clear old data
                // Fetch new data
            } else if (tabValue === 2) { // Upload Scores Tab
                // Clear old data
                setCsvFile(undefined);
                setErrorMessage(undefined);
                setIsSumbitSuccessful(false);
                // Fetch new data
            } else if (tabValue === 3) { // Upload Difficulty Tab
                // Clear old data
                setCsvFile(undefined);
                setErrorMessage(undefined);
                setIsSumbitSuccessful(false);
                // Fetch new data
            }
        }
    }, [tabValue])

    /*====================*
     * View Questions Tab *
     *====================*/
    const [paperQuestions, setPaperQuestions] = useState<QuestionItem[]>();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSavingPaper, setIsSavingPaper] = useState<boolean>(false);

    const handleSave = () => {
        // Uploads updated paperQuestions to backend
        setIsSavingPaper(true);
        Api.updatePaper({ ...paper, questions: paperQuestions }).then((response) => {
            if (response.success == true) {
                alert("Paper saved!"); // TODO: Use toast
                setIsEditing(false);
            } else {
                // TODO: Use toast when encountering upload error
                alert("Error");
            }
        }).finally(() => {
            setIsSavingPaper(false);
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleDescriptionChange = (questionIndex: number, newDescription: string) => {
        setPaperQuestions((prevQuestions) =>
            prevQuestions!.map((question, i) => i === questionIndex ? { ...question, description: newDescription } : question)
        );
    };

    const handleTopicsChange = (questionIndex: number, newTopics: string[]) => {
        setPaperQuestions((prevQuestions) =>
            prevQuestions!.map((question, i) => i === questionIndex ? { ...question, topics: newTopics } : question)
        );
    };

    const handleMarksChange = (questionIndex: number, newMarks: number) => {
        setPaperQuestions((prevQuestions) =>
            prevQuestions!.map((question, i) => i === questionIndex ? { ...question, marks: newMarks } : question)
        );
    };

    const handleDifficultyChange = (questionIndex: number, newDifficulty: number) => {
        setPaperQuestions((prevQuestions) =>
            prevQuestions!.map((question, i) => i === questionIndex ? { ...question, difficulty: newDifficulty } : question)
        );
    };

    const handleQuestionDelete = (questionIndex: number) => {
        setPaperQuestions((prevQuestions) =>
            prevQuestions!.filter((_, index) => index !== questionIndex)
        );
    };

    /*=================*
     * View Scores Tab *
     *=================*/
    // Nothing here

    /*===================*
     * Upload Scores Tab *
     *===================*/
    const [csvFile, setCsvFile] = useState<File>();                                 // Shared with Upload Difficulty
    const [errorMessage, setErrorMessage] = useState<string>();                     // Shared with Upload Difficulty
    const [isSubmitSuccessful, setIsSumbitSuccessful] = useState<boolean>(false);   // Shared with Upload Difficulty

    const handleCsvFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {   // Shared with Upload Difficulty
        if (event.target.files && event.target.files.length > 0) {
            setCsvFile(event.target.files[0]);
        }
    };

    const handleStudentScoresUpload = async () => {
        // Placeholder validity check function
        const isValid = await validateStudentScoresCsv(csvFile!);

        if (!isValid) {
            setErrorMessage("The CSV file might be incorrect. Please check its contents.");
        } else {
            const newStudentScores: number[][] = transposeMatrix(await csvFileToNumberMatrix(csvFile!));
            await Api.updateStudentScores(paper.paperId, newStudentScores).then((response) => {
                if (response.success) {
                    setIsSumbitSuccessful(true);
                    setHasScores(true);
                }
            });
        }
    };

    const validateStudentScoresCsv = async (file: File): Promise<boolean> => {
        try {
            // Read the file content as text
            const text = await file.text();
            
            // Split the text into rows by newlines (and filter out empty rows)
            const rows = text.split("\n").filter(row => row.trim() !== "");
    
            // Ensure there's at least one row (for parsing)
            if (rows.length === 0) return false;
    
            // Split the first row by commas to determine the number of columns
            const columns = rows[0].split(",").map(col => col.trim());
            
            // Get the number of questions in the selected paper
            const numQuestions = (await Api.getPaperQuestions(paper.paperId))?.data?.length ?? -1;

            // Check if the number of rows equals the number of questions
            return columns.length === numQuestions;
        } catch (error) {
            console.error("Error reading or processing the CSV file:", error);
            return false;
        }
    };

    /*=======================*
     * Upload Difficulty Tab *
     *=======================*/
    const handleDifficultyUpload = async () => {
        // Placeholder validity check function
        const isValid = await validateDifficultyCsv(csvFile!);

        if (!isValid) {
            setErrorMessage("The CSV file might be incorrect. Please check its contents.");
        } else {
            const new_difficulties: number[] = await csvFileToNumberArray(csvFile!);
            await Api.updatePaperQuestionDifficulties(paper.paperId, new_difficulties).then((response) => {
                if (response.success) {
                    setIsSumbitSuccessful(true);
                }
            });
        }
    };

    const validateDifficultyCsv = async (file: File): Promise<boolean> => {
        try {
            // Read the file content as text
            const text = await file.text();
            
            // Split the text into rows (and filter out empty rows)
            const rows = text.split("\n").filter(row => row.trim() !== "");
    
            // Ensure there's at least one row (for parsing)
            if (rows.length === 0) return false;
    
            // Split the first row by commas to determine the number of columns
            const columns = rows[0].split(",").map(col => col.trim());
            
            // Get the number of questions in the selected paper
            const numQuestions = (await Api.getPaperQuestions(paper.paperId))?.data?.length ?? -1;
    
            // Check if the number of columns equals the number of questions
            return columns.length === numQuestions;
        } catch (error) {
            console.error("Error reading or processing the CSV file:", error);
            return false;
        }
    };
    

    return (
        <Box sx={containerStyle}>
            {/* Paper title */}
            <Typography fontWeight={"bold"} fontSize={"1.8rem"} padding={2}>
                {paper.paperTitle}
            </Typography>

            {/* Tabs */}
            {tabValue !== undefined && ( // Prevents error when tabValue was initially undefined
                <Tabs value={tabValue} onChange={(_, newTabValue) => setTabValue(newTabValue)}>
                    <Tab label="View Questions" />
                    <Tab label="View Scores" disabled={!hasScores} />
                    <Tab label="Upload Scores" />
                    <Tab label="Upload Difficulty" />
                </Tabs>
            )}

            {/* View Questions Tab */}
            {tabValue === 0 && (
                paperQuestions
                ? (
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
                        {/* Save and edit button */}
                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", marginRight: 3 }} >
                            {isEditing
                                ? isSavingPaper ? <CircularProgress /> : <Button variant={"contained"} onClick={handleSave}>Save</Button>
                                : <Button variant={"contained"} onClick={handleEdit}>Edit</Button>}
                        </Box>
                        <Box  sx={{ margin: 3 }}>
                            {/* Questions */}
                            <TableContainer component={Paper}>
                                {/* Table headers */}
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Question Number</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Topics</TableCell>
                                            <TableCell>Marks</TableCell>
                                            <TableCell>Difficulty</TableCell>
                                            {isEditing && <TableCell />}
                                        </TableRow>
                                    </TableHead>

                                    {/* Table body */}
                                    <TableBody>
                                        {isEditing ? (
                                            paperQuestions.map((question, index) => (
                                                <TableRow key={`row${index}`}>
                                                    <TableCell>{question.questionNumber}</TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            multiline
                                                            value={question.description}
                                                            onChange={(event) => handleDescriptionChange(index, event.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <MuiChipsInput
                                                            value={question.topics}
                                                            onChange={(newChips) => handleTopicsChange(index, newChips)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            defaultValue={question.marks}
                                                            onChange={(event) => handleMarksChange(index, parseInt(event.target.value))}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            defaultValue={question.difficulty}
                                                            onChange={(event) => handleDifficultyChange(index, parseInt(event.target.value))}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="contained" onClick={() => handleQuestionDelete(index)} sx={{ marginRight: 3 }}>
                                                            Delete
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            paperQuestions.map((question, index) => (
                                                <TableRow key={`row${index}`}>
                                                    <TableCell>{question.questionNumber}</TableCell>
                                                    <TableCell>{question.description}</TableCell>
                                                    <TableCell>{question.topics.map((topic) => <Chip key={`${topic}`} label={topic} sx={{ margin: 1 }} />)}</TableCell>
                                                    <TableCell>{question.marks}</TableCell>
                                                    <TableCell>{question.difficulty}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                ) : <CircularProgress />
            )}

            {/* View Scores Tab */}
            {tabValue === 1 && (
                <ScoreAnalysis paperId={paper.paperId} />
            )}

            {/* Upload Scores Tab */}
            {tabValue === 2 && (
                isSubmitSuccessful ? (
                    <Typography variant="h4" marginTop={"2rem"} gutterBottom>
                        Upload Successful!
                    </Typography>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Typography variant="h4" marginTop={"2rem"} gutterBottom>
                            Upload Student Scores
                        </Typography>

                        {/* Upload CSV button */}
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                "&:hover": { backgroundColor: COLORS.HIGHLIGHT },
                            }}
                        >
                            Upload CSV
                            <input type="file" accept=".csv" hidden onChange={handleCsvFileSelect} />
                        </Button>

                        {/* Display name of uploaded CSV file */}
                        {csvFile && (
                            <Typography variant="body2" color="textSecondary">
                                Selected File: {csvFile.name}
                            </Typography>
                        )}

                        {/* Submit button */}
                        <Button
                            variant="contained"
                            color="success"
                            sx={{ marginTop: "1rem" }}
                            onClick={handleStudentScoresUpload}
                            disabled={!csvFile}
                        >
                            Submit
                        </Button>

                        {errorMessage && (
                            <Alert severity="warning" sx={{ marginTop: "1rem" }}>
                                {errorMessage}
                            </Alert>
                        )}
                    </Box>
                )
            )}

            {/* Upload Difficulty Tab */}
            {tabValue === 3 && (
                isSubmitSuccessful ? (
                    <Typography variant="h4" marginTop={"2rem"} gutterBottom>
                        Upload Successful!
                    </Typography>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Typography variant="h4" marginTop={"2rem"} gutterBottom>
                            Upload Difficulty
                        </Typography>

                        {/* Upload CSV button */}
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                "&:hover": { backgroundColor: COLORS.HIGHLIGHT },
                            }}
                        >
                            Upload CSV
                            <input type="file" accept=".csv" hidden onChange={handleCsvFileSelect} />
                        </Button>

                        {/* Display name of uploaded CSV file */}
                        {csvFile && (
                            <Typography variant="body2" color="textSecondary">
                                Selected File: {csvFile.name}
                            </Typography>
                        )}

                        {/* Submit button */}
                        <Button
                            variant="contained"
                            color="success"
                            sx={{ marginTop: "1rem" }}
                            onClick={handleDifficultyUpload}
                            disabled={!csvFile}
                        >
                            Submit
                        </Button>

                        {errorMessage && (
                            <Alert severity="warning" sx={{ marginTop: "1rem" }}>
                                {errorMessage}
                            </Alert>
                        )}
                    </Box>
                )
            )}
        </Box>
    );
};

const containerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: COLORS.WHITE,
};

export default PaperInspector;