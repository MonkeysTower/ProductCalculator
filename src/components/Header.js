import React from "react";
import { Link } from 'react-router-dom';

const Header = ({ toggleLoginModal,OutSistem, isLoggedIn }) => {

  return (
    <header className="header">
      <div className="logo">
        <h1>Finist</h1>
      </div>
      <nav className="nav-links">
        <Link to="/">Главная</Link>
        <Link to="/about-us">О нас</Link>
        <Link to="/contacts">Контакты</Link>
      </nav>
      <div className="auth-buttons">
        {!isLoggedIn && <button onClick={toggleLoginModal}>Войти</button>}
        {isLoggedIn && <button onClick={OutSistem}>Выйти</button>}
      </div>
    </header>
  );
};

export default Header;