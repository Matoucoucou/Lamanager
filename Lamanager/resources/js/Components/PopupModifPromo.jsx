import React, { useState, useEffect } from "react";
import PopupModifPromoAdaptative from "./PopupModifPromoAdaptative.jsx";
import axios from "axios";
import "../../css/modifpromo.css";

function PopupModifPromo({ onClose, promos, selectedAnnee }) {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [promoData, setPromoData] = useState(promos.map(promo => ({
        ...promo,
        nombre_td: promo.nombre_td || 0,
        nombre_tp: promo.nombre_tp || 0
    })).sort((a, b) => a.nom.localeCompare(b.nom, undefined, { numeric: true })));

    useEffect(() => {
        const fetchGroupesForPromos = async () => {
            const updatedPromos = await Promise.all(promoData.map(async (promo) => {
                try {
                    const response = await axios.get(`/api/groupes/${promo.id}`);
                    const groupes = response.data;
                    const tdCount = groupes.filter(groupe => groupe.type === 'TD').length;
                    const tpCount = groupes.filter(groupe => groupe.type === 'TP').length;
                    return {
                        ...promo,
                        groupes,
                        nombre_td: tdCount,
                        nombre_tp: tpCount
                    };
                } catch (error) {
                    console.error(`Error fetching groupes for promo ${promo.id}:`, error);
                    return { ...promo, groupes: [] };
                }
            }));
            setPromoData(updatedPromos);
        };

        fetchGroupesForPromos();
    }, []);

    const handleButtonClick = (promoName) => {
        setSelectedPromo(promoName);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedPromo(null);
    };

    const refreshPromoData = async () => {
        try {
            const response = await axios.get(`/api/promos/${selectedAnnee.id}`);
            setPromoData(response.data.sort((a, b) => a.nom.localeCompare(b.nom, undefined, { numeric: true })));
        } catch (error) {
            console.error("Error refreshing promo data:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            // Recalculate the counts of TD and TP groups
            const updatedPromoData = await Promise.all(promoData.map(async (promo) => {
                const response = await axios.get(`/api/groupes/${promo.id}`);
                const groupes = response.data;
                const tdCount = groupes.filter(groupe => groupe.type === 'TD').length;
                const tpCount = groupes.filter(groupe => groupe.type === 'TP').length;
                return {
                    ...promo,
                    nombre_td: tdCount,
                    nombre_tp: tpCount
                };
            }));
            setPromoData(updatedPromoData);

            await axios.post('/api/promos/update', { promos: updatedPromoData });
            onClose();
        } catch (error) {
            console.error("Error updating promos:", error);
        }
    };

    return (
        <div className="custom-popup-overlay-modif" onClick={onClose}>
            <div className="custom-popup-content-modif" onClick={(e) => e.stopPropagation()}>
                <div className="popupmodifpromo-header">
                    <h2>Modification de Promo</h2>
                </div>
                <div className="promos-container">
                    {promoData.map((promo, index) => (
                        <div key={index} className="promo-block">
                            <label>Nom : {promo.nom}</label>
                            <label>Nombre TD : {promo.nombre_td}</label>
                            <label>Nombre TP : {promo.nombre_tp}</label>
                            <button onClick={() => handleButtonClick(promo.nom)}>
                                Modifier {promo.nom}
                            </button>
                        </div>
                    ))}
                </div>
                {showPopup && (
                    <div>
                        <PopupModifPromoAdaptative
                            onClose={handleClosePopup}
                            promoName={selectedPromo}
                            promos={promos}
                            updatePromoData={(id, type, count) => {
                                setPromoData(prevData => prevData.map(promo =>
                                    promo.id === id ? { ...promo, [`nombre_${type.toLowerCase()}`]: count } : promo
                                ));
                            }}
                            refreshPromoData={refreshPromoData}
                        />
                    </div>
                )}
                <div className="custom-button-container">
                    <button onClick={handleSubmit}>Valider</button>
                </div>
            </div>
        </div>
    );
}

export default PopupModifPromo;
