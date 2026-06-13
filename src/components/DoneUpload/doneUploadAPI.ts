import { DataItemWithUUID } from "../../types/types";

const BASE_URL = "http://127.0.0.1:8000";

interface SaveParsedPDFRequest {
    title: string;
    questions: Array<{
        description: string;
        topics: string[];
        mark: number;
        difficulty: number;
        level: string;
        type: string;
    }>;
    module_code: string;
    module_name: string;
    academic_year: string;
    semester: string;
}

interface SaveParsedPDFResponse {
  id: number;
  title: string;
  questions: DataItemWithUUID[];
  module_code: string;
  module_name: string;
  academic_year: string;
  semester: number;
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

        const savedPaper = await response.json();
        return savedPaper;

        // return response.json();
    },
};
