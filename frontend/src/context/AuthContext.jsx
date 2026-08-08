import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get(API_ENDPOINTS.USERS.ME);
                setUser(res.data.metadata);
            } catch (error) {
                console.error("Session verification failed", error);
                setUser(null);
                localStorage.removeItem("user");
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, []);

    const login = async (email, password) => {
        const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
            email,
            password,
        });
        let userData = res.data.metadata.user;
        try {
            const profileRes = await api.get(API_ENDPOINTS.USERS.ME);
            if (profileRes.data?.metadata) {
                userData = profileRes.data.metadata;
            }
        } catch (e) {
            console.warn("Could not fetch full user profile on login", e);
        }
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
    };

    const register = async (name, email, password, birthday, gender) => {
        const res = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
            name,
            email,
            password,
            birthday,
            gender,
        });
        let userData = res.data.metadata.user;
        try {
            const profileRes = await api.get(API_ENDPOINTS.USERS.ME);
            if (profileRes.data?.metadata) {
                userData = profileRes.data.metadata;
            }
        } catch (e) {
            console.warn("Could not fetch full user profile on register", e);
        }
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
