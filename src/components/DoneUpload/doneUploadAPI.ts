import { DataItemWithUUID } from "../../types/types";

const BASE_URL = "http://127.0.0.1:8000";

interface SaveParsedPDFRequest {
    title: string;
    questions: Array<{ description: string; topics: string[]; mark: number; difficulty: number }>;
}

interface SaveParsedPDFResponse {
    id: number;
    title: string;
    questions: DataItemWithUUID[];
}

export const parsedPdfApi = {
    saveParsedPDF: async (data: SaveParsedPDFRequest): Promise<SaveParsedPDFResponse> => {
        const response = await fetch(`${BASE_URL}/papers/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
            throw new Error(errorData.detail || "Failed to save parsed PDF");
        }

        return response.json();
    },
};
