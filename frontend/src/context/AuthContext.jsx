import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try to get user from localStorage on load
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
            email,
            password,
        });
        const userData = res.data.metadata.user;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
    };

    const register = async (name, email, password) => {
        const res = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
            name,
            email,
            password,
        });
        const userData = res.data.metadata.user;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
    };

    const logout = async () => {
        try {
            await api.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (e) {
            console.error("Logout API error", e);
        }
        setUser(null);
        localStorage.removeItem("user");
    };

    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, updateUser, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
