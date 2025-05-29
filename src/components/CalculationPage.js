import React, { useState, useEffect } from "react";
import Card from "./Card";
import SideBarStorage from "./SideBarStorage";
import SideBarAdvert from "./SideBarAdvert";

const CalculationPage = () => {
    const [visibleSector, setVisibleSector] = useState(1);
    const [expandedGroup, setExpandedGroup] = useState("Категория");
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [series, setSeries] = useState([]);
    const [fields, setFields] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [formData, setFormData] = useState({});

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const API_MEDIA_URL = process.env.REACT_APP_API_MEDIA;
    const placeholderImage = `${API_MEDIA_URL}/media/placeholder.png`;

    // Загрузка категорий
    useEffect(() => {
        fetch(`${API_BASE_URL}/categories/`)
          .then(response => {
            if (!response.ok) throw new Error("Ошибка загрузки категорий");
            return response.json();
          })
          .then(data => setCategories(data))
          .catch(error => {
            console.error("Ошибка загрузки категорий:", error);
            alert("Не удалось загрузить категории. Попробуйте позже.");
          });
      }, []);

    // Загрузка типов для выбранной категории
    useEffect(() => {
        if (selectedCategory) {
            fetch(`${API_BASE_URL}/types/?category_id=${selectedCategory}`)
                .then(response => {
                  if (!response.ok) throw new Error("Ошибка загрузки категорий");
                  return response.json();
                })
                .then(data => setTypes(data))
                .catch(error => {
            console.error("Ошибка загрузки типов продукции:", error);
            alert("Не удалось загрузить типы продукции. Попробуйте позже.");
          });
        }
    }, [selectedCategory]);

    // Загрузка серий для выбранного типа
    useEffect(() => {
        if (selectedType) {
            fetch(`${API_BASE_URL}/series/?type_id=${selectedType}`)
                .then(response => {
                  if (!response.ok) throw new Error("Ошибка загрузки категорий");
                  return response.json();
                })
                .then(data => setSeries(data))
                .catch(error => {
            console.error("Ошибка загрузки серий:", error);
            alert("Не удалось загрузить серии. Попробуйте позже.");
          });
        }
    }, [selectedType]);

    // Загрузка полей для расчета себестоимости
    useEffect(() => {
        if (selectedSeries) {
            fetch(`${API_BASE_URL}/product-fields/?series_id=${selectedSeries}`)
                .then(response => response.json())
                .then(data => setFields(data))
                .catch(error => console.error("Ошибка загрузки полей:", error));
        }
    }, [selectedSeries]);

    // Обработка выбора категории
    const selectCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        setExpandedGroup("Тип");
        setSelectedType(null);
        setSelectedSeries(null);
    };

    // Обработка выбора типа
    const selectType = (typeId) => {
        setSelectedType(typeId);
        setExpandedGroup("Серия");
        setSelectedSeries(null);
    };

    // Обработка выбора серии
    const selectSeries = (seriesId) => {
        setSelectedSeries(seriesId);
        setVisibleSector(2);
    };

    // Обработка изменения данных в форме
    const handleFieldChange = (fieldId, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldId]: value,
        }));
    };

    // Расчет себестоимости
    const calculate = () => {
        const dataString = fields.map((field) => {
            if (field.field_type === "boolean") {
                return formData[field.id] ? "крашен." : "некраш.";
            }
            return formData[field.id];
        }).join("/");

        fetch(`${API_BASE_URL}/calculate-cost/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                series_id: selectedSeries,
                data: dataString,
            }),
        })
            .then(response => response.json())
            .then(result => {
                alert(`Расчет завершен! Себестоимость: ${result.cost}`);
                setVisibleSector(3);
            })
            .catch(error => console.error("Ошибка расчета:", error));
    };

    return (
        <main>
            <div className="calculation-page">
                {/* Сектор 1: Выбор продукции */}
                {visibleSector >= 1 && (
                    <section className="sector-window choise">
                        <h2>Выберите продукцию</h2>

                        {/* Категории */}
                        <div className="choise-category">
                            <h3 onClick={() => setExpandedGroup("Категория")}>Категория</h3>
                            {expandedGroup === "Категория" && (
                                <div className="choise-catrgory-items">
                                    {categories.map((category) => (
                                        <Card
                                            key={category.id}
                                            image={category.image ? `${API_MEDIA_URL}${category.image}` : placeholderImage}
                                            title={category.name}
                                            onClick={() => selectCategory(category.id)}
                                            isSelected={selectedCategory === category.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Типы */}
                        {selectedCategory && (
                            <div className="choise-type">
                                <h3 onClick={() => setExpandedGroup("Тип")}>Тип</h3>
                                {expandedGroup === "Тип" && (
                                    <div className="choise-type-items">
                                        {types.map((type) => (
                                            <Card
                                                key={type.id}
                                                image={type.image ? `${API_MEDIA_URL}${type.image}` : placeholderImage}
                                                title={type.name}
                                                onClick={() => selectType(type.id)}
                                                isSelected={selectedType === type.id}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Серии */}
                        {selectedType && (
                            <div className="choise-seria">
                                <h3 onClick={() => setExpandedGroup("Серия")}>Серия</h3>
                                {expandedGroup === "Серия" && (
                                    <div className="choise-seria-items">
                                        {series.map((serie) => (
                                            <Card
                                                key={serie.id}
                                                image={serie.image ? `${API_MEDIA_URL}${serie.image}` : placeholderImage}
                                                title={serie.name}
                                                onClick={() => selectSeries(serie.id)}
                                                isSelected={selectedSeries === serie.id}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                )}

                {/* Сектор 2: Указание характеристик */}
                {visibleSector >= 2 && (
                    <section className="sector-window characreristics">
                        <h2>Укажите характеристики изделия</h2>
                        <form className="form">
                            {fields.map((field) => (
                                <label key={field.id}>
                                  {field.field_name}
                                  {field.field_type === "boolean" ? (
                                    <select
                                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                    >
                                      <option value="true">{field.custom_true || "Да"}</option>
                                      <option value="false">{field.custom_false || "Нет"}</option>
                                    </select>
                                  ) : field.field_type === "number" ? (
                                    <input
                                      type="number"
                                      placeholder={`Введите ${field.field_name}`}
                                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                    />
                                  ) : field.field_type === "select" ? (
                                    <select
                                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                    >
                                      {field.options.map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  ) : null}
                                </label>
                              ))}
                        </form>
                        <button className="btn-calculate" onClick={calculate}>
                            Рассчитать
                        </button>
                    </section>
                )}

                {/* Сектор 3: Результат расчета */}
                {visibleSector >= 3 && (
                    <section className="sector-window result">
                        <h2>Результат расчёта стоимости:</h2>
                        <p>Категория: {categories.find((c) => c.id === selectedCategory)?.name}</p>
                        <p>Тип: {types.find((t) => t.id === selectedType)?.name}</p>
                        <p>Серия: {series.find((s) => s.id === selectedSeries)?.name}</p>
                        <p>Характеристики: {fields.map((f) => {
                            const value = formData[f.id];
                            if (f.field_type === "boolean") {
                                return `${f.field_name}: ${value ? "крашен." : "некраш."}`;
                            }
                            return `${f.field_name}: ${value}`;
                        }).join(", ")}</p>
                    </section>
                )}
            </div>

            {/* Боковая панель */}
            <div className="side-bars">
                <SideBarStorage />
                <SideBarAdvert />
            </div>
        </main>
    );
};

export default CalculationPage;