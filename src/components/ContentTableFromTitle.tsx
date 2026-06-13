import {
  Button,
  Select, 
  MenuItem,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import TextArea from "./DoneUpload/TextArea";
import CreatableSelect from "react-select/creatable";
import { Paper, Question, Topic } from "../types/types";
import { useEffect, useState } from "react";
import Api from "../api/Api";
import toast from "react-hot-toast";
import { debounce } from "lodash";

// HELPER: Convert "Topic[]" (from Question) to React Select format
const formatQuestionTopics = (topics: Topic[]) => {
  if (!topics) return [];
  return topics.map((t) => ({ label: t.title, value: t.title }));
};

// HELPER: Convert "string[]" (from API) to React Select format
const formatOptionTopics = (topics: string[]) => {
  if (!topics) return [];
  return topics.map((t) => ({ label: t, value: t }));
};

// HELPER: Convert React Select options back to string[] for saving
const deformatTopics = (selectedOptions: any) => {
  if (!selectedOptions) return [];
  return selectedOptions.map((opt: any) => opt.value);
};

const BLOOM_LEVELS = [
  "Remember",
  "Understand",
  "Apply",
  "Analyze",
  "Evaluate",
  "Create",
];

interface ContentTableProps {
  paper: Paper;
}

const ContentTableFromTitle: React.FC<ContentTableProps> = ({ paper }) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  // State to hold the merged list of topics (Excel + DB)
  const [allTopics, setAllTopics] = useState<string[]>([]);

  // 1. Fetch Options on Mount
  useEffect(() => {
    Api.getAvailableTopics()
      .then((topics) => setAllTopics(topics))
      .catch((err) => console.error("Failed to load topics", err));
  }, []);

  // 2. Sync Questions when paper changes
  useEffect(() => {
    if (paper?.questions) {
      // Sort the questions sequentially before setting them in state
      const sortedQuestions = [...paper.questions].sort(
        (a, b) => a.question_number - b.question_number,
      );
      setQuestions(sortedQuestions);
    }
  }, [paper]);

  const handleUpdate = (updatedQuestion: Question) => {
    const questionToUpdate = {
      id: updatedQuestion.id,
      question_number: updatedQuestion.question_number,
      type: updatedQuestion.type,
      description: updatedQuestion.description,
      mark: updatedQuestion.mark,
      difficulty: updatedQuestion.difficulty,
      topics_str: updatedQuestion.topics.map((t) => t.title),
      level: updatedQuestion.level,
    };

    Api.updateQuestion(updatedQuestion.id, questionToUpdate)
      .then(() =>
        toast.success(`Question #${updatedQuestion.question_number} saved!`),
      )
      .catch((error) => toast.error(`Error saving question: ${error.message}`));
  };

  const debouncedUpdate = debounce(handleUpdate, 1000);

  const handleDescriptionChange = (
    questionId: number,
    newDescription: string,
  ) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, description: newDescription } : q,
    );
    setQuestions(updatedQuestions);
    const updatedQuestion = updatedQuestions.find((q) => q.id === questionId);
    if (updatedQuestion) debouncedUpdate(updatedQuestion);
  };

  // 3. Handle Topic Changes
  const handleTopicsChange = (questionId: number, newTopicTitles: string[]) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            // We temporarily create Topic objects with ID 0 since the backend
            // will handle the actual ID assignment during the update
            topics: newTopicTitles.map((title) => ({ id: 0, title })),
          }
        : q,
    );

    setQuestions(updatedQuestions);
    const updatedQuestion = updatedQuestions.find((q) => q.id === questionId);

    // Check if newTopicTitles is not empty before saving, or allow empty if valid
    if (updatedQuestion) {
      handleUpdate(updatedQuestion);

      // OPTIONAL: If a user created a brand new topic, add it to our local dropdown list immediately
      // so they can use it for the next question without refreshing
      const uniqueNewTopics = new Set([...allTopics, ...newTopicTitles]);
      if (uniqueNewTopics.size > allTopics.length) {
        setAllTopics(Array.from(uniqueNewTopics).sort());
      }
    }
  };

  const handleLevelChange = (questionId: number, newLevel: string) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, level: newLevel } : q,
    );
    setQuestions(updatedQuestions);
    const updatedQuestion = updatedQuestions.find((q) => q.id === questionId);
    if (updatedQuestion) {
      handleUpdate(updatedQuestion); // Save immediately on selection
    }
  };

  const handleDifficultyChange = (
    questionId: number,
    newDifficulty: number,
  ) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, difficulty: newDifficulty } : q,
    );
    setQuestions(updatedQuestions);
    const updatedQuestion = updatedQuestions.find((q) => q.id === questionId);
    if (updatedQuestion) debouncedUpdate(updatedQuestion);
  };

  const handleTypeChange = (questionId: number, newType: string) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, type: newType } : q,
    );
    setQuestions(updatedQuestions);
    const updatedQuestion = updatedQuestions.find((q) => q.id === questionId);
    if (updatedQuestion) debouncedUpdate(updatedQuestion);
  };

  return (
    <TableContainer component={MuiPaper} sx={{ mt: "1.5rem" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "10%" }}>Question Number</TableCell>
            <TableCell sx={{ width: "50%" }} align="left">
              Description
            </TableCell>
            <TableCell sx={{ width: "30%" }} align="left">
              Topics
            </TableCell>
            <TableCell sx={{ width: "10%" }} align="left">
              Type
            </TableCell>
            <TableCell sx={{ width: "15%" }} align="left">
              Level
            </TableCell>
            <TableCell align="right">Difficulty</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question, index) => {
            // Validation Logic
            const isTopicsEmpty =
              !question.topics || question.topics.length === 0;

            return (
              <TableRow
                key={question.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {question.question_number}
                </TableCell>
                <TableCell align="left">
                  <TextArea
                    className="textarea"
                    textContent={question.description}
                    onChange={(event) =>
                      handleDescriptionChange(question.id, event.target.value)
                    }
                  />
                </TableCell>
                <TableCell align="left">
                  {/* 4. Render Creatable Select */}
                  <CreatableSelect
                    isMulti
                    required
                    // Convert Question's Topic[] -> { label, value }[]
                    value={formatQuestionTopics(question.topics)}
                    // Convert API's string[] -> { label, value }[]
                    options={formatOptionTopics(allTopics)}
                    onChange={(newValue) =>
                      handleTopicsChange(question.id, deformatTopics(newValue))
                    }
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        width: "350px",
                        // Red border if empty (Required field logic)
                        borderColor: isTopicsEmpty
                          ? "#d32f2f"
                          : baseStyles.borderColor,
                        "&:hover": {
                          borderColor: isTopicsEmpty
                            ? "#d32f2f"
                            : baseStyles.borderColor,
                        },
                      }),
                      menuList: (baseStyles) => ({
                        ...baseStyles,
                        maxHeight: "200px",
                        overflowY: "auto",
                      }),
                    }}
                  />
                  {isTopicsEmpty && (
                    <Typography variant="caption" color="error">
                      Required
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="left">
                  <Select
                    value={question.type || "MCQ"} // Default to MCQ if undefined
                    size="small"
                    fullWidth
                    onChange={(e) =>
                      handleTypeChange(question.id, e.target.value)
                    }
                    sx={{
                      fontSize: "0.875rem",
                      backgroundColor: "white",
                      minWidth: "90px",
                    }}
                  >
                    <MenuItem value="MCQ">MCQ</MenuItem>
                    <MenuItem value="MRQ">MRQ</MenuItem>
                  </Select>
                </TableCell>
                <TableCell align="left">
                  <Select
                    value={question.level || "Remember"}
                    size="small"
                    fullWidth
                    onChange={(e) =>
                      handleLevelChange(question.id, e.target.value)
                    }
                    sx={{
                      fontSize: "0.875rem",
                      backgroundColor: "white",
                      minWidth: "120px",
                    }}
                  >
                    {BLOOM_LEVELS.map((lvl) => (
                      <MenuItem key={lvl} value={lvl}>
                        {lvl}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    defaultValue={question.difficulty || 0}
                    variant="outlined"
                    onChange={(event) =>
                      handleDifficultyChange(
                        question.id,
                        parseInt(event.target.value),
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContentTableFromTitle;
