import React, { useState } from "react";

const RegistrationModal = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [inn, setInn] = useState("");
  const [region, setRegion] = useState("");
  const [telNumber, setTelNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email == "") {
      console.log("Данные регистрации:", { username, inn, region, telNumber });
      alert("Регистрация прошла успешно!");
      onClose();
    }
    else {
      console.log("Данные регистрации:", { username, inn, region, telNumber, email });
      alert("Регистрация прошла успешно!");
      onClose();
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              value={telNumber}
              onChange={(e) => setTelNumber(e.target.value)}
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
          <div className="modal-actions">
            <button className='main-btn' type="submit">Зарегистрироваться</button>
            <button className='additional-btn' type="button" onClick={onClose}>Назад</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;