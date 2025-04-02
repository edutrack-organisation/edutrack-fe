import { DataItemWithUUID } from "../../types/types";
import { QuestionFromDB, Topic } from "./types";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = "http://127.0.0.1:8000";

export const generatePaperApi = {
    // fetch the topics in database
    fetchTopics: async (): Promise<Topic[]> => {
        const response = await fetch(`${BASE_URL}/topics/`);
        if (!response.ok) throw new Error("Failed to fetch list of topics");
        return response.json();
    },

    // fetch complete list of predefined topics from Excel file
    fetchPredefinedTopics: async (): Promise<string[]> => {
        const response = await fetch(`${BASE_URL}/topics/available/`);
        if (!response.ok) throw new Error("Failed to fetch predefined list of topics");
        return response.json();
    },

    quickGenerateQuestions: async (topics: { topic_id: number; max_allocated_marks: number }[]): Promise<any> => {
        const response = await fetch(`${BASE_URL}/questions/quick-generate/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topics }),
        });
        if (!response.ok) throw new Error("Failed to quick generate questions");
        return response.json();
    },

    generateQuestionByTopic: async (topicId: number): Promise<QuestionFromDB[]> => {
        const response = await fetch(`${BASE_URL}/questions?topic_id=${topicId}`);
        if (!response.ok) throw new Error("Failed to fetch questions with this topic");

        return response.json();
    },

    generateQuestionFromGPT: async (prompt: string): Promise<DataItemWithUUID> => {
        const response = await fetch(`${BASE_URL}/generate-gpt/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });
        const response_json = await response.json();
        if (!response.ok) {
            throw new Error(response_json.detail || "Failed to generate question from GPT");
        }

        return {
            ...response_json,
            uuid: uuidv4(), // Add UUID to the response
        };
    },
};
