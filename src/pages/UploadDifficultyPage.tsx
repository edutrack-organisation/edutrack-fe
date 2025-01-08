import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Select, MenuItem, FormControl, InputLabel, Alert, SelectChangeEvent, Divider, CircularProgress } from "@mui/material";
import { theme } from "../theme";
import Api, { ApiResponse } from "../api/Api";
import ScoreAnalysis from "../components/UploadDifficulty/ScoreAnalysis";

const UploadDifficultyPage = () => {
    const [paperList, setPaperList] = useState<string[] | null>(null);
    const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [isSubmitSuccessful, setIsSumbitSuccessful] = useState<boolean>(false); // TODO: remove this and place in side ViewStudentScore

    useEffect(() => {
        setTimeout(() => { // TODO: remove settimeout
            Api.getPdfTitleList().then((result: ApiResponse) => {
                setPaperList(result.data);
            });
        }, 1000);
        
    }, []);

    const handlePaperChange = (event: SelectChangeEvent<string>) => {
        setIsSumbitSuccessful(false); // TODO: remove

        setSelectedPaper(event.target.value);
        setErrorMessage(null); // Clear error message on paper selection
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setCsvFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        // Placeholder validity check function
        const isValid = await validateCsv(csvFile!, selectedPaper!);

        if (!isValid) {
            setErrorMessage("The CSV file might be incorrect. Please check its contents.");
        } else {
            // navigate("/"); // Navigate to success page
            setIsSumbitSuccessful(true); // TODO: move this into ViewStudentScore
        }
    };

    const validateCsv = async (file: File, title: string): Promise<boolean> => {
        try {
            // Read the file content as text
            const text = await file.text();
            
            // Split the text into rows by newlines (and filter out empty rows)
            const rows = text.split("\n").filter(row => row.trim() !== "");
            
            // Get the number of questions in the selected paper
            const numQuestions = (await Api.getPaper(title)).data?.questionData?.length ?? -1;

            // Check if the number of rows equals the number of questions
            return rows.length === numQuestions;
        } catch (error) {
            console.error("Error reading or processing the CSV file:", error);
            return false;
        }
    };

    return (
        <Box display={"flex"} height={"calc(100vh - 5rem)"} justifyContent={"center"}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "2rem",
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Upload Difficulty
                </Typography>

                {paperList != null ? (
                    <>
                        {/* Dropdown for paper selection */}
                        <FormControl sx={{ width: "300px", marginBottom: "1rem" }}>
                            <InputLabel>Select Paper</InputLabel>
                            <Select value={selectedPaper || ""} onChange={handlePaperChange}>
                                {paperList.map((item: string, index: number) => 
                                    <MenuItem value={item} key={`paper${index}`}>{item}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        
                        {/* Upload CSV button */}
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                marginBottom: "1rem",
                                backgroundColor: theme.colors.highlight1,
                                "&:hover": { backgroundColor: theme.colors.highlight2 },
                            }}
                            disabled={!selectedPaper}
                        >
                            Upload CSV
                            <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
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
                            onClick={handleUpload}
                            disabled={!csvFile || !selectedPaper}
                        >
                            Submit
                        </Button>
                    </>
                ) : (
                    <CircularProgress sx={{ marginBottom: "1rem" }} />
                )}

                {errorMessage && (
                    <Alert severity="warning" sx={{ marginTop: "1rem" }}>
                        {errorMessage}
                    </Alert>
                )}
                
            </Box>

            {/* Score analysis */}
            {isSubmitSuccessful &&
                <>
                     {/* Vertical Divider */}
                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                            backgroundColor: theme.colors.highlight1,
                            width: "0.25rem",
                            borderRadius: 3,
                            margin: 1,
                        }}
                    />
                    <ScoreAnalysis paper={selectedPaper!}/>
                </>
            }
        </Box>
    );
};

export default UploadDifficultyPage;
