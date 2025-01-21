import React, { useState } from "react";
import axios from "axios";

function PopupSuppression({ onClose, promos, onDelete }) {
  const [selectedPromoId, setSelectedPromoId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async () => {
    if (!selectedPromoId) {
      setErrorMessage("Veuillez sélectionner une promo.");
      return;
    }
    try {
      console.log("Selected Promo ID:", selectedPromoId);

      // Vérifier l'existence des cases de prévisionnel pour la promo et la promo alternante
      const checkResponse = await axios.get(`/api/promos/check-cases/${selectedPromoId}`);
      if (checkResponse.data.exists) {
        setErrorMessage("Impossible de supprimer la promo car des cases de prévisionnel existent.");
        return;
      }

      // Supprimer les enseignements liés à la promo
      await axios.delete(`/api/enseignements/${selectedPromoId}`);
      console.log(`Enseignements for promo ${selectedPromoId} deleted`);

      // Supprimer la promo
      await axios.delete(`/api/promos/${selectedPromoId}`);
      console.log(`Promo ${selectedPromoId} deleted`);

      onDelete(selectedPromoId);
      onClose();
      window.location.reload(); // Rafraîchir la page après la suppression
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.error);
      } else {
        console.error("Erreur lors de la suppression de la promo:", error);
      }
    }
  };

  // Filtrer les promos pour ne pas afficher les promos miroir
  const filteredPromos = promos.filter(promo => !promo.alternant);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>Confirmation de suppression</h2>
        <p>Veuillez sélectionner la promo à supprimer :</p>
        <select onChange={(e) => setSelectedPromoId(e.target.value)} value={selectedPromoId}>
          <option value="">Sélectionner une promo</option>
          {filteredPromos.map((promo) => (
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
  );
}

export default PopupSuppression;