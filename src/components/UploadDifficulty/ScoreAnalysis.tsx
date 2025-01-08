import { useEffect, useState } from "react";
import { DataItemWithUUID } from "../../types/types";
import Api, { ApiResponse } from "../../api/Api";
import BoxAndPointerDiagram, { calculateStatistics } from "../BoxAndPointerDiagram";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";

const ScoreAnalysis: React.FC<{ paper: string }> = ({ paper }) => {
    const [questions, setQuestions] = useState<DataItemWithUUID[]>([]);
    const [scoreData, setScoreData] = useState<number[][]>([]);
    const [suggestedDifficulties, setSuggestedDifficulties] = useState<number[]>([]);

    /**
     * Returns the mode of the data. In the case where there is more
     * than 1 mode, get the average of that.
     * @param data The data to be processed for mode average
     * @returns The average mode rounded down.
     */
    const getModeAverage = (data: number[]) => {
        const result = calculateStatistics(data);
        const modes = result!.mode;
        return Math.round(modes.reduce((acc, num) => acc + num, 0) / modes.length);
    }

    const handleChangeDifficulty = (index: number, value: number) => {
        setSuggestedDifficulties((prevState) =>
            prevState.map((difficulty, i) => (i === index ? value : difficulty))
        );
    };

    const handleSaveDifficulty = () => {
        // TODO: to be implemented
        alert("Saved!");
    };

    useEffect(() => {
        Api.getPaper(paper).then((result: ApiResponse) => {
            setQuestions(result.data?.questionData);
        });
        Api.getScores(paper).then((result: ApiResponse) => {
            setScoreData(result.data?.scoreData);
            setSuggestedDifficulties(result.data?.scoreData.map((data: number[]) => getModeAverage(data)))
        });
    }, [paper])

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Original Difficulty</TableCell>
                            <TableCell>Suggested Difficulty</TableCell>
                            <TableCell>Statistics</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((question, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{question.description}</TableCell>
                                <TableCell>{question.difficulty}</TableCell>
                                {/* <TableCell>{getModeAverage(scoreData[index])}</TableCell> */}
                                <TableCell>
                                    <TextField
                                        type="number"
                                        value={suggestedDifficulties[index]}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleChangeDifficulty(index, Math.min(10, Math.max(1, e.target.valueAsNumber)))
                                        }
                                        InputProps={{
                                            inputProps: {
                                                min: 1,
                                                max: 10,
                                                step: 1,
                                            },
                                        }}
                                        variant="outlined"
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <BoxAndPointerDiagram data={scoreData[index]} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display={"flex"} padding={3}>
                <Button variant="contained" onClick={handleSaveDifficulty} sx={{ ml: 'auto' }}>Save</Button>
            </Box>
        </Box>
    );
};

export default ScoreAnalysis;