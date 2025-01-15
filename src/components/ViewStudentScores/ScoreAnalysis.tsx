import { useEffect, useState } from "react";
import { DataItemWithUUID } from "../../types/types";
import Api, { ApiResponse } from "../../api/Api";
import BoxAndPointerDiagram from "../BoxAndPointerDiagram";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const ScoreAnalysis: React.FC<{ paper: string }> = ({ paper }) => {
    const [questions, setQuestions] = useState<DataItemWithUUID[]>([]);
    const [scoreData, setScoreData] = useState<number[][]>([]);

    useEffect(() => {
        Api.getPaper(paper).then((result: ApiResponse) => {
            setQuestions(result.data?.questionData);
        });
        Api.getScores(paper).then((result: ApiResponse) => {
            setScoreData(result.data?.scoreData);
        });
    }, [paper])

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Statistics</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {questions.map((question, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{question.description}</TableCell>
                            <TableCell>
                                <BoxAndPointerDiagram data={scoreData[index]} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ScoreAnalysis;