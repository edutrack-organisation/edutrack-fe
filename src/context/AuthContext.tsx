import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthContextType } from '../types/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [userId, setUserId] = useState<number | null>(null);
    const login = (userId: number) => {
        setUserId(userId);
        localStorage.setItem('userId', (userId.toString()));
    };
    const logout = () => {
        setUserId(null);
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ userId, setUserId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => useContext(AuthContext)!;
