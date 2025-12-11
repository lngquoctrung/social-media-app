export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/v1/access/login',
        REGISTER: '/api/v1/access/register',
        REFRESH: '/api/v1/access/refresh',
        LOGOUT: '/api/v1/access/logout',
    },
    POSTS: {
        LIST: '/api/v1/posts',
        CREATE: '/api/v1/posts',
        UPLOAD: '/api/v1/posts/upload-images',
        DETAIL: (id) => `/api/v1/posts/${id}`,
        UPDATE: (id) => `/api/v1/posts/${id}`,
        DELETE: (id) => `/api/v1/posts/${id}`,
    },
    USERS: {
        ME: '/api/v1/users/me',
        GET_ONE: (id) => `/api/v1/users/${id}`,
        UPDATE_PROFILE: '/api/v1/users/me',
        UPLOAD_AVATAR: '/api/v1/users/me/avatar',
    },
    COMMENTS: {
        LIST: (postId) => `/api/v1/comments/${postId}`,
        CREATE: '/api/v1/comments',
        DELETE: (id) => `/api/v1/comments/${id}`,
        UPDATE: (id) => `/api/v1/comments/${id}`,
    },
    LIKES: {
        TOGGLE: '/api/v1/likes/toggle',
        GET: (targetId) => `/api/v1/likes/${targetId}`,
    }
};
