import React, { useState } from "react";
import { getCookie } from "../utils/cookieUtils";

const SupportModal = ({ onClose }) => {
    const [username, setUsername] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleSubmit = async (e) => {
        if (!username || !contactInfo || !subject || !message) {
            alert("Пожалуйста, заполните все поля!");
            return;
        }
        e.preventDefault();
                try {
                    const response = await fetch(`${API_BASE_URL}/support/`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "X-CSRFToken":  getCookie("csrftoken")
                        },
                        body: JSON.stringify({
                            username,
                            contact_info: contactInfo,
                            subject,
                            message,
                        }),
                        credentials: "include",
                    });
                    const data = await response.json();
                    if (data.success) {
                        alert(data.message || "Ваши данные отправленны в техподдержку. С вами скоро свяжутся");
                        onClose();
                    } else {
                        alert(data.message || "Ошибка отправки.");
                    }
                } catch (error) {
                    console.error("Ошибка регистрации:", error);
                    alert("Не удалось отправить сообщение. Попробуйте позже.");
                }
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
                          required
                    /></label>
                    <label className="form-label">Контактная информация:<br/>
                      <input
                          type="text"
                          className="form-input"
                          value={contactInfo}
                          onChange={(e) => setContactInfo(e.target.value)}
                          placeholder="Email или телефон"
                          required
                    /></label>
                    <label className="form-label">Тема обращения:<br/>
                      <input
                          type="text"
                          className="form-input"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Кратко опишите тему"
                          required
                    /></label>
                    <label className="form-label">Сообщение:<br/>
                      <textarea
                        className="form-textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Опишите вашу проблему"
                        required
                    /></label>
                      <button className="main-btn" onClick={handleSubmit}>
                        Отправить заявку
                      </button>
                      <button className="additional-btn" onClick={onClose}>
                        Закрыть форму
                      </button>
                </form>
            </div>
        </div>
    );
};

export default SupportModal;