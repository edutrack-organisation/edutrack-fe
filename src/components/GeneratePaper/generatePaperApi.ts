import { QuestionFromDB, Topic } from "./types";
// import { TopicForReactSelect } from "./types";

const BASE_URL = "http://127.0.0.1:8000";

export const generatePaperApi = {
    fetchTopics: async (): Promise<Topic[]> => {
        const response = await fetch(`${BASE_URL}/topics/`);
        if (!response.ok) throw new Error("Failed to fetch list of topics");
        return response.json();
    },

    quickGenerateQuestions: async (
        topics: { topic_id: number; max_allocated_marks: number }[]
    ): Promise<any> => {
        const response = await fetch(`${BASE_URL}/quick-generate/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topics }),
        });
        if (!response.ok)
            throw new Error("Error in quick generating questions");
        return response.json();
    },
};
