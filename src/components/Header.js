import React from "react";

const Header = ({ toggleLoginModal,OutSistem, isLoggedIn }) => {

  return (
    <header className="header">
      <div className="logo">
        <h1>Finist</h1>
      </div>
      <nav className="nav-links">
        <a href="https://f-inox.ru/" target="_blank">Главная</a>
        <a href="https://f-inox.ru/o-kompanii/" target="_blank">О нас</a>
        <a href="https://f-inox.ru/contacts/" target="_blank">Контакты</a>
      </nav>
      <div className="auth-buttons">
        {!isLoggedIn && <button onClick={toggleLoginModal}>Войти</button>}
        {isLoggedIn && <button onClick={OutSistem}>Выйти</button>}
      </div>
    </header>
  );
};

export default Header;