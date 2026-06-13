import {
  DataItem,
  DataItemWithUUID,
  Paper,
  PaperSummary,
  QuestionUpdate,
  GradeDistribution,
  Dashboard,
  TopicFrequency,
  DifficultyFrequencyAndAverageDifficultyForTopic,
  QuestionChoiceStatistics,
  StudentChoiceData,
  PaperAnalysis,
  PaperComparisonDB,
  PaperComparisonPayload
} from "../types/types";

interface ApiResponse {
    success: boolean; // Whether the API call is successful
    message?: string; // Optional message field
    data?: any; // Data from API call
}

export class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ApiError";
    }
}
const API_BASE_URL = "http://127.0.0.1:8000";

const Api = {
  /**
   * API call to upload a PDF paper to be scanned.
   *
   * @param file The file to scan
   * @returns An ApiResponse object with the data being a JSON object containing { title: String, questionData: DataItem[] }
   */
  // uploadPdfPaper: async (file: File): Promise<ApiResponse> => {
  //     // Create a FormData object to hold the file data
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     try {
  //         // Send the file to the FastAPI endpoint
  //         const response = await fetch("http://127.0.0.1:8000/parsePDF/", {
  //             method: "POST",
  //             body: formData,
  //         });

  //         if (!response.ok) {
  //             // Handle HTTP errors
  //             const errorMessage = await response.text();
  //             throw new ApiError(`Error ${response.status}: ${errorMessage}`);
  //         }

  //         return await response.json(); // Return the parsed JSON response
  //     } catch (error) {
  //         // Handle network or other unexpected errors
  //         throw new ApiError(
  //             `Failed to upload PDF: ${
  //                 error instanceof Error ? error.message : "Unknown error"
  //             }`
  //         );
  //     }

  //     // function createData(
  //     //     question_uuid: number,
  //     //     description: string,
  //     //     topics: string[],
  //     //     difficulty: number
  //     // ): DataItem {
  //     //     return { question_uuid, description, topics, difficulty };
  //     // }

  //     // const dummyData = [
  //     //     createData(
  //     //         1,
  //     //         "What is the function of a router in a network, and how does it differ from other networking devices like switches and hubs?",
  //     //         ["Routing", "Networking Devices"],
  //     //         3
  //     //     ),
  //     //     createData(
  //     //         2,
  //     //         "Explain the differences between TCP (Transmission Control Protocol) and UDP (User Datagram Protocol), including their use cases and how their characteristics affect data transmission.",
  //     //         ["Protocols", "TCP/IP"],
  //     //         5
  //     //     ),
  //     //     createData(
  //     //         3,
  //     //         "What is an IP address, and how is it structured in terms of its components? Include an explanation of IPv4 and IPv6 addressing formats and their significance.",
  //     //         ["IP Addressing", "Networking"],
  //     //         2
  //     //     ),
  //     //     createData(
  //     //         4,
  //     //         "What are the main differences between IPv4 and IPv6, and how do these differences impact network configuration, address space, and overall internet functionality?",
  //     //         ["IP Addressing", "IPv4 vs IPv6"],
  //     //         6
  //     //     ),
  //     //     createData(
  //     //         5,
  //     //         "Describe the OSI (Open Systems Interconnection) model and its seven layers. Explain the function of each layer and how they interact to enable network communication.",
  //     //         ["OSI Model", "Networking Architecture"],
  //     //         7
  //     //     ),
  //     //     createData(
  //     //         6,
  //     //         "What is a subnet mask, and how is it used in the process of subnetting IP addresses? Include an explanation of how subnet masks help in dividing a network into smaller sub-networks.",
  //     //         ["Subnetting", "IP Addressing"],
  //     //         8
  //     //     ),
  //     //     createData(
  //     //         7,
  //     //         "Explain how the Domain Name System (DNS) works to translate domain names into IP addresses. Discuss the role of DNS servers and how they contribute to the resolution process.",
  //     //         ["DNS", "Name Resolution"],
  //     //         4
  //     //     ),
  //     //     createData(
  //     //         8,
  //     //         "What is a MAC (Media Access Control) address, and how does it differ from an IP address? Provide details on how MAC addresses are used in network communication and their importance in local network management.",
  //     //         ["MAC Address", "Networking"],
  //     //         3
  //     //     ),
  //     //     createData(
  //     //         9,
  //     //         "What is Network Address Translation (NAT), and how does it enable multiple devices on a local network to share a single public IP address? Discuss different types of NAT and their implications for network security and communication.",
  //     //         ["NAT", "Networking"],
  //     //         5
  //     //     ),
  //     //     createData(
  //     //         10,
  //     //         "Explain the purpose of a Virtual Private Network (VPN) in a network environment. Describe how VPNs secure data transmission and provide privacy by creating a secure tunnel over the internet.",
  //     //         ["VPN", "Network Security"],
  //     //         6
  //     //     ),
  //     // ];

  //     // return { success: true, data: { title: "CS2105 - Computer Networks Finals 2023/2024 Semester 2", questionData: dummyData } };
  // },

  // /**
  //  * API call to submit the confirmed fields of the paper.
  //  *
  //  * @param title The title of the paper
  //  * @param questionData The list of questions in the paper
  //  * @returns An ApiResponse object with the data being a JSON object containing { title: String } // TODO: to be discussed, this should redirect user to view the paper
  //  */
  // submitPdfData: async (
  //     title: String,
  //     questionData: DataItem[]
  // ): Promise<ApiResponse> => {
  //     // TODO: To be implemented
  //     return {
  //         success: true,
  //         data: {
  //             title: "CS2105 - Computer Networks Finals 2023/2024 Semester 2",
  //         },
  //     };
  // },

  // getPdfTitleList: async (): Promise<ApiResponse> => {
  //     // TODO: To be implemented
  //     return {
  //         success: true,
  //         data: [
  //             "Paper 1",
  //             "Paper 2",
  //             "Paper 3",
  //             "Paper 4",
  //             "CS2105 - Computer Networks Finals 2023/2024 Semester 2",
  //             "Paper 5",
  //             "Paper 6",
  //             "Paper 200",
  //         ],
  //     };
  // },

  // getPaper: async (title: String): Promise<ApiResponse> => {
  //     // TODO: To be implemented
  //     function createData(
  //         uuid: string,
  //         description: string,
  //         topics: string[],
  //         mark: number,
  //         difficulty: number
  //     ): DataItemWithUUID {
  //         return { uuid, description, topics, mark, difficulty };
  //     }

  //     const dummyData = [
  //         createData(
  //             "1",
  //             "What is the function of a router in a network, and how does it differ from other networking devices like switches and hubs?",
  //             ["Routing", "Networking Devices"],
  //             0,
  //             3
  //         ),
  //         createData(
  //             "2",
  //             "Explain the differences between TCP (Transmission Control Protocol) and UDP (User Datagram Protocol), including their use cases and how their characteristics affect data transmission.",
  //             ["Protocols", "TCP/IP"],
  //             0,
  //             5
  //         ),
  //         createData(
  //             "3",
  //             "What is an IP address, and how is it structured in terms of its components? Include an explanation of IPv4 and IPv6 addressing formats and their significance.",
  //             ["IP Addressing", "Networking"],
  //             0,
  //             2
  //         ),
  //         createData(
  //             "4",
  //             "What are the main differences between IPv4 and IPv6, and how do these differences impact network configuration, address space, and overall internet functionality?",
  //             ["IP Addressing", "IPv4 vs IPv6"],
  //             0,
  //             6
  //         ),
  //         createData(
  //             "5",
  //             "Describe the OSI (Open Systems Interconnection) model and its seven layers. Explain the function of each layer and how they interact to enable network communication.",
  //             ["OSI Model", "Networking Architecture"],
  //             0,
  //             7
  //         ),
  //         createData(
  //             "6",
  //             "What is a subnet mask, and how is it used in the process of subnetting IP addresses? Include an explanation of how subnet masks help in dividing a network into smaller sub-networks.",
  //             ["Subnetting", "IP Addressing"],
  //             0,
  //             8
  //         ),
  //         createData(
  //             "7",
  //             "Explain how the Domain Name System (DNS) works to translate domain names into IP addresses. Discuss the role of DNS servers and how they contribute to the resolution process.",
  //             ["DNS", "Name Resolution"],
  //             0,
  //             4
  //         ),
  //         createData(
  //             "8",
  //             "What is a MAC (Media Access Control) address, and how does it differ from an IP address? Provide details on how MAC addresses are used in network communication and their importance in local network management.",
  //             ["MAC Address", "Networking"],
  //             0,
  //             3
  //         ),
  //         createData(
  //             "9",
  //             "What is Network Address Translation (NAT), and how does it enable multiple devices on a local network to share a single public IP address? Discuss different types of NAT and their implications for network security and communication.",
  //             ["NAT", "Networking"],
  //             0,
  //             5
  //         ),
  //         createData(
  //             "9",
  //             "Explain the purpose of a Virtual Private Network (VPN) in a network environment. Describe how VPNs secure data transmission and provide privacy by creating a secure tunnel over the internet.",
  //             ["VPN", "Network Security"],
  //             0,
  //             6
  //         ),
  //     ];
  //     return {
  //         success: true,
  //         data: { title: title, questionData: dummyData },
  //     };
  // },

  changePaperQuestionTopics: async (
    title: String,
    index: number,
    newTopics: String[],
  ): Promise<ApiResponse> => {
    return { success: true };
  },

  changePaperQuestionDescription: async (
    title: String,
    index: number,
    newDescription: String,
  ): Promise<ApiResponse> => {
    return { success: true };
  },

  changePaperQuestionDifficulty: async (
    title: String,
    index: number,
    newDifficulty: number,
  ): Promise<ApiResponse> => {
    return { success: true };
  },

  deletePaperQuestion: async (
    title: String,
    index: number,
  ): Promise<ApiResponse> => {
    return { success: true };
  },

  /**
   * API call to upload and parse a PDF file.
   */
  uploadPdfPaper: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(`${API_BASE_URL}/papers/parse`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new ApiError(`Error ${response.status}: ${errorMessage}`);
      }
      return await response.json();
    } catch (error) {
      throw new ApiError(
        `Failed to upload PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  },

  /**
   * API call to submit the confirmed paper data to be saved in the database.
   */
  submitPdfData: async (
    title: string,
    questions: DataItem[],
    dashboardData: {
      topic_frequency: TopicFrequency[];
      topic_difficulty: DifficultyFrequencyAndAverageDifficultyForTopic[];
    },
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/papers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          questions,
          dashboard_data: dashboardData,
        }),
      });

      if (response.status === 409) {
        throw new ApiError("A paper with this title already exists.");
      }
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new ApiError(`Error ${response.status}: ${errorMessage}`);
      }
      return await response.json();
    } catch (error) {
      throw new ApiError(
        `Failed to save paper: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  },

  updatePaperMetadata: async (
    paperId: number,
    data: {
      title?: string;
      module_code?: string;
      module_name?: string;
      academic_year?: string;
      semester?: string;
    },
  ): Promise<Paper> => {
    try {
      const response = await fetch(`${API_BASE_URL}/papers/${paperId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new ApiError(`Error ${response.status}: Failed to update paper`);
      }
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },

  getDashboardData: async (paperId: number): Promise<Dashboard> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/papers/${paperId}/dashboard`,
      );
      if (!response.ok) throw new ApiError(`Error ${response.status}`);
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },

  /**
   * Fetches a list of paper summaries (id and title) for the ViewPdfPage.
   */
  getPapersSummary: async (): Promise<PaperSummary[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/papers/summary`);
      if (!response.ok) {
        throw new ApiError(
          `Error ${response.status}: Failed to fetch paper list`,
        );
      }
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },

  /**
   * Fetches the full details of a single paper by its unique ID.
   */
  getPaperById: async (id: number): Promise<Paper> => {
    try {
      const response = await fetch(`${API_BASE_URL}/papers/${id}`);
      if (!response.ok) {
        throw new ApiError(
          `Error ${response.status}: Failed to fetch paper details`,
        );
      }
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },

  updateQuestion: async (
    questionId: number,
    questionData: QuestionUpdate,
  ): Promise<Paper> => {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });
      if (!response.ok) {
        throw new ApiError(
          `Error ${response.status}: Failed to update question`,
        );
      }
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },
  saveGradeDistribution: async (
    paperId: number,
    data: GradeDistribution,
  ): Promise<GradeDistribution> => {
    try {
      const response = await fetch(`${API_BASE_URL}/papers/${paperId}/grades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new ApiError(`Error ${response.status}`);
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },

  getGradeDistribution: async (paperId: number): Promise<GradeDistribution> => {
    try {
      const response = await fetch(`${API_BASE_URL}/papers/${paperId}/grades`);
      if (!response.ok) {
        // It's okay if it's not found, just return null
        if (response.status === 404) return null;
        throw new ApiError(`Error ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },
  /**
   * Fetches the list of all papers with their calculated metrics.
   */
  getPaperMetrics: async (): Promise<Paper[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/papers/metrics`);
      if (!response.ok) {
        throw new ApiError(
          `Error ${response.status}: Failed to fetch paper metrics`,
        );
      }
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },

  /**
   * Fetches the list of all available topics from the database.
   */
  getAvailableTopics: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/topics/available`);
      if (!response.ok) {
        throw new ApiError(
          `Error ${response.status}: Failed to fetch available topics`,
        );
      }
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },

  savePaperDashboard: async (paperId: number, payload: any): Promise<any> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/papers/${paperId}/dashboard`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload }),
        },
      );
      if (!response.ok) {
        const text = await response.text();
        throw new ApiError(`Error ${response.status}: ${text}`);
      }
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },

  /**
   * Fetches the saved dashboard metrics for a specific paper.
   */
  getPaperDashboard: async (paperId: number): Promise<any | null> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/papers/${paperId}/dashboard`,
      );
      if (response.status === 404) return null;
      if (!response.ok) {
        const text = await response.text();
        throw new ApiError(`Error ${response.status}: ${text}`);
      }
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },

  // 30 oct
  /**
   * Saves the student choice statistics for multiple questions.
   * @param data The payload matching schemas.StudentChoiceData
   */
  saveStudentChoiceStatistics: async (
    data: StudentChoiceData,
  ): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/statistics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Body should be { "questions": [...] }
      });

      // This endpoint returns 204 No Content on success
      // So we just check 'ok' and do not try to parse a JSON response
      if (!response.ok) {
        const text = await response.text();
        throw new ApiError(
          `Error ${response.status}: Failed to save statistics: ${text}`,
        );
      }
    } catch (error) {
      throw new ApiError(
        `Failed to save student choice statistics: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  },

  /**
   * API call to generate AI insights for a specific paper.
   */
  generateAIAnalysis: async (paperId: number): Promise<PaperAnalysis> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/papers/${paperId}/ai-analysis`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new ApiError(`Error ${response.status}: ${errorMessage}`);
      }
      return await response.json();
    } catch (error) {
      throw new ApiError(
        `Failed to generate AI analysis: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  },
  /**
   * Fetches the saved AI analysis for a specific paper, returning null if not found.
   */
  getAIAnalysis: async (paperId: number): Promise<PaperAnalysis | null> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/papers/${paperId}/ai-analysis`,
      );

      // If it hasn't been generated yet, just return null
      if (response.status === 404) return null;

      if (!response.ok) {
        const text = await response.text();
        throw new ApiError(`Error ${response.status}: ${text}`);
      }
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },
  // --- Comparison API Calls ---
  getAllComparisons: async (): Promise<PaperComparisonDB[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/papers/comparisons/all`);
      if (!response.ok) throw new ApiError(`Error ${response.status}`);
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },

  generateComparison: async (
    baselineId: number,
    comparisonId: number,
  ): Promise<PaperComparisonDB> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/papers/compare/${baselineId}/${comparisonId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok) {
        const text = await response.text();
        throw new ApiError(`Error ${response.status}: ${text}`);
      }
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },

  getComparison: async (
    baselineId: number,
    comparisonId: number,
  ): Promise<PaperComparisonDB | null> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/papers/compare/${baselineId}/${comparisonId}`,
      );
      if (response.status === 404) return null;
      if (!response.ok) throw new ApiError(`Error ${response.status}`);
      return await response.json();
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },
};

export default Api;
