interface ApiResponse {
    success: boolean;  // Whether the API call is successful
    message?: string;  // Optional message field
    data?: any;        // Data from API call
}

export class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ApiError";
    }
}

const Api = {
    uploadPdfPaper: async (file: File): Promise<ApiResponse> => {
        // Create a FormData object to hold the file data
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Send the file to the FastAPI endpoint
            const response = await fetch("http://127.0.0.1:8000/parsePDF/", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                // Handle HTTP errors
                const errorMessage = await response.text();
                throw new ApiError(`Error ${response.status}: ${errorMessage}`);
            }

            return await response.json(); // Return the parsed JSON response
        } catch (error) {
            // Handle network or other unexpected errors
            throw new ApiError(`Failed to upload PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
};

export default Api;
