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
