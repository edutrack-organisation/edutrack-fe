import React, { useEffect, useState } from 'react';
import { Box, Chip, CircularProgress, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, useMediaQuery, useTheme, Slider, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { COLORS } from "../constants/constants";
import SecondaryNavBar from '../components/SecondaryNavBar';
import { PaperItem, TopicStats } from '../types/types';
import Api from '../api/Api';
import { useParams } from 'react-router-dom';

const KnowledgeGraphPage = () => {
    // UI values
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Filter slider values
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<[number, number]>([0, 100]);

    // Store fetched papers for reuse during filtering
    const [papers, setPapers] = useState<PaperItem[]>([]);

    // Statistics table values
    const [data, setData] = useState<TopicStats>({});
    const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
    const courseId: number = Number(decodeURIComponent(useParams().courseId!));
    const theme = useTheme();
    const isWideScreen = useMediaQuery(theme.breakpoints.up('lg'));

    useEffect(() => {
        Api.getCoursePapers(courseId).then((response) => {
            const papers: PaperItem[] = response.data;
            setPapers(papers);
            const topicStats = calculateInitialTopicStats(papers);
            setData(topicStats);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    /*===========================*
     * Slider handling functions *
     *===========================*/

    const handleValueChange = (_event: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setValue(newValue as [number, number]);
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOk = () => {
        const filteredStats = calculateFilteredTopicStats(papers, value[0], value[1]);
        setData(filteredStats);
        handleClose();
    };

    /*============================*
     * Statistics table functions *
     *============================*/

    const toggleExpand = (topic: string) => {
        if (expandedTopics.includes(topic)) {
            setExpandedTopics(expandedTopics.filter(t => t !== topic));
        } else {
            setExpandedTopics([...expandedTopics, topic]);
        }
    };

    /*===========================*
     * Data processing functions *
     *===========================*/

    /**
     * Parses a topic string into its main and subtopic.
     * If no colon is present, both main and subtopic are the same.
     */
    const parseTopic = (topicStr: string): { main: string; sub: string } => {
        const parts = topicStr.split(":").map((s) => s.trim());
        if (parts.length >= 2) {
            return { main: parts[0], sub: parts.slice(1).join(":") };
        }
        return { main: topicStr, sub: topicStr };
    };

    /**
     * Computes the indices of students that fall within a specific percentile range for a given paper.
     * 
     * @param paper - The paper containing student scores.
     * @param lowerPercentile - The lower bound of the percentile range (e.g., 25).
     * @param upperPercentile - The upper bound of the percentile range (e.g., 50).
     * @returns An array of indices of students that fall within the range.
     */
    const getFilteredIndicesForPaper = (paper: PaperItem, lowerPercentile: number, upperPercentile: number): number[] => {
        if (!paper.studentScores || !paper.questions) return [];

        const numStudents = paper.studentScores.length;
        if (numStudents === 0) return [];

        const totalMaxMarks = paper.questions.reduce((sum, q) => sum + q.marks, 0);

        // Compute overall grade for each student.
        const studentGrades: { index: number; grade: number }[] = [];
        for (let i = 0; i < numStudents; i++) {
            const scores = paper.studentScores[i] || [];
            const totalScore = paper.questions.reduce((sum, q, idx) => {
                const score = idx < scores.length ? scores[idx] : 0;
                return sum + score;
            }, 0);
            const grade = totalMaxMarks > 0 ? (totalScore / totalMaxMarks) * 100 : 0;
            studentGrades.push({ index: i, grade });
        }

        // Sort students by grade descending.
        studentGrades.sort((a, b) => b.grade - a.grade);

        // Determine the index range for filtering.
        const lowerIndex = Math.floor((lowerPercentile / 100) * numStudents);
        const upperIndex = Math.floor((upperPercentile / 100) * numStudents);

        return studentGrades.slice(lowerIndex, upperIndex).map((item) => item.index);
    };

    /**
     * Calculates the topic statistics across all papers using the provided filtered mapping.
     * 
     * @param papers - Array of PaperItem objects.
     * @param filteredMapping - An object mapping paperId to an array of filtered student indices.
     *                          For papers not present in the mapping, assume all students are included.
     * @returns TopicStats object that aggregates the data.
     */
    const calculateTopicStats = (papers: PaperItem[], filteredMapping: { [paperId: number]: number[] }): TopicStats => {
        // Intermediate structure:
        // stats[mainTopic][subtopic] = { sumWeighted: number, totalDifficulty: number, countQuestions: number }
        const stats: {
            [main: string]: {
                [sub: string]: { sumWeighted: number; totalDifficulty: number; countQuestions: number };
            };
        } = {};

        papers.forEach((paper) => {
            // Ensure questions and studentScores exist.
            if (!paper.questions || !paper.studentScores) return;
            // Get filtered student indices for this paper.
            // If not provided, assume all students.
            const filteredIndices = filteredMapping[paper.paperId] ||
                paper.studentScores.map((_row, idx) => idx);

            // For each question in the paper:
            paper.questions.forEach((question, qIdx) => {
                // Calculate the average performance for this question using filtered students.
                // Performance = score / max marks (if a student's score is missing, treat it as 0).
                let sumPerformance = 0;
                filteredIndices.forEach((stuIdx) => {
                    const scoresRow = paper.studentScores![stuIdx] || [];
                    const score = qIdx < scoresRow.length ? scoresRow[qIdx] : 0;
                    sumPerformance += question.marks > 0 ? score / question.marks : 0;
                });
                const numFiltered = filteredIndices.length;
                const avgPerformance = numFiltered > 0 ? sumPerformance / numFiltered : 0;

                // For each topic string of the question, update stats.
                question.topics.forEach((topicStr) => {
                    const { main, sub } = parseTopic(topicStr);

                    // Initialize structures if not present.
                    if (!stats[main]) {
                        stats[main] = {};
                    }
                    if (!stats[main][sub]) {
                        stats[main][sub] = { sumWeighted: 0, totalDifficulty: 0, countQuestions: 0 };
                    }

                    // Add weighted contribution: weight = question difficulty.
                    stats[main][sub].sumWeighted += avgPerformance * question.difficulty;
                    stats[main][sub].totalDifficulty += question.difficulty;
                    stats[main][sub].countQuestions += 1;
                });
            });
        });

        // Build the final TopicStats output.
        const topicStats: TopicStats = {};
        Object.keys(stats).forEach((mainTopic) => {
            topicStats[mainTopic] = { average: 0, subtopics: {} };
            const subtopics = stats[mainTopic];
            let subtopicSum = 0;
            let subtopicCount = 0;
            Object.keys(subtopics).forEach((subTopic) => {
                const { sumWeighted, totalDifficulty } = subtopics[subTopic];
                // Calculate percentage for this subtopic.
                const percentage = totalDifficulty > 0 ? (sumWeighted / totalDifficulty) * 100 : 0;
                topicStats[mainTopic].subtopics[subTopic] = percentage;
                subtopicSum += percentage;
                subtopicCount++;
            });
            // The main topic's average is the average of its subtopics.
            topicStats[mainTopic].average = subtopicCount > 0 ? subtopicSum / subtopicCount : 0;
        });

        return topicStats;
    };

    /**
     * Calculates the initial topic statistics across all papers using all students.
     *
     * @param papers - Array of PaperItem objects.
     * @returns TopicStats computed with all student data.
     */
    const calculateInitialTopicStats = (papers: PaperItem[]): TopicStats => {
        // For initial calculation, include all students in each paper.
        const allStudentsMapping: { [paperId: number]: number[] } = {};
        papers.forEach((paper) => {
            if (paper.studentScores) {
                allStudentsMapping[paper.paperId] = paper.studentScores.map((_row, idx) => idx);
            }
        });
        return calculateTopicStats(papers, allStudentsMapping);
    };

    /**
     * Computes topic statistics for a given percentile range across all papers.
     *
     * @param papers - Array of PaperItem objects.
     * @param lowerPercentile - The lower bound of the percentile range (e.g., 25).
     * @param upperPercentile - The upper bound of the percentile range (e.g., 50).
     * @returns TopicStats computed based on the selected percentile range.
     */
    const calculateFilteredTopicStats = (papers: PaperItem[], lowerPercentile: number, upperPercentile: number): TopicStats => {
        const filteredMapping: { [paperId: number]: number[] } = {};

        papers.forEach((paper) => {
            filteredMapping[paper.paperId] = getFilteredIndicesForPaper(paper, lowerPercentile, upperPercentile);
        });

        return calculateTopicStats(papers, filteredMapping);
    };

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <SecondaryNavBar />
            <Box sx={containerStyle}>
                {!isLoading && Object.keys(data).length > 0 ? (
                    <>
                        <Button sx={{ marginBottom: 3 }} variant="outlined" onClick={handleOpen}>
                            Filter
                        </Button>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Student Percentile Range</DialogTitle>
                            <DialogContent sx={{ minHeight: 100, alignContent: "flex-end" }}>
                                <Slider
                                    orientation="horizontal"
                                    value={value}
                                    onChange={handleValueChange}
                                    valueLabelDisplay="on"
                                    min={0}
                                    max={100}
                                    marks={[
                                        { value: 0, label: "0%" },
                                        { value: 100, label: "100%" },
                                    ]}
                                    disableSwap
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button onClick={handleOk} variant="contained">
                                    Ok
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <TableContainer component={Paper} sx={{ maxWidth: isWideScreen ? '80%' : '100%' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: '70%' }}>Topic</TableCell>
                                        <TableCell style={{ width: '30%', textAlign: 'right' }}>Statistics</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(data).map(([mainTopic, stats], index) => (
                                        <React.Fragment key={index}>
                                            <TableRow>
                                                <TableCell style={{ width: '70%', alignItems: 'center' }}>
                                                    <Chip label={mainTopic} sx={{ margin: 1, fontWeight: 'bold', fontSize: '1.2rem' }} />
                                                    {Object.keys(stats.subtopics).length > 0 && (
                                                        <IconButton onClick={() => toggleExpand(mainTopic)}>
                                                            {expandedTopics.includes(mainTopic) ? <ExpandLess /> : <ExpandMore />}
                                                        </IconButton>
                                                    )}
                                                </TableCell>
                                                <TableCell style={{ width: '30%', textAlign: 'right' }}>
                                                    <div style={{ display: 'inline-block', width: '80%', marginRight: '10px' }}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={stats.average}
                                                            sx={{ height: 15, borderRadius: 7, '& .MuiLinearProgress-bar': { backgroundColor: getColor(stats.average) } }}
                                                        />
                                                    </div>
                                                    <span style={{ marginLeft: '5px' }}>{stats.average.toFixed(0)}%</span>
                                                </TableCell>
                                            </TableRow>
                                            {expandedTopics.includes(mainTopic) && Object.entries(stats.subtopics).map(([subTopic, subValue], subIndex) => (
                                                <TableRow key={`${index}-${subIndex}`}>
                                                    <TableCell style={{ width: '70%', paddingLeft: 32 }}>
                                                        <Chip label={subTopic} sx={{ margin: 1, fontSize: '0.8rem' }} />
                                                    </TableCell>
                                                    <TableCell style={{ width: '30%', textAlign: 'right' }}>
                                                        <div style={{ display: 'inline-block', width: '60%', marginRight: '10px' }}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={subValue}
                                                                sx={{ height: 10, borderRadius: 5, '& .MuiLinearProgress-bar': { backgroundColor: getColor(subValue) } }}
                                                            />
                                                        </div>
                                                        <span style={{ marginLeft: '5px' }}>{subValue.toFixed(0)}%</span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                ) : (
                    <CircularProgress />
                )}
            </Box>
        </Box>
    );
};

type TopicValue = {
    topic: string;
    value: number;
};

type TopicData = {
    topic: string;
    value: number;
    subTopics?: TopicValue[];
};

function getColor(value: number) {
    if (value < 25) {
        return 'red';
    } else if (value < 50) {
        return 'rgb(255, 102, 0)';
    } else if (value < 75) {
        return 'rgb(202, 245, 46)';
    } else {
        return 'rgb(0, 204, 0)';
    }
}

const containerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: COLORS.WHITE,
    padding: 3,
};

export default KnowledgeGraphPage;