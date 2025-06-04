import { getCookie } from "../utils/cookieUtils";

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({ refresh: refreshToken }),
            credentials: "include",
        });
        const data = await response.json();
        if (data.access) {
            localStorage.setItem("accessToken", data.access);
            return data.access;
        }
        return null;
    } catch (error) {
        console.error("Ошибка обновления токена:", error);
        return null;
    }
};

export const fetchWithAuth = async (url, options = {}) => {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return null;

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.status === 401) {
        // Токен истек, пробуем обновить
        const newAccessToken = await refreshAccessToken();
        if (!newAccessToken) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            return null;
        }

        // Повторяем запрос с новым токеном
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${newAccessToken}`,
            },
        });
    }

    return response;
};