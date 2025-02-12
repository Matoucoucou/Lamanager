import React, { useState } from "react";
import axios from "axios";

function PopupSuppression({ onClose, promos, onDelete }) {
  const [selectedPromoId, setSelectedPromoId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async () => {
    if (!selectedPromoId) return;
    try {
      const response = await axios.delete(`/api/promos/${selectedPromoId}`);
      if (response.status === 200) {
        onDelete(selectedPromoId);
        onClose();
        window.location.reload(); // Rafraîchir la page après la suppression
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.error);
      } else {
        console.error("Erreur lors de la suppression de la promo:", error);
      }
    }
  };

  return (
    <>
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>Confirmation de suppression</h2>
        <p>Veuillez sélectionner la promo à supprimer :</p>
        <select onChange={(e) => setSelectedPromoId(e.target.value)} value={selectedPromoId}>
          <option value="">Sélectionner une promo</option>
          {promos.map((promo) => (
            <option key={promo.id} value={promo.id}>
              {promo.nom}
            </option>
          ))}
        </select>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="button-container">
          <button onClick={handleDelete} className="delete-button">Supprimer</button>
          <button onClick={onClose} className="cancel-button">Annuler</button>
        </div>
      </div>
    </div>
    </>
  );
}

export default PopupSuppression;