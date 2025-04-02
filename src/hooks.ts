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
// Retreive the topics available in databsse
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

// Retrieves the complete list of predefined topics from Excel file
export const usePredefinedTopics = () => {
    const [predefinedTopics, setPredefinedTopics] = useState<string[]>([]); // List of predefined topics fetched from the Excel file
    const [isFetchingPredefinedTopics, setIsFetchingPredefinedTopics] = useState(false); // Loading state for predefined topics fetch operation

    const fetchPredefinedTopics = async () => {
        try {
            setIsFetchingPredefinedTopics(true);
            const predefinedTopic = await generatePaperApi.fetchPredefinedTopics();
            setPredefinedTopics(predefinedTopic);
        } catch (error) {
            toast.error("Failed to fetch list of predefined topics");
        } finally {
            setIsFetchingPredefinedTopics(false);
        }
    };

    return { predefinedTopics, isFetchingPredefinedTopics, fetchPredefinedTopics };
};
