import React, { useState } from "react";
import "../../../css/inputconfirmmodifpromo.css";
function InputModifPromo({ isOpen, onClose, onSubmit, title, label }) {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = () => {
        onSubmit(inputValue);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{title}</h2>
                <label>{label}</label>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button onClick={handleSubmit}>Valider</button>
                <button onClick={onClose}>Fermer</button>
            </div>
        </div>
    );
}

export default InputModifPromo;
