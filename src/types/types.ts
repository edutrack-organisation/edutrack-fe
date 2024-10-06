export type Handlers = {
    [key: string]: (...args: any[]) => void;
};

export interface DataItem {
    question_uuid: number;
    description: string;
    topics: string[];
    difficulty: number;
}
