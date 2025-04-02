
import React, { useEffect, useState } from 'react';
import { Box, Chip, CircularProgress, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, useMediaQuery, useTheme, Slider, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { COLORS } from "../constants/constants";
import SecondaryNavBar from '../components/SecondaryNavBar';
import { PaperItem, QuestionItem } from '../types/types';
import Api from '../api/Api';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const KnowledgeGraphPage = () => {
    // UI and other values
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isApiError, setIsApiError] = useState<boolean>(false);
    const courseId: number = Number(decodeURIComponent(useParams().courseId!));
    const theme = useTheme();
    const isWideScreen = useMediaQuery(theme.breakpoints.up('lg'));

    // Filter slider values
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<[number, number]>([0, 100]);

    // Statistics table values
    const [studentContributions, setStudentContributions] = useState<StudentContribution[]>([]);
    const [data, setData] = useState<TopicData[]>([]);
    const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

    useEffect(() => {
        Api.getCoursePapers(courseId).then((response) => {
            const papers: PaperItem[] = response.data;
            const { studentContributions, topicData } = processData(papers);
            setStudentContributions(studentContributions);
            setData(topicData);
            console.log(studentContributions)
        }).catch((error) => {
            toast.error(`Failed to retrieve statistics. ${error.message}`);
            setIsApiError(true);
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
        const filteredData = calculateFilteredData(studentContributions, data, value[0], value[1]);
        setData(filteredData);
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
     * Process papers and calculate student contributions and topic data.
     */
    const processData = (papers: PaperItem[]): { studentContributions: StudentContribution[]; topicData: TopicData[] } => {
        // Determine the maximum number of students across all papers.
        let maxStudents = 0;
        for (const paper of papers) {
            if (paper.studentScores) {
                paper.studentScores.forEach((scoreRow) => {
                    maxStudents = Math.max(maxStudents, scoreRow.length);
                });
            }
        }

        // Initialize student contributions
        const studentContributions: StudentContribution[] = [];
        for (let i = 0; i < maxStudents; i++) {
            studentContributions.push({ grade: 0, topicContributions: {} });
        }

        // Map to store total difficulty per subtopic
        const topicTotalDifficulty: Record<string, number> = {};
        // Map to store the main topic for each subtopic (for topicData grouping)
        const subtopicToMain: Record<string, string> = {};

        // Process each paper
        for (const paper of papers) {
            if (!paper.studentScores) {
                continue; // Ignore papers with no scores uploaded
            }

            // For each question in the paper
            paper.questions.forEach((question: QuestionItem, qIndex: number) => {
                // Process topics for this question
                question.topics.forEach((topicStr: string) => {
                    const { main, sub } = parseTopic(topicStr);
                    // Record the mapping for later grouping
                    subtopicToMain[sub] = main;
                    // Increase the total difficulty for this subtopic
                    topicTotalDifficulty[sub] = (topicTotalDifficulty[sub] || 0) + question.difficulty;
                });

                // For each student, using the student scores for this question row.
                const questionScores = paper.studentScores[qIndex] || [];
                for (let studentIndex = 0; studentIndex < maxStudents; studentIndex++) {
                    const score = questionScores[studentIndex] ?? 0;
                    studentContributions[studentIndex].grade += score;

                    const weightedScore = (score / question.marks) * question.difficulty;
                    // Accumulate to each topic contribution for this question
                    question.topics.forEach((topicStr: string) => {
                        const { sub } = parseTopic(topicStr);
                        studentContributions[studentIndex].topicContributions[sub] =
                            (studentContributions[studentIndex].topicContributions[sub] || 0) + weightedScore;
                    });
                }
            });
        }

        // Normalize each student's topic contributions (scale to 0-100 per subtopic)
        studentContributions.forEach((student) => {
            for (const subtopic in student.topicContributions) {
                const totalDiff = topicTotalDifficulty[subtopic] || 1;
                student.topicContributions[subtopic] = (student.topicContributions[subtopic] / totalDiff) * 100;
            }
        });

        // Sort students by overall grade in ascending order
        studentContributions.sort((a, b) => a.grade - b.grade);

        // Compute average contribution per subtopic across all students
        const subtopicAverages: Record<string, number> = {};
        for (const sub in topicTotalDifficulty) {
            let sum = 0;
            for (const student of studentContributions) {
                sum += student.topicContributions[sub] || 0;
            }
            subtopicAverages[sub] = sum / studentContributions.length;
        }

        // Group subtopics by their main topic
        const mainTopicMap: Record<string, { subtopics: { topic: string; value: number }[] }> = {};
        for (const sub in subtopicAverages) {
            const main = subtopicToMain[sub] || sub;
            if (!mainTopicMap[main]) {
                mainTopicMap[main] = { subtopics: [] };
            }
            mainTopicMap[main].subtopics.push({ topic: sub, value: subtopicAverages[sub] });
        }

        // Build the topic data list.
        // If a main topic has only one subtopic that is the same as the main topic, treat it as standalone.
        const topicData: TopicData[] = [];
        for (const main in mainTopicMap) {
            const group = mainTopicMap[main];
            if (group.subtopics.length === 1 && group.subtopics[0].topic === main) {
                topicData.push({ topic: main, value: group.subtopics[0].value });
            } else {
                const avg =
                    group.subtopics.reduce((acc, sub) => acc + sub.value, 0) / group.subtopics.length;
                topicData.push({
                    topic: main,
                    value: avg,
                    subtopics: group.subtopics.map((s) => ({ topic: s.topic, value: s.value })),
                });
            }
        }

        // Sort topicData by topic name and also sort subtopics if present.
        topicData.sort((a, b) => a.topic.localeCompare(b.topic));
        topicData.forEach((topic) => {
            if (topic.subtopics) {
                topic.subtopics.sort((a, b) => a.topic.localeCompare(b.topic));
            }
        });

        return { studentContributions, topicData };
    };


    /**
     * Calculate filtered topic data based on a slice of student contributions.
     * The lowerPercentile and upperPercentile are percentages (0-100) indicating the slice.
     *
     * This function updates the topicData values based solely on the normalized subtopic values in the filtered students.
     */
    const calculateFilteredData = (studentContributions: StudentContribution[], topicData: TopicData[], lowerPercentile: number, upperPercentile: number): TopicData[] => {
        const totalStudents = studentContributions.length;
        const lowerIndex = Math.floor((lowerPercentile / 100) * totalStudents);
        const upperIndex = Math.ceil((upperPercentile / 100) * totalStudents);
        const filteredStudents = studentContributions.slice(lowerIndex, upperIndex);

        // Update the topicData based on the filtered student contributions.
        const updatedTopicData: TopicData[] = topicData.map((topic) => {
            if (topic.subtopics) {
                // Update each subtopic average from the filtered students.
                const updatedSubtopics = topic.subtopics.map((sub) => {
                    let sum = 0;
                    filteredStudents.forEach((student) => {
                        sum += student.topicContributions[sub.topic] || 0;
                    });
                    const avg = filteredStudents.length ? sum / filteredStudents.length : 0;
                    return { topic: sub.topic, value: avg };
                });
                // The main topic's value is the average of its subtopics.
                const mainAvg = updatedSubtopics.reduce((acc, sub) => acc + sub.value, 0) / updatedSubtopics.length;
                return { topic: topic.topic, value: mainAvg, subtopics: updatedSubtopics };
            } else {
                // Standalone subtopic.
                let sum = 0;
                filteredStudents.forEach((student) => {
                    sum += student.topicContributions[topic.topic] || 0;
                });
                const avg = filteredStudents.length ? sum / filteredStudents.length : 0;
                return { topic: topic.topic, value: avg };
            }
        });

        // Sort the updated topic data by topic name and subtopics as well.
        updatedTopicData.sort((a, b) => a.topic.localeCompare(b.topic));
        updatedTopicData.forEach((topic) => {
            if (topic.subtopics) {
                topic.subtopics.sort((a, b) => a.topic.localeCompare(b.topic));
            }
        });

        return updatedTopicData;
    };

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <SecondaryNavBar />
            <Box sx={containerStyle}>
                {isLoading ? (
                    <CircularProgress />
                ) : isApiError ? (
                    <Typography>Failed to connect to server.</Typography>
                ) : studentContributions.length == 0 || data.length <= 0 ? (
                    <Typography>Statistics not available.</Typography>
                ) : (
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
                                    {data.map((topicDataItem, index) => (
                                        <React.Fragment key={index}>
                                            <TableRow>
                                                <TableCell style={{ width: '70%', alignItems: 'center' }}>
                                                    <Chip
                                                        label={topicDataItem.topic}
                                                        sx={{ margin: 1, fontWeight: 'bold', fontSize: '1.2rem' }}
                                                    />
                                                    {topicDataItem.subtopics && topicDataItem.subtopics.length > 0 && (
                                                        <IconButton onClick={() => toggleExpand(topicDataItem.topic)}>
                                                            {expandedTopics.includes(topicDataItem.topic) ? <ExpandLess /> : <ExpandMore />}
                                                        </IconButton>
                                                    )}
                                                </TableCell>
                                                <TableCell style={{ width: '30%', textAlign: 'right' }}>
                                                    <div style={{ display: 'inline-block', width: '80%', marginRight: '10px' }}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={topicDataItem.value}
                                                            sx={{
                                                                height: 15,
                                                                borderRadius: 7,
                                                                '& .MuiLinearProgress-bar': { backgroundColor: getColor(topicDataItem.value) }
                                                            }}
                                                        />
                                                    </div>
                                                    <span style={{ marginLeft: '5px' }}>{topicDataItem.value.toFixed(0)}%</span>
                                                </TableCell>
                                            </TableRow>
                                            {expandedTopics.includes(topicDataItem.topic) &&
                                                topicDataItem.subtopics &&
                                                topicDataItem.subtopics.map((subTopic, subIndex) => (
                                                    <TableRow key={`${index}-${subIndex}`}>
                                                        <TableCell style={{ width: '70%', paddingLeft: 32 }}>
                                                            <Chip label={subTopic.topic} sx={{ margin: 1, fontSize: '0.8rem' }} />
                                                        </TableCell>
                                                        <TableCell style={{ width: '30%', textAlign: 'right' }}>
                                                            <div style={{ display: 'inline-block', width: '60%', marginRight: '10px' }}>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={subTopic.value}
                                                                    sx={{
                                                                        height: 10,
                                                                        borderRadius: 5,
                                                                        '& .MuiLinearProgress-bar': { backgroundColor: getColor(subTopic.value) }
                                                                    }}
                                                                />
                                                            </div>
                                                            <span style={{ marginLeft: '5px' }}>{subTopic.value.toFixed(0)}%</span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Box>
        </Box>
    );
};

type TopicData = {
    topic: string;
    value: number;
    subtopics?: TopicData[];
};

type StudentContribution = {
    grade: number, // The grades of the student
    topicContributions: Record<string, number>, // The value the student contributes to a subtopic
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
