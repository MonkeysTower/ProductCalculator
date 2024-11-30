import React from "react";
import StorageItem from "./StorageItem"
const SideBarStorage = () => {
    return (
        <div className="sector-window storage-bar">
            <h2>Остатки на складе:</h2>
            <div className="place-for-items">
                <StorageItem
                    title="ЗВН-01"
                    onClick = {() => alert("Добавленно в заявку")}
                    price='Очень много'
                    quantity='2'
                />
                <StorageItem
                    title="ЗВН-02"
                    onClick={() => alert("Добавленно в заявку")}
                    price='Много'
                    quantity='1'
                />
                <StorageItem
                    title="ЗВН-03"
                    onClick={() => alert("Добавленно в заявку")}
                    price='Много'
                    quantity='Черезчур много '
                />
                <StorageItem
                    title="ЗВН-04"
                    onClick={() => alert("Добавленно в заявку")}
                    price='Маловато'
                    quantity='2'
                />
                <StorageItem
                    title="ЗВН-05"
                    onClick={() => alert("Добавленно в заявку")}
                    price='Гипре очень много'
                    quantity='2'
                />
                <StorageItem
                    title="ЗВН-06"
                    onClick={() => alert("Добавленно в заявку")}
                    price='Много'
                    quantity='1'
                />
                <StorageItem
                    title="ЗВН-07"
                    onClick={() => alert("Добавленно в заявку")}
                    price='Много'
                    quantity='Черезчур много '
                />
                <StorageItem
                    title="ЗВН-08"
                    onClick={() => alert("Добавленно в заявку")}
                    price='Маловато'
                    quantity='2'
                />
                <StorageItem
                    title="Что-то с чем-то морозильным и даже чуть-чуть с нейтральным"
                    onClick={() => alert("Добавленно в заявку")}
                    price='Сказочно много'
                    quantity='Если бы вы только знали как много на складе '
                />
            </div>
        </div>
    );
  };
  
  export default SideBarStorage;