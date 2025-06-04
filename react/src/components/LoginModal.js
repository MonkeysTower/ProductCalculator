import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookieUtils";

const LoginModal = ({ onClose, onLogin, onRegister }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken":  getCookie("csrftoken")
                },
                body: JSON.stringify({ username, password }),
                credentials: "include",
            });
            const data = await response.json();
            if (data.access && data.refresh) {
                localStorage.setItem("accessToken", data.access);
                localStorage.setItem("refreshToken", data.refresh); 
                onLogin();
                navigate("/calculation");
            } else {
                alert(data.message || "Ошибка входа.");
            }
        } catch (error) {
            console.error("Ошибка входа:", error);
            alert("Не удалось выполнить вход. Попробуйте позже.");
        }
    };

    return (
        <div className="login-modal">
            <div className="modal-content">
                <h2>Вход в систему</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Логин <br />
                        <input
                            type="text"
                            placeholder="Имя пользователя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <label>
                        Пароль <br />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className='remember-btn' type="button">Забыли пароль?</button>
                    </label>
                    <button className="main-btn" type="submit">Войти</button>
                    <button className="additional-btn" type="button" onClick={onRegister}>
                        Регистрация
                    </button>
                    <button className="additional-btn" type="button" onClick={onClose}>
                        Назад
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;