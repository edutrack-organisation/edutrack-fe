import { DatasetElementType } from "@mui/x-charts/internals";

export type Handlers = {
    [key: string]: (...args: any[]) => void;
};

export interface DataItem {
    description: string;
    topics: string[];
    difficulty: number;
}

export interface DataItemWithUUID extends DataItem {
    uuid: string;
}

// Types for dashboard
export interface TopicFrequency {
    id: number;
    value: number;
    label: string;
}
// This is for each topic, rather than overall for the paper
export interface DifficultyFrequencyAndAverageDifficultyForTopic {
    label: string;
    topicDifficultyFrequency: DatasetElementType<
        string | number | Date | null | undefined
    >[]; // [{frequency, difficulty}...]
    topicAverageDifficulty: number;
}
