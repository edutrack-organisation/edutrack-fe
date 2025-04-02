import { DatasetElementType } from "@mui/x-charts/internals";

export type Handlers = {
    [key: string]: (...args: any[]) => void;
};

export interface DataItem {
    description: string;
    topics: string[];
    mark: number;
    difficulty: number;
}

export interface DataItemWithUUID extends DataItem {
    uuid: string;
}

// Objects
export interface CourseItem {
    courseId: number;
    courseTitle: string;
    papers?: PaperItem[];
};

export interface PaperItem {
    paperId: number;
    paperTitle: string;
    questions?: QuestionItem[];
    studentScores?: number[][];
};

export interface QuestionItem {
    questionId: number;
    questionNumber: number;
    description: string;
    topics: string[]; // TODO: use TopicItem in the future
    marks: number;
    difficulty: number;
};

// Context
export interface AuthContextType {
    userId: number | null;
    setUserId: React.Dispatch<React.SetStateAction<number | null>>;
    login: (userId: number) => void;
    logout: () => void;
};

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
