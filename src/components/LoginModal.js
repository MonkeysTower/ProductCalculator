import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ onClose, onLogin, onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(); // Потом доработать механизм проверки
    navigate("/calculation");
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
            /><br />
          </label>
          <label>
            Пароль <br />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /><br />
            <button className='remember-btn' type="button">Забыли пароль?</button>
          </label>
          <div className="modal-actions">
            <button className='main-btn' type="submit">Войти</button>
            <button className='additional-btn' type="button" onClick={onRegister}>
              Регистрация
            </button>
            <button className='additional-btn' type="button" onClick={onClose}>
              Назад
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;