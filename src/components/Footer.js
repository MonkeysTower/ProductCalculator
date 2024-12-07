import React from "react";

const Footer = ({ onSupport }) => {

  return (
    <footer>
      <div className="contact-info">
        <p>Екатеринбург, у.Улица, д.Дом</p>
        <p>Email: Trifandre@yandex.ru</p>        
      </div>
      <div>
        <button className="support-button" type="button" onClick={onSupport}>Техподдержка</button>
      </div>
      <div className="my-info">
        <p>Designed by <i><a href="https://vk.com/fyl94">Dostovalov Andrey</a></i></p>
      </div>
    </footer>
  );
};

export default Footer;