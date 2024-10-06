import { DataItem } from "../types/types";

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
    /**
     * API call to upload a PDF paper to be scanned.
     * 
     * @param file The file to scan
     * @returns An ApiResponse object with the data being a JSON object containing { title: String, questionData: DataItem[] }
     */
    uploadPdfPaper: async (file: File): Promise<ApiResponse> => {
        // // Create a FormData object to hold the file data
        // const formData = new FormData();
        // formData.append("file", file);

        // try {
        //     // Send the file to the FastAPI endpoint
        //     const response = await fetch("http://127.0.0.1:8000/parsePDF/", {
        //         method: "POST",
        //         body: formData,
        //     });

        //     if (!response.ok) {
        //         // Handle HTTP errors
        //         const errorMessage = await response.text();
        //         throw new ApiError(`Error ${response.status}: ${errorMessage}`);
        //     }

        //     return await response.json(); // Return the parsed JSON response
        // } catch (error) {
        //     // Handle network or other unexpected errors
        //     throw new ApiError(`Failed to upload PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // }

        function createData(
            question_uuid: number,
            description: string,
            topics: string[],
            difficulty: number
        ): DataItem {
            return { question_uuid, description, topics, difficulty };
        }
    
        const dummyData = [
            createData(
                1,
                "What is the function of a router in a network, and how does it differ from other networking devices like switches and hubs?",
                ["Routing", "Networking Devices"],
                3
            ),
            createData(
                2,
                "Explain the differences between TCP (Transmission Control Protocol) and UDP (User Datagram Protocol), including their use cases and how their characteristics affect data transmission.",
                ["Protocols", "TCP/IP"],
                5
            ),
            createData(
                3,
                "What is an IP address, and how is it structured in terms of its components? Include an explanation of IPv4 and IPv6 addressing formats and their significance.",
                ["IP Addressing", "Networking"],
                2
            ),
            createData(
                4,
                "What are the main differences between IPv4 and IPv6, and how do these differences impact network configuration, address space, and overall internet functionality?",
                ["IP Addressing", "IPv4 vs IPv6"],
                6
            ),
            createData(
                5,
                "Describe the OSI (Open Systems Interconnection) model and its seven layers. Explain the function of each layer and how they interact to enable network communication.",
                ["OSI Model", "Networking Architecture"],
                7
            ),
            createData(
                6,
                "What is a subnet mask, and how is it used in the process of subnetting IP addresses? Include an explanation of how subnet masks help in dividing a network into smaller sub-networks.",
                ["Subnetting", "IP Addressing"],
                8
            ),
            createData(
                7,
                "Explain how the Domain Name System (DNS) works to translate domain names into IP addresses. Discuss the role of DNS servers and how they contribute to the resolution process.",
                ["DNS", "Name Resolution"],
                4
            ),
            createData(
                8,
                "What is a MAC (Media Access Control) address, and how does it differ from an IP address? Provide details on how MAC addresses are used in network communication and their importance in local network management.",
                ["MAC Address", "Networking"],
                3
            ),
            createData(
                9,
                "What is Network Address Translation (NAT), and how does it enable multiple devices on a local network to share a single public IP address? Discuss different types of NAT and their implications for network security and communication.",
                ["NAT", "Networking"],
                5
            ),
            createData(
                10,
                "Explain the purpose of a Virtual Private Network (VPN) in a network environment. Describe how VPNs secure data transmission and provide privacy by creating a secure tunnel over the internet.",
                ["VPN", "Network Security"],
                6
            ),
        ];

        return { success: true, data: {title: "CS2105 - Computer Networks Finals 2023/2024 Semester 2", questionData: dummyData } };
    },

    /**
     * API call to submit the confirmed fields of the paper.
     * 
     * @param title The title of the paper
     * @param questionData The list of questions in the paper
     * @returns An ApiResponse object with the data being a JSON object containing { title: String } // TODO: to be discussed, this should redirect user to view the paper
     */
    submitPdfData: async (title: String, questionData: DataItem[]): Promise<ApiResponse> => {
        // TODO: To be implemented
        return { success: true, data: { title: "CS2105 - Computer Networks Finals 2023/2024 Semester 2" } };
    },

    getPdfTitleList: async (): Promise<ApiResponse> => {
        // TODO: To be implemented
        return { success: true, data: ["Paper 1", "Paper 2", "Paper 3", "Paper 4", "CS2105 - Computer Networks Finals 2023/2024 Semester 2", "Paper 5", "Paper 6", "Paper 200",] };
    },

    getPaper: async(title: String): Promise<ApiResponse> => {
        // TODO: To be implemented
        function createData(
            question_uuid: number,
            description: string,
            topics: string[],
            difficulty: number
        ): DataItem {
            return { question_uuid, description, topics, difficulty };
        }
    
        const dummyData = [
            createData(
                1,
                "What is the function of a router in a network, and how does it differ from other networking devices like switches and hubs?",
                ["Routing", "Networking Devices"],
                3
            ),
            createData(
                2,
                "Explain the differences between TCP (Transmission Control Protocol) and UDP (User Datagram Protocol), including their use cases and how their characteristics affect data transmission.",
                ["Protocols", "TCP/IP"],
                5
            ),
            createData(
                3,
                "What is an IP address, and how is it structured in terms of its components? Include an explanation of IPv4 and IPv6 addressing formats and their significance.",
                ["IP Addressing", "Networking"],
                2
            ),
            createData(
                4,
                "What are the main differences between IPv4 and IPv6, and how do these differences impact network configuration, address space, and overall internet functionality?",
                ["IP Addressing", "IPv4 vs IPv6"],
                6
            ),
            createData(
                5,
                "Describe the OSI (Open Systems Interconnection) model and its seven layers. Explain the function of each layer and how they interact to enable network communication.",
                ["OSI Model", "Networking Architecture"],
                7
            ),
            createData(
                6,
                "What is a subnet mask, and how is it used in the process of subnetting IP addresses? Include an explanation of how subnet masks help in dividing a network into smaller sub-networks.",
                ["Subnetting", "IP Addressing"],
                8
            ),
            createData(
                7,
                "Explain how the Domain Name System (DNS) works to translate domain names into IP addresses. Discuss the role of DNS servers and how they contribute to the resolution process.",
                ["DNS", "Name Resolution"],
                4
            ),
            createData(
                8,
                "What is a MAC (Media Access Control) address, and how does it differ from an IP address? Provide details on how MAC addresses are used in network communication and their importance in local network management.",
                ["MAC Address", "Networking"],
                3
            ),
            createData(
                9,
                "What is Network Address Translation (NAT), and how does it enable multiple devices on a local network to share a single public IP address? Discuss different types of NAT and their implications for network security and communication.",
                ["NAT", "Networking"],
                5
            ),
            createData(
                10,
                "Explain the purpose of a Virtual Private Network (VPN) in a network environment. Describe how VPNs secure data transmission and provide privacy by creating a secure tunnel over the internet.",
                ["VPN", "Network Security"],
                6
            ),
        ];
        return { success: true, data: { title: title, questionData: dummyData }};
    },

    changePaperQuestionTopics: async (title: String, index: number, newTopics: String[]): Promise<ApiResponse> => {
        return { success: true }
    },

    changePaperQuestionDescription: async (title: String, index: number, newDescription: String): Promise<ApiResponse> => {
        return { success: true }
    },

    changePaperQuestionDifficulty: async (title: String, index: number, newDifficulty: number): Promise<ApiResponse> => {
        return { success: true }
    },

    deletePaperQuestion: async (title: String, index: number): Promise<ApiResponse> => {
        return { success: true }
    },
};

export default Api;
