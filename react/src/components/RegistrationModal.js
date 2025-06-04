import React, { useState } from "react";
import { getCookie } from "../utils/cookieUtils";

const RegistrationModal = ({ onClose }) => {
    const [companyName, setCompanyName] = useState("");
    const [inn, setInn] = useState("");
    const [region, setRegion] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleSubmit = async (e) => {
        if (!companyName || !inn || !region || !phone || !email) {
            alert("Пожалуйста, заполните все поля!");
            return;
        }
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/register/`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-CSRFToken":  getCookie("csrftoken")
                },
                body: JSON.stringify({
                    company_name: companyName,
                    inn,
                    region,
                    phone,
                    email,
                }),
                credentials: "include",
            });
            const data = await response.json();
            if (data.success) {
                alert(data.message || "Данные для регистрации отправленны администратору. С вами скоро свяжутся");
                onClose();
            } else {
                alert(data.message || "Ошибка регистрации.");
            }
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            alert("Не удалось зарегистрироваться. Попробуйте позже.");
        }
    };

    return (
        <div className="reg-modal">
            <div className="modal-content">
                <h2>Регистрация</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Название компании<br />
                        <input
                            type="text"
                            placeholder="ООО 'Ромашка'"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </label>
                    <label>
                        ИНН<br />
                        <input
                            type="text"
                            placeholder="ИНН организации"
                            value={inn}
                            onChange={(e) => setInn(e.target.value)}
                        />
                    </label>
                    <label>
                        Регион<br />
                        <input
                            type="text"
                            placeholder="Регион"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        />
                    </label>
                    <label>
                        Контактный телефон<br />
                        <input
                            type="tel"
                            placeholder="Номер телефона"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </label>
                    <label>
                        Электронная почта (необ.)<br />
                        <input
                            type="email"
                            placeholder="Электронная почта"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <button className="main-btn" type="submit">Зарегистрироваться</button>
                    <button className="additional-btn" type="button" onClick={onClose}>Назад</button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationModal;