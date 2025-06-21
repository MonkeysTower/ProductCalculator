import React, { useEffect, useState } from "react";

const SideBarStorage = () => {
    const [stock, setStock] = useState([]);
    const API_BASE_URL = '/api';

    useEffect(() => {
        fetch(`${API_BASE_URL}/stock/`)
            .then(response => response.json())
            .then(data => setStock(data));
    }, [API_BASE_URL]);

    return (
        <div className="sector-window storage-bar">
            <h2>Остатки на складе:</h2>
            <div className="place-for-items">
                {stock.map(item => (
                    <div className="storage-item" key={item.id}>
                        <p>{item.name}</p>
                        <p><b>Стоимость:</b> {item.price}</p>
                        <p><b>Количество:</b> {item.quantity} шт.</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SideBarStorage;