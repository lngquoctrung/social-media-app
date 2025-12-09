const API_BASE_URL = "http://localhost:5050/api/v1"; // Adjust port if needed

const auth = {
    setToken: (token, userId, user) => {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("user", JSON.stringify(user));
    },
    getToken: () => localStorage.getItem("accessToken"),
    getUserId: () => localStorage.getItem("userId"),
    getUser: () => JSON.parse(localStorage.getItem("user")),
    logout: () => {
        localStorage.clear();
        window.location.href = "index.html";
    },
    checkAuth: () => {
        if (!localStorage.getItem("accessToken")) {
            window.location.href = "index.html";
        }
    }
};

const api = {
    get: async (endpoint) => {
        const token = auth.getToken();
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return res.json();
    },
    post: async (endpoint, body) => {
        const token = auth.getToken();
        const headers = {
            "Authorization": `Bearer ${token}`
        };
        if (!(body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(body);
        }
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers,
            body
        });
        return res.json();
    },
    put: async (endpoint, body) => {
        const token = auth.getToken();
        const headers = {
            "Authorization": `Bearer ${token}`
        };
        if (!(body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(body);
        }
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PUT",
            headers,
            body
        });
        return res.json();
    },
    delete: async (endpoint) => {
        const token = auth.getToken();
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return res.json();
    }
};

// Validations
const validate = {
    isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    isEmpty: (str) => !str || str.trim().length === 0,
};
