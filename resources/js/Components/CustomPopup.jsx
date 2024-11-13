import React from "react";

function CustomPopup({ onClose }) {
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>

                <div className="promo-name-container">
                    <p>Nom de la promo :</p>
                    <input type="text" />
                </div>

                <div className="input-container">
                    <div className="input-group">
                        <label>Nom de groupe TD :</label>
                        <input type="text" />
                    </div>

                    <div className="input-group">
                        <label>Nom de groupe TP :</label>
                        <input type="text" />
                    </div>
                </div>

                <div className="button-container">
                    <button>Valider</button>
                </div>
            </div>
        </div>
    );
}

export default CustomPopup;
