import type { CourseItem, PaperItem, QuestionItem } from "../types/types";

export interface ApiResponse<T = any> {
    success: boolean; // Whether the API call is successful
    message?: string; // Optional message field
    data?: T; // Data from API call
}

export class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ApiError";
    }
}

const Api = {
    // ================= APIs to be implemented =================
    changePaperQuestionTopics: async (
        title: String,
        index: number,
        newTopics: String[]
    ): Promise<ApiResponse> => {
        return { success: true };
    },

    changePaperQuestionDescription: async (
        title: String,
        index: number,
        newDescription: String
    ): Promise<ApiResponse> => {
        return { success: true };
    },

    changePaperQuestionMarks: async (
        title: String,
        index: number,
        newMarks: number
    ): Promise<ApiResponse> => {
        return { success: true };
    },

    changePaperQuestionDifficulty: async (
        title: String,
        index: number,
        newDifficulty: number
    ): Promise<ApiResponse> => {
        return { success: true };
    },

    deletePaperQuestion: async (
        title: String,
        index: number
    ): Promise<ApiResponse> => {
        return { success: true };
    },

    getPaperStudentScores: async (paperId: number): Promise<ApiResponse<number[][]>> => {
        // TODO: Can be optimized in the backend to simply return true or false
        try {
            // Send the file to the FastAPI endpoint
            const response = await fetch(`http://127.0.0.1:8000/papers/${paperId}`);

            if (!response.ok) {
                // Handle HTTP errors
                const errorMessage = await response.text();
                throw new ApiError(`Error ${response.status}: ${errorMessage}`);
            }

            const data = (await response.json()).student_scores;

            return {
                success: response.ok,
                data: data,
            };
        } catch (error) {
            // Handle network or other unexpected errors
            throw new ApiError("Failed to reach server");
        }
    },

    // ================= Working APIs =================

    /**
     * Adds a new course
     * @param courseTitle The title of the course to be added
     */
    addCourse: async (courseTitle: string): Promise<ApiResponse<CourseItem>> => {
        try {
            // Send the file to the FastAPI endpoint
            const response = await fetch(
                "http://127.0.0.1:8000/courses/",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        course_title: courseTitle
                    }),
                }
            );

            if (!response.ok) {
                // Handle HTTP errors
                const errorMessage = await response.text();
                throw new ApiError(`Error ${response.status}: ${errorMessage}`);
            }

            return {
                success: response.ok,
                data: await response.json(),
            };
        } catch (error) {
            // Handle network or other unexpected errors
            throw new ApiError("Failed to reach server");
        }
    },

    getCourses: async (): Promise<ApiResponse<CourseItem[]>> => {
        try {
            // Send the file to the FastAPI endpoint
            const response = await fetch("http://127.0.0.1:8000/courses/");

            if (!response.ok) {
                // Handle HTTP errors
                const errorMessage = await response.text();
                throw new ApiError(`Error ${response.status}: ${errorMessage}`);
            }

            const data = (await response.json()).map((course) => ({
                courseId: course.id,
                courseTitle: course.title,
            }));

            return {
                success: response.ok,
                data: data,
            };
        } catch (error) {
            // Handle network or other unexpected errors
            throw new ApiError("Failed to reach server");
        }
    },

    getCoursePapers: async (courseId: number): Promise<ApiResponse<PaperItem[]>> => {
        try {
            // Send the file to the FastAPI endpoint
            const response = await fetch(`http://127.0.0.1:8000/courses/${courseId}`);

            if (!response.ok) {
                // Handle HTTP errors
                const errorMessage = await response.text();
                throw new ApiError(`Error ${response.status}: ${errorMessage}`);
            }

            const data = (await response.json()).papers.map((paper) => ({
                paperId: paper.id,
                paperTitle: paper.title,
            }));

            return {
                success: response.ok,
                data: data,
            };
        } catch (error) {
            // Handle network or other unexpected errors
            throw new ApiError("Failed to reach server");
        }
    },

    getIsPaperScoresAvailable: async (paperId: number): Promise<ApiResponse<boolean>> => {
        // TODO: Can be optimized in the backend to simply return true or false
        try {
            // Send the file to the FastAPI endpoint
            const response = await fetch(`http://127.0.0.1:8000/papers/${paperId}`);

            if (!response.ok) {
                // Handle HTTP errors
                const errorMessage = await response.text();
                throw new ApiError(`Error ${response.status}: ${errorMessage}`);
            }

            const data = (await response.json()).student_scores.length > 0;

            return {
                success: response.ok,
                data: data,
            };
        } catch (error) {
            // Handle network or other unexpected errors
            throw new ApiError("Failed to reach server");
        }
    },

    getPaperQuestions: async (paperId: number): Promise<ApiResponse<QuestionItem[]>> => {
        try {
            // Send the file to the FastAPI endpoint
            const response = await fetch(`http://127.0.0.1:8000/papers/${paperId}`);

            if (!response.ok) {
                // Handle HTTP errors
                const errorMessage = await response.text();
                throw new ApiError(`Error ${response.status}: ${errorMessage}`);
            }

            const data = (await response.json()).questions
                .map((question) => ({
                    questionId: question.id,
                    questionNumber: question.question_number,
                    description: question.description,
                    topics: question.topics.map((topic) => (topic.title)), // TODO: use TopicItem in the future
                    marks: question.marks ?? 0, // TODO: use actual marks instead of dummy marks
                    difficulty: question.difficulty,
                }))
                .sort((a, b) => a.questionNumber - b.questionNumber); // Sort in ascending order

            return {
                success: response.ok,
                data: data,
            };
        } catch (error) {
            // Handle network or other unexpected errors
            throw new ApiError("Failed to reach server");
        }
    },

    updatePaper: async (paper: PaperItem): Promise<ApiResponse> => {
        try {
            // Send the student scores to the FastAPI endpoint
            const response = await fetch(
                `http://127.0.0.1:8000/papers/${paper.paperId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: paper.paperId,
                        title: paper.paperTitle,
                        questions: paper.questions?.map((q) => ({
                            id: q.questionId,
                            question_number: q.questionNumber,
                            description: q.description,
                            marks: q.marks,
                            difficulty: q.difficulty,
                            topics_str: q.topics,
                        })) ?? [],
                    }),
                }
            );

            if (!response.ok) {
                // Handle HTTP errors
                const errorMessage = await response.text();
                throw new ApiError(`Error ${response.status}: ${errorMessage}`);
            }

            return {
                success: response.ok,
                data: await response.json(),
            };
        } catch (error) {
            // Handle network or other unexpected errors
            throw new ApiError("Failed to reach server");
        }
    },

    /**
     * Updates student scores for a paper
     * @param paperId The id of the paper to update scores
     * @param studentScores The student score values to update to
     */
    updateStudentScores: async (paperId: number, studentScores: number[][]): Promise<ApiResponse<CourseItem>> => {
        try {
            // Send the student scores to the FastAPI endpoint
            const response = await fetch(
                `http://127.0.0.1:8000/studentScores/${paperId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        student_scores: studentScores
                    }),
                }
            );

            if (!response.ok) {
                // Handle HTTP errors
                const errorMessage = await response.text();
                throw new ApiError(`Error ${response.status}: ${errorMessage}`);
            }

            return {
                success: response.ok,
                data: await response.json(),
            };
        } catch (error) {
            // Handle network or other unexpected errors
            throw new ApiError("Failed to reach server");
        }
    },

    /**
     * Update difficulty for all questions a paper
     * @param paperId The id of the paper to update question difficulty
     * @param difficulty The difficulty values to update to for the questions
     */
    updatePaperQuestionDifficulties: async (paperId: number, questionDifficulties: number[]): Promise<ApiResponse<CourseItem>> => {
        try {
            // Send the student scores to the FastAPI endpoint
            const response = await fetch(
                `http://127.0.0.1:8000/questionDifficulties/${paperId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        question_difficulties: questionDifficulties
                    }),
                }
            );

            if (!response.ok) {
                // Handle HTTP errors
                const errorMessage = await response.text();
                throw new ApiError(`Error ${response.status}: ${errorMessage}`);
            }

            return {
                success: response.ok,
                data: await response.json(),
            };
        } catch (error) {
            // Handle network or other unexpected errors
            throw new ApiError("Failed to reach server");
        }
    },
};

export default Api;
