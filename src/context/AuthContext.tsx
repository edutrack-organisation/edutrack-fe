import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthContextType, AuthState, User } from '../types/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState | null>(null);
    const login = (user: User) => {
        setState({ user });
    };
    const logout = () => {
        setState(null);
    };

    return (
        <AuthContext.Provider value={{ state, setState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthState = (): AuthContextType => useContext(AuthContext)!;
