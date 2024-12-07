import React, { useState } from "react";
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

// Компонент PrivateRoute для проверки авторизации
const PrivateRoute = ({ isLoggedIn, children }) => {
    return isLoggedIn ? children : <Navigate to="/" replace />;
};

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние авторизации
    const [showLoginModal, setShowLoginModal] = useState(false); // Управление модальным окном входа
    const [showRegistrationModal, setShowRegistrationModal] = useState(false); // Управление модальным окном регистрации
    const [showSupportModal, setShowSupportModal] = useState(false); // Управление модальным окном поддержки

    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowLoginModal(false);
    };
    const handleSubmit = (formData) => {
        console.log("Отправленные данные:", formData);
        alert("Ваша заявка успешно отправлена!");
    };

    const unautorization = () => setIsLoggedIn(false); // Функция выхода из системы

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

    return (
        <Router>
            <div className="App">
                <Header toggleLoginModal={toggleLoginModal} OutSistem={unautorization} isLoggedIn={isLoggedIn} />
                <Routes>
                    <Route
                        path="/"
                        element={<MainPage />}
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