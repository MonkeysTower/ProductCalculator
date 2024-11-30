import React, { useState } from "react";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import RegistrationModal from "./components/RegistrationModal";
import SideBarStorage from './components/SideBarStorage'
import CalculationPage from "./components/CalculationPage";
import MainPage from "./components/MainPage";
import SideBarAdvert from "./components/SideBarAdvert";
import "./styles/App.css";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние авторизации
    const [showLoginModal, setShowLoginModal] = useState(false); // Управление модальным окном входа
    const [showRegistrationModal, setShowRegistrationModal] = useState(false); // Управление модальным окном регистрации
    
    const handleLogin = () => {
          setIsLoggedIn(true);
          setShowLoginModal(false);
        
    };
    const unautorization = () => setIsLoggedIn((prev) => !prev);

    // Открытие/закрытие модальных окон
    const toggleLoginModal = () => setShowLoginModal((prev) => !prev);
    const toggleRegistrationModal = () => {
        setShowRegistrationModal((prev) => !prev);
        setShowLoginModal((prev) => !prev);
    };
  return (
    <div className="App">
        <Header toggleLoginModal={toggleLoginModal} OutSistem={unautorization} isLoggedIn={isLoggedIn} />
            {!isLoggedIn && (
                <main>
                    <MainPage />
                    <SideBarAdvert />
                </main>
                )}
            {showLoginModal && (
                <LoginModal
                onClose={toggleLoginModal}
                onLogin={handleLogin}
                onRegister={toggleRegistrationModal}
                />
            )}
            {showRegistrationModal && (
                <RegistrationModal
                onClose={toggleRegistrationModal}
                />
            )}
            {isLoggedIn && (
                <main>
                    <CalculationPage />
                    <div className="side-bars">
                        <SideBarStorage />
                        <SideBarAdvert />
                    </div>
                </main>
                )}
        <footer>
            <div className="contact-info">
                <p>Екатеринбург, у.Улица, д.Дом</p>
                <p>Email: Trifandre@yandex.ru</p>        
            </div>
            <div className="my-info">
                <p>Designed by <i><a href="https://vk.com/fyl94">Dostovalov Andrey</a></i></p>
            </div>
        </footer>
    </div>
  );
};

export default App;