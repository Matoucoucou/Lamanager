import React from "react";
import "../../../css/inputconfirmmodifpromo.css";

function ConfirmModifPromo({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <p>{message}</p>
                <div className="button-group">
                    <button onClick={onConfirm}>Oui</button>
                    <button onClick={onClose}>Non</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModifPromo;
