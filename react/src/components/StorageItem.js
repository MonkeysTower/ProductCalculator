import React from "react";

const StorageItem = ({ title, price, quantity, onClick }) => {
    return (
        <button
            className='storage-item'
            onClick={onClick}
        >
        <p>{title}</p>
        <p><b>Стоимость:</b> {price}</p>
        <p><b>Количество:</b> {quantity}шт.</p>
        </button>
    );
};

export default StorageItem;