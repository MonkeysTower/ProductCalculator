import React from "react";

const Card = ({ image, title, onClick, isSelected }) => {
    return (
        <button
            className={`image-container ${isSelected ? "selected" : ""}`}
            onClick={onClick}
        >
            <img src={image} alt={title} className="image" />
            <div className="caption">{title}</div>
        </button>
    );
};

export default Card;