import React, { useState } from "react";
import Card from "./Card";
import ImageAnon from "../images/placeholder.png";

const CalculationPage = () => {
  const [visibleSector, setVisibleSector] = useState(1); // Tracks visible sector (1, 2, or 3)
  const [expandedGroup, setExpandedGroup] = useState("Категория"); // Which group is expanded
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category
  const [selectedType, setSelectedType] = useState(""); // Selected type
  const [selectedSeries, setSelectedSeries] = useState(""); // Selected series

  const toggleGroup = (groupName) => {
    setExpandedGroup(expandedGroup === groupName ? "" : groupName);
  };
  // Handles category selection and moves to the next group
  const selectCategory = (category) => {
    setSelectedCategory(category);
    setExpandedGroup("Тип");
  };
  // Handles type selection and moves to the next group
  const selectType = (type) => {
    setSelectedType(type);
    setExpandedGroup("Серия");
  };
  // Handles series selection and makes the second sector visible
  const selectSeries = (series) => {
    setSelectedSeries(series);
    setVisibleSector(2); 
  };
  // Handles the calculation and makes the third sector visible
  const calculate = () => {
    setVisibleSector(3); 
  };

  return (
    <div className="calculation-page">
      {visibleSector >= 1 && (
        <section className="sector-window choise">
          <h2>Выберите продукцию</h2>

          <div className="choise-category">
            <h3 onClick={() => toggleGroup("Категория")}>Категория</h3>
            {expandedGroup === "Категория" && (
              <div className="choise-catrgory-items">
                <Card
                  image={ImageAnon}
                  title="Нейтральное"
                  onClick={() => selectCategory("Нейтральное")}
                  isSelected={selectedCategory === "Нейтральное"}
                />
                <Card
                  image={ImageAnon}
                  title="Тепловое"
                  onClick={() => selectCategory("Тепловое")}
                  isSelected={selectedCategory === "Тепловое"}
                />
                <Card
                  image={ImageAnon}
                  title="Холодильное"
                  onClick={() => selectCategory("Холодильное")}
                  isSelected={selectedCategory === "Холодильное"}
                />
              </div>
            )}
          </div>

          {selectedCategory && (
            <div className="choise-type">
              <h3 onClick={() => toggleGroup("Тип")}>Тип</h3>
              {expandedGroup === "Тип" && (
                <div className="choise-type-items">
                  <Card
                    image={ImageAnon}
                    title="Зонты"
                    onClick={() => selectType("Зонты")}
                    isSelected={selectedType === "Зонты"}
                  />
                  <Card
                    image={ImageAnon}
                    title="Стелажи"
                    onClick={() => selectType("Стелажи")}
                    isSelected={selectedType === "Стелажи"}
                  />
                  <Card
                    image={ImageAnon}
                    title="Ванны"
                    onClick={() => selectType("Ванны")}
                    isSelected={selectedType === "Ванны"}
                  />
                </div>
              )}
            </div>
          )}

          {selectedType && (
            <div className="choise-seria">
              <h3 onClick={() => toggleGroup("Серия")}>Серия</h3>
              {expandedGroup === "Серия" && (
                <div className="choise-seria-items">
                  <Card
                    image={ImageAnon}
                    title="ЗВН-01"
                    onClick={() => selectSeries("ЗВН-01")}
                    isSelected={selectedSeries === "ЗВН-01"}
                  />
                  <Card
                    image={ImageAnon}
                    title="ЗВН-02"
                    onClick={() => selectSeries("ЗВН-02")}
                    isSelected={selectedSeries === "ЗВН-02"}
                  />
                  <Card
                    image={ImageAnon}
                    title="ЗВН-03"
                    onClick={() => selectSeries("ЗВН-03")}
                    isSelected={selectedSeries === "ЗВН-03"}
                  />
                  <Card
                    image={ImageAnon}
                    title="ЗВН-04"
                    onClick={() => selectSeries("ЗВН-04")}
                    isSelected={selectedSeries === "ЗВН-04"}
                  />
                  <Card
                    image={ImageAnon}
                    title="ЗВН-05"
                    onClick={() => selectSeries("ЗВН-05")}
                    isSelected={selectedSeries === "ЗВН-05"}
                  />
                  <Card
                    image={ImageAnon}
                    title="ЗВН-06"
                    onClick={() => selectSeries("ЗВН-06")}
                    isSelected={selectedSeries === "ЗВН-06"}
                  />
                  <Card
                    image={ImageAnon}
                    title="ЗВН-07"
                    onClick={() => selectSeries("ЗВН-07")}
                    isSelected={selectedSeries === "ЗВН-07"}
                  />
                  <Card
                    image={ImageAnon}
                    title="ЗВН-08"
                    onClick={() => selectSeries("ЗВН-08")}
                    isSelected={selectedSeries === "ЗВН-08"}
                  />
                  <Card
                    image={ImageAnon}
                    title="ЗВН-99"
                    onClick={() => selectSeries("ЗВН-99")}
                    isSelected={selectedSeries === "ЗВН-99"}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {visibleSector >= 2 && (
        <section className="sector-window characreristics">
          <h2>Укажите характеристики изделия</h2>
          <form className="form">
            <label>
              Ширина, мм <br />
              <input type="text" placeholder="Введите ширину" />
            </label>
            <label>
              Глубина, мм <br />
              <input type="text" placeholder="Введите глубину" />
            </label>
            <label>
              Высота, мм <br />
              <input type="text" placeholder="Введите высоту" />
            </label>
          </form>
          <button className="btn-calculate" onClick={calculate}>
            Рассчитать
          </button>
        </section>
      )}

      {visibleSector >= 3 && (
        <section className="sector-window result">
          <h2>Результат расчёта стоимости:</h2>
          <p>Категория: {selectedCategory}</p>
          <p>Тип: {selectedType}</p>
          <p>Серия: {selectedSeries}</p>
        </section>
      )}
    </div>
  );
};

export default CalculationPage;