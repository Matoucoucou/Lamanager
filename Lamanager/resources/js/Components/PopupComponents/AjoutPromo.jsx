import React, { useState, useEffect } from "react";
import axios from "axios";

function AjoutPromo({ onClose, selectedAnnee }) {
    const [promoName, setPromoName] = useState("");
    const [tdCount, setTdCount] = useState(0);
    const [tpCount, setTpCount] = useState(0);
    const [isAlternant, setIsAlternant] = useState(false);

    useEffect(() => {
        const fetchGroupCounts = async () => {
            try {
                const tdResponse = await axios.get(`/api/groupes/count?type=TD&annee_id=${selectedAnnee.id}`);
                const tpResponse = await axios.get(`/api/groupes/count?type=TP&annee_id=${selectedAnnee.id}`);
                setTdCount(tdResponse.data.count);
                setTpCount(tpResponse.data.count);
            } catch (error) {
                console.error("Error fetching group counts:", error);
            }
        };

        fetchGroupCounts();
    }, [selectedAnnee.id]);

    async function creationPromo() {
        const newPromo = await handlePromos();
        if (newPromo) {
            await handleGroupes(newPromo);
        }
    }

    const handlePromos = async () => {
        try {
            const response = await axios.post('/api/promos', {
                annee_id: selectedAnnee.id,
                nom: promoName,
                nombre_td: tdCount,
                nombre_tp: tpCount,
                alternant: isAlternant,
            });
            return response.data;
        } catch (err) {
            console.error("Erreur lors de la création de la promo", err);
            return null;
        }
    };

    const handleGroupes = async (promo) => {
        await axios.post('/api/groupes', {
            promo_id: promo.id,
            nom: "CM",
            type: "CM",
        });
        for (let i = 1; i <= promo.nombre_td; i++) {
            const nomTD = "TD" + i;
            await axios.post('/api/groupes', {
                promo_id: promo.id,
                nom: nomTD,
                type: "TD",
            });
        }
        for (let j = 1; j <= promo.nombre_tp; j++) {
            const nomTP = "TP" + j;
            await axios.post('/api/groupes', {
                promo_id: promo.id,
                nom: nomTP,
                type: "TP",
            });
        }
        onClose();
    };

    return (
        <div className="custom-popup-overlay-unique" onClick={onClose}>
            <div className="custom-popup-content-unique" onClick={(e) => e.stopPropagation()}>
                <div className="custom-promo-name-container-unique">
                    <p>Nom de la promo :</p>
                    <input
                        type="text"
                        value={promoName}
                        onChange={(e) => setPromoName(e.target.value)}
                    />
                </div>
                <div className="custom-input-container-unique">
                    <div className="custom-input-group-unique">
                        <label>Nombre de groupes TD :</label>
                        <input
                            type="number"
                            value={tdCount}
                            onChange={(e) => setTdCount(e.target.value)}
                        />
                    </div>
                    <div className="custom-input-group-unique">
                        <label>Nombre de groupes TP :</label>
                        <input
                            type="number"
                            value={tpCount}
                            onChange={(e) => setTpCount(e.target.value)}
                        />
                    </div>
                </div>
                <div className="custom-input-group-unique">
                    <label>Alternant :</label>
                    <input
                        type="checkbox"
                        checked={isAlternant}
                        onChange={(e) => setIsAlternant(e.target.checked)}
                    />
                </div>
                <div className="custom-button-container-unique">
                    <button onClick={creationPromo}>Valider</button>
                </div>
            </div>
        </div>
    );
}

export default AjoutPromo;
