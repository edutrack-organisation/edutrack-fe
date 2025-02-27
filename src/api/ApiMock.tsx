import { CourseItem, PaperItem, QuestionItem } from "../types/types";

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

const ApiMock = {
    /**
     * API call to upload a PDF paper to be scanned.
     *
     * @param file The file to scan
     * @returns An ApiResponse object with the data being a JSON object containing { title: String, questionData: DataItem[] }
     */
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
            throw new ApiError(
                `Failed to upload PDF: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    },

    getCourses: async (): Promise<ApiResponse<CourseItem[]>> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { 
            success: true,
            data: [
                { courseId: 1, courseTitle: "CS2105" },
                { courseId: 2, courseTitle: "Test Course 1" },
                { courseId: 3, courseTitle: "Test Course 2" },
                { courseId: 400, courseTitle: "Test Course" },
            ],
        };
    },

    getCoursePapers: async (courseId: number): Promise<ApiResponse<PaperItem[]>> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
            success: true,
            data: [
                { paperId: 1, paperTitle: "Paper 1" },
                { paperId: 2, paperTitle: "Paper 2" },
                { paperId: 3, paperTitle: "Paper 3" },
                { paperId: 4, paperTitle: "Paper 4" },
                { paperId: 5, paperTitle: "CS2105 - Computer Networks Finals 2023/2024 Semester 2" },
                { paperId: 6, paperTitle: "Paper 5" },
                { paperId: 7, paperTitle: "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum" },
                { paperId: 8, paperTitle: "Paper 200" },
            ],
        };
    },

    getIsPaperScoresAvailable: async (paperId: number): Promise<ApiResponse<boolean>> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
            success: true,
            data: true,
        };
    },

    getPaperQuestions: async (paperId: number): Promise<ApiResponse<QuestionItem[]>> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // TODO: To be implemented
        function createData(
            uuid: string,
            description: string,
            topics: string[],
            difficulty: number
        ): QuestionItem {
            return { questionId: Number(uuid), questionNumber: Number(uuid), description, marks: 10, topics, difficulty };
        }

        const dummyData = [
            createData(
                "1",
                "What is the function of a router in a network, and how does it differ from other networking devices like switches and hubs?",
                ["Routing", "Networking Devices"],
                3
            ),
            createData(
                "2",
                "Explain the differences between TCP (Transmission Control Protocol) and UDP (User Datagram Protocol), including their use cases and how their characteristics affect data transmission.",
                ["Protocols", "TCP/IP"],
                5
            ),
            createData(
                "3",
                "What is an IP address, and how is it structured in terms of its components? Include an explanation of IPv4 and IPv6 addressing formats and their significance.",
                ["IP Addressing", "Networking"],
                2
            ),
            createData(
                "4",
                "What are the main differences between IPv4 and IPv6, and how do these differences impact network configuration, address space, and overall internet functionality?",
                ["IP Addressing", "IPv4 vs IPv6"],
                6
            ),
            createData(
                "5",
                "Describe the OSI (Open Systems Interconnection) model and its seven layers. Explain the function of each layer and how they interact to enable network communication.",
                ["OSI Model", "Networking Architecture"],
                7
            ),
            createData(
                "6",
                "What is a subnet mask, and how is it used in the process of subnetting IP addresses? Include an explanation of how subnet masks help in dividing a network into smaller sub-networks.",
                ["Subnetting", "IP Addressing"],
                8
            ),
            createData(
                "7",
                "Explain how the Domain Name System (DNS) works to translate domain names into IP addresses. Discuss the role of DNS servers and how they contribute to the resolution process.",
                ["DNS", "Name Resolution"],
                4
            ),
            createData(
                "8",
                "What is a MAC (Media Access Control) address, and how does it differ from an IP address? Provide details on how MAC addresses are used in network communication and their importance in local network management.",
                ["MAC Address", "Networking"],
                3
            ),
            createData(
                "9",
                "What is Network Address Translation (NAT), and how does it enable multiple devices on a local network to share a single public IP address? Discuss different types of NAT and their implications for network security and communication.",
                ["NAT", "Networking"],
                5
            ),
            createData(
                "10",
                "Explain the purpose of a Virtual Private Network (VPN) in a network environment. Describe how VPNs secure data transmission and provide privacy by creating a secure tunnel over the internet.",
                ["VPN", "Network Security"],
                6
            ),
        ];
        return {
            success: true,
            data: dummyData,
        };
    },

    savePaper: async (paper: PaperItem): Promise<ApiResponse> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { success: true };
    },

    getPaperStudentScores: async (paperId: number): Promise<ApiResponse<number[][]>> => {
        const dummyData: number[][] =
           [[ 6,  6,  1,  4,  5,  3,  5,  3,  6,  5],
            [ 8,  8,  6,  4,  2,  7,  5,  9,  8,  5],
            [ 5, 10,  8,  1,  9,  9,  7,  8,  5,  4],
            [ 4,  4,  7,  2,  7,  4,  7,  5,  9,  7],
            [ 5,  5,  8,  8, 10,  3,  2,  4,  3,  7],
            [ 3,  6,  9, 10,  9,  9, 10,  7,  3,  6],
            [ 4,  5,  8,  5,  7,  7,  2,  1, 10,  3],
            [ 6,  9,  8,  6,  6,  8, 10,  1, 10,  2],
            [ 5,  9,  2,  8, 10,  3,  2,  9,  2,  3],
            [ 6,  4, 10,  5,  4,  3,  4,  3,  8,  4]]       

        return {
            success: true,
            data: dummyData,
        }
    },

    scores: [[1]], // TODO: Remove this
    setPaperStudentScores: async (paperId: number, csvFile: File): Promise<ApiResponse> => {
        try {
            const text = await csvFile.text();
            const rows = text.split("\n").filter(row => row.trim() !== "");
            const data = rows.map(row =>
                row.split(',').map(val => {
                    const num = parseInt(val.trim());
                    if (isNaN(num)) {
                        throw new Error("Invalid number in CSV");
                    }
                    return num;
                })
            );
            ApiMock.scores = data;  // This should work without type errors now
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    },

    setPaperDifficulty: async (paperId: number, csvFile: File): Promise<ApiResponse> => {
        try {
            const text = await csvFile.text();
            const rows = text.split("\n").filter(row => row.trim() !== "");
            const data = rows.map(row =>
                row.split(',').map(val => {
                    const num = parseInt(val.trim());
                    if (isNaN(num)) {
                        throw new Error("Invalid number in CSV");
                    }
                    return num;
                })
            );
            ApiMock.scores = data;  // This should work without type errors now
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    },

    getTopicStatistics: async (): Promise<ApiResponse> => {
        return { success: true, data: [
            {topic: "Test Topic 1", value: 0},
            {topic: "Test Topic 2", value: 15},
            {topic: "Test Topic 3", value: 50},
            {topic: "Test Topic 4", value: 75},
            {topic: "Test Topic 5", value: 100},
        ]};
    },
};

export default ApiMock;
