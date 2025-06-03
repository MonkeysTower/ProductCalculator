import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = ({ toggleLoginModal, OutSistem, isLoggedIn }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>Finist</h1>
      </div>

      <nav className="nav-links desktop-only">
        <Link to="/">Главная</Link>
        {isLoggedIn && <Link to="/calculation">Калькулятор</Link>}
        <Link to="/about-us">О нас</Link>
        <Link to="/contacts">Контакты</Link>
      </nav>

      <div className="auth-buttons desktop-only">
        {!isLoggedIn && <button onClick={toggleLoginModal}>Войти</button>}
        {isLoggedIn && <button onClick={OutSistem}>Выйти</button>}
      </div>

      <button className="menu-toggle mobile-only" onClick={toggleMenu}>
        ☰
      </button>

      <nav className={`mobile-only nav-links-mobile ${isMenuOpen ? "open" : ""}`}>
        <Link to="/" onClick={toggleMenu}>Главная</Link>
        {isLoggedIn && <Link to="/calculation" onClick={toggleMenu}>Калькулятор</Link>}
        <Link to="/about-us" onClick={toggleMenu}>О нас</Link>
        <Link to="/contacts" onClick={toggleMenu}>Контакты</Link>
        <div className="auth-buttons-mobile">
          {!isLoggedIn && <button onClick={toggleLoginModal}>Войти</button>}
          {isLoggedIn && <button onClick={OutSistem}>Выйти</button>}
        </div>
      </nav>
    </header>
  );
};

export default Header;