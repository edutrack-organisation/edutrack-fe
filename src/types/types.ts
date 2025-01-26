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
    topics: string[];
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
