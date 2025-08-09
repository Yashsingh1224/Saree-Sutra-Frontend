import { createContext, useState, useEffect } from "react";
import { loginUser, signupUser } from "../../utils/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Try to restore user from localStorage on app load
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        if (data?.token) {
            setUser(data.user);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        }
        return data;
    };

    const signup = async (name, email, password) => {
        const data = await signupUser(name, email, password);
        if (data?.token) {
            setUser(data.user);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        }
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
