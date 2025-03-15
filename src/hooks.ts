/**
 * Global custom hooks used throughout the application
 * Contains reusable React hooks for:
 * - Data fetching
 * - State management
 * - API interactions
 */

import { useState } from "react";
import toast from "react-hot-toast";
import { Topic } from "./components/GeneratePaper/types";
import { generatePaperApi } from "./components/GeneratePaper/generatePaperApi";

// Topic-related hooks
export const useTopics = () => {
    const [topics, setTopics] = useState<Topic[]>([]); // List of available topics fetched from the database
    const [isFetchingTopics, setIsFetchingTopics] = useState(false); // Loading state for topics fetch operation

    const fetchTopics = async () => {
        try {
            setIsFetchingTopics(true);
            const topics = await generatePaperApi.fetchTopics();
            setTopics(topics);
        } catch (error) {
            toast.error("Failed to fetch list of topics");
        } finally {
            setIsFetchingTopics(false);
        }
    };

    return { topics, isFetchingTopics, fetchTopics };
};
