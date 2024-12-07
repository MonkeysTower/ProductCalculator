import React, { useState } from "react";

const SupportModal = ({ onClose, onSubmit }) => {
    const [username, setUsername] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        if (!username || !contactInfo || !subject || !message) {
            alert("Пожалуйста, заполните все поля!");
            return;
        }
        onSubmit({ username, contactInfo, subject, message }); // Передаём данные в родительский компонент
        onClose(); // Закрываем модальное окно
    };

    return (
        <div className="support-modal">
            <div className="modal-content">
                <h2 className="modal-title">Форма заявки в тех.поддержку</h2>
                <form>
                    <label className="form-label">Ваше имя:<br/>
                      <input
                          type="text"
                          className="form-input"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Введите ваше имя"
                    /></label>
                    <label className="form-label">Контактная информация:<br/>
                      <input
                          type="text"
                          className="form-input"
                          value={contactInfo}
                          onChange={(e) => setContactInfo(e.target.value)}
                          placeholder="Email или телефон"
                    /></label>
                    <label className="form-label">Тема обращения:<br/>
                      <input
                          type="text"
                          className="form-input"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Кратко опишите тему"
                    /></label>
                    <label className="form-label">Сообщение:<br/>
                      <textarea
                        className="form-textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Опишите вашу проблему"
                    /></label>
                    <div className="modal-actions">
                      <button className="main-btn" onClick={handleSubmit}>
                        Отправить заявку
                      </button>
                      <button className="additional-btn" onClick={onClose}>
                        Закрыть форму
                      </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SupportModal;