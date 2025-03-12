export interface Topic {
    id: number;
    title: string;
}

export interface QuestionFromDB {
    id: number;
    paper_id: number;
    question_number: number;
    description: string;
    topics: Topic[];
    mark: number;
    difficulty: number;
}
