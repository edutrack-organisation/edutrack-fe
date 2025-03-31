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
    topics: string[]; // TODO: use TopicItem in the future
    marks: number;
    difficulty: number;
};

// Topic stats
export interface TopicStats {
    [mainTopic: string]: {
      average: number; // Average of its subtopics’ percentages.
      subtopics: {
        [subtopic: string]: number; // Final percentage value for that subtopic.
      };
    };
  }

// Context
export interface AuthContextType {
    userId: number | null;
    setUserId: React.Dispatch<React.SetStateAction<number | null>>;
    login: (userId: number) => void;
    logout: () => void;
};
