import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import RegistrationModal from "./components/RegistrationModal";
import CalculationPage from "./components/CalculationPage";
import MainPage from "./components/MainPage";
import AboutUs from "./components/AboutUs";
import Contacts from "./components/Contacts";
import SupportModal from "./components/SupportModal";
import Footer from "./components/Footer";
import "./styles/App.css";
import { getCookie } from "./utils/cookieUtils";

// Компонент PrivateRoute для проверки авторизации
const PrivateRoute = ({ isLoggedIn, children }) => {
    return isLoggedIn ? children : <Navigate to="/" replace />;
};

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowLoginModal(false);
    };
    const handleSubmit = (formData) => {
        console.log("Отправленные данные:", formData);
        alert("Ваша заявка успешно отправлена!");
    };

    const unautorization = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
        try {
            await fetch(`${API_BASE_URL}/logout/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken":  getCookie("csrftoken")
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Ошибка выхода:", error);
        }
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    };

    const toggleLoginModal = () => setShowLoginModal((prev) => !prev);
    const toggleRegistrationModal = () => {
        setShowRegistrationModal((prev) => !prev);
        setShowLoginModal((prev) => !prev);
    };
    const toggleSupportModal = () => {
        setShowRegistrationModal(false);
        setShowLoginModal(false);
        setShowSupportModal((prev) => !prev)
    };

    useEffect(() => {
        const initializeApp = async() => {
            // 1. Получение CSRF токена
            try {
                const csrfResponse = await fetch(`${API_BASE_URL}/get-csrf-token/`, {
                    credentials: "include",
                });
                const csrfData = await csrfResponse.json();
                console.log('CSRF-токен: ', csrfData.csrfToken)
            } catch (error) {
                console.error("Ошибка получения CSRF-токена:", error);
            }

            // 2. Проверка JWT токена
            const storedToken = localStorage.getItem("accessToken");
            if (storedToken) {
                try {
                     const response = await fetch(`${API_BASE_URL}/token/verify/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRFToken":  getCookie("csrftoken")
                        },
                        body: JSON.stringify({ token: storedToken }),
                        credentials: "include",
                    });
                    if (response.ok) {
                        setIsLoggedIn(true);
                    } else {
                        setIsLoggedIn(false);
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                    }
                } catch (error) {
                    console.error("Ошибка проверки токена:", error);
                }
            }
        };

        initializeApp();
    }, [API_BASE_URL]);

    return (
        <Router>
            <div className="App">
                <Header
                    toggleLoginModal={toggleLoginModal}
                    OutSistem={unautorization}
                    isLoggedIn={isLoggedIn}
                />
                <Routes>
                    <Route
                        path="/"
                        element={<MainPage isLoggedIn={isLoggedIn}/>}
                    />
                    <Route
                        path="/calculation"
                        element={
                            <PrivateRoute isLoggedIn={isLoggedIn}>
                                    <CalculationPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/contacts" element={<Contacts />} />
                </Routes>
                <Footer onSupport={toggleSupportModal} />

                {/* Модальные окна */}
                {showLoginModal && (
                    <LoginModal
                        onClose={toggleLoginModal}
                        onLogin={handleLogin}
                        onRegister={toggleRegistrationModal}
                    />
                )}
                {showRegistrationModal && <RegistrationModal onClose={toggleRegistrationModal} />}
                {showSupportModal && (
                    <SupportModal
                        onClose={toggleSupportModal}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </Router>
    );
};

export default App;