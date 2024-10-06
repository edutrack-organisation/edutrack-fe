export type Handlers = {
    [key: string]: (...args: any[]) => void;
};

export interface DataItem {
    question: number;
    description: string;
    topics: string[];
    difficulty: number;
}
