import React, { useState, useEffect } from "react";
import Card from "./Card";
import SideBarStorage from "./SideBarStorage";
import SideBarAdvert from "./SideBarAdvert";
import { fetchWithAuth } from "../utils/auth";

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
    const [calculationResult, setCalculationResult] = useState(null)

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const API_MEDIA_URL = process.env.REACT_APP_API_MEDIA;
    const placeholderImage = `${API_MEDIA_URL}/media/placeholder.png`;

    // Загрузка категорий
    useEffect(() => {
        fetchWithAuth(`${API_BASE_URL}/categories/`)
          .then(response => {
            if (!response.ok) throw new Error("Ошибка загрузки категорий");
            return response.json();
          })
          .then(data => setCategories(data))
          .catch(error => {
            console.error("Ошибка загрузки категорий:", error);
            alert("Не удалось загрузить категории. Попробуйте позже.");
          });
      }, [API_BASE_URL]);

    // Загрузка типов для выбранной категории
    useEffect(() => {
        if (selectedCategory) {
            fetchWithAuth(`${API_BASE_URL}/types/?category_id=${selectedCategory}`)
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
    }, [selectedCategory, API_BASE_URL]);

    // Загрузка серий для выбранного типа
    useEffect(() => {
        if (selectedType) {
            fetchWithAuth(`${API_BASE_URL}/series/?type_id=${selectedType}`)
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
    }, [selectedType, API_BASE_URL]);

    // Загрузка полей для расчета стоимости
    useEffect(() => {
        if (selectedSeries) {
            fetchWithAuth(`${API_BASE_URL}/product-fields/?series_id=${selectedSeries}`)
                .then(response => response.json())
                .then(data => {
                    // Устанавливаем начальные значения для всех полей
                    const initialFormData = data.reduce((acc, field) => {
                        if (field.field_type === "boolean") {
                            acc[field.id] = field.options[0]; // Первое значение из options
                        } else if (field.field_type === "number") {
                            acc[field.id] = ""; // Пустая строка по умолчанию для number
                        } else if (field.field_type === "select") {
                            acc[field.id] = field.options[0]; // Первое значение из options
                        } else {
                            acc[field.id] = "";
                        }
                        return acc;
                    }, {});
                    setFields(data);
                    setFormData(initialFormData);
                })
                .catch(error => console.error("Ошибка загрузки полей:", error));
        }
    }, [selectedSeries, API_BASE_URL]);

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
        const accessToken = localStorage.getItem("accessToken");
        const dataString = fields
            .map((field) => {
                const value = formData[field.id];
                if (field.field_type === "boolean") {
                    // Используем custom_true или custom_false в зависимости от значения
                    const optionIndex = field.options.indexOf(value);
                    return optionIndex === 0 ? field.custom_true : field.custom_false;
                }
                if (field.field_type === "number") {
                    return value || "0";
                }
                return value || "-";
            })
            .join("/");

        fetchWithAuth(`${API_BASE_URL}/calculate-cost/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                series_id: selectedSeries,
                data: dataString,
            }),
        })
            .then(response => {
                if (!response.ok) throw new Error("Ошибка расчета");
                return response.json();
            })
            .then(result => {
                setCalculationResult({
                    cost: result.cost,
                    formData: { ...formData },
                });
                setVisibleSector(3);
            })
            .catch(error => {
                console.error("Ошибка расчета:", error);
                alert("Не удалось выполнить расчет. Попробуйте позже.");
            });
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
                            {Array.isArray(fields) && fields.map((field) => (
                                <label key={field.id}>
                                    {field.field_name + " "}
                                    {field.field_type === "boolean" ? (
                                        <select
                                            value={formData.hasOwnProperty(field.id) ? formData[field.id] : field.options?.[0] || ""}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                        >
                                            {Array.isArray(field.options) && field.options.map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field.field_type === "number" ? (
                                        <input
                                            type="number"
                                            placeholder={`Введите ${field.field_name}`}
                                            value={formData.hasOwnProperty(field.id) ? formData[field.id] : ""}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                        />
                                    ) : field.field_type === "select" ? (
                                        <select
                                            value={formData.hasOwnProperty(field.id) ? formData[field.id] : ""}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                        >
                                            {Array.isArray(field.options) && field.options.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>Неизвестный тип поля</span>
                                    )}
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
                        <p><i>Категория: </i>{categories.find((c) => c.id === selectedCategory)?.name}</p>
                        <p><i>Тип: </i>{types.find((t) => t.id === selectedType)?.name}</p>
                        <p><i>Серия: </i>{series.find((s) => s.id === selectedSeries)?.name}</p>
                        <p><i>Характеристики: </i>{fields.map((f) => {
                            const value = calculationResult?.formData[f.id];
                            if (f.field_type === "boolean") {
                                return `${f.field_name}: ${value}`;
                            } else if (f.field_type === "number") {
                                return `${f.field_name}: ${value || 0}`;
                            } else {
                                return `${f.field_name}: ${value}`;
                            }
                          }).join(", ")}</p>
                        <p><i>Стоимость: </i><b>{calculationResult?.cost}</b> рублей</p>
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