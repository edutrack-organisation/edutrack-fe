import { useEffect, useState } from "react";
import { QuestionItem } from "../../types/types";
import Api, { ApiResponse } from "../../api/Api";
import BoxAndPointerDiagram from "../BoxAndPointerDiagram";
import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ApiMock from "../../api/ApiMock";

const ScoreAnalysis: React.FC<{ paperId: number }> = ({ paperId }) => {
    const [questions, setQuestions] = useState<QuestionItem[]>();
    const [studentScores, setStudentScores] = useState<number[][]>();

    useEffect(() => {
        ApiMock.getPaperQuestions(paperId).then((result: ApiResponse) => {
            setQuestions(result.data);
        });
        ApiMock.getPaperStudentScores(paperId).then((result: ApiResponse) => {
            setStudentScores(result.data);
        });
    }, [paperId])

    return (
        (questions && studentScores) ? (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Question Number</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Marks</TableCell>
                            <TableCell>Statistics</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((question, index) => (
                            <TableRow key={index}>
                                <TableCell>{question.questionNumber}</TableCell>
                                <TableCell>{question.description}</TableCell>
                                <TableCell>{question.marks}</TableCell>
                                <TableCell>
                                    <BoxAndPointerDiagram data={studentScores[index]} max_value={question.marks} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        ) : (
            <CircularProgress />
        )
    );
};

export default ScoreAnalysis;