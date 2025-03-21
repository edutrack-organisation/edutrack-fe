import { ParsedPDFResponse } from "./types";

const BASE_URL = "http://127.0.0.1:8000";

export const pdfApi = {
    parsePDF: async (file: File): Promise<ParsedPDFResponse> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${BASE_URL}/papers/parse/`, {
            method: "POST",
            body: formData,
        });

        const response_json = await response.json();
        if (!response.ok) {
            throw new Error(response_json.detail || "Failed to parse PDF");
        }

        return response_json;
    },
};
