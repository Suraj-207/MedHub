import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    user: null,
    payment:"",
    token: null,
    login: () => {},
    logout: () => {}
});