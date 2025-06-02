import React from "react";
import SideBarAdvert from "./SideBarAdvert";
import ArticleSection from "./ArticleSection";

const MainPage = ({ isLoggedIn }) => {
  return (
    <main>
      <div className="main-page">
        <div className="sector-window">
          <h2>Калькулятор себестоимости продукции Finist</h2>
          <p className="greeting-text">Здравствуйте, рады видеть вас на нашем сайте!</p>
           {isLoggedIn ? (
            <p>Вы можете использовать вкладку <b>"Калькулятор"</b> для расчета себестоимости продукции.</p>
          ) : (
            <p>Для начала работы с сервисом, пожалуйста, авторизуйтесь.<br/><br/>Если у вас нет профиля, заполните регистрационную форму (Войти -&#62; Регистрация) и наш менеджер с вами свяжется</p>
          )}
        </div>
        <div className="sector-window">
          <ArticleSection />
        </div>
      </div>
      <SideBarAdvert />
    </main>
  );
};

export default MainPage;