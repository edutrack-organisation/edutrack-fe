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

export interface User { // TODO: discuss with backend to figure out exact details
    userId: number;
}

export interface AuthState { // TODO: discuss with backend to figure out exact details
    user: User | null;
}

export interface AuthContextType {
    state: AuthState | null;
    setState: React.Dispatch<React.SetStateAction<AuthState | null>>;
    login: (user: User) => void;
    logout: () => void;
}