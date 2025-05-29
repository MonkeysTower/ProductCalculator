import React, { useEffect, useState } from "react";

const SideBarStorage = () => {
    const [stock, setStock] = useState([]);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        fetch(`${API_BASE_URL}/stock/`)
            .then(response => response.json())
            .then(data => setStock(data));
    }, []);

    return (
        <div className="sector-window storage-bar">
            <h2>Остатки на складе:</h2>
            <div className="place-for-items">
                {stock.map(item => (
                    <button
                        key={item.id}
                        className="storage-item"
                        onClick={() => alert("Добавлено в заявку")}
                    >
                        <p>{item.series}</p>
                        <p><b>Стоимость:</b> {item.price}</p>
                        <p><b>Количество:</b> {item.quantity}шт.</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SideBarStorage;