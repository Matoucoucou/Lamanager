import React, { useState } from "react";
import axios from "axios";

function AjoutPromo({ onClose, selectedAnnee }) {
    const [promoName, setPromoName] = useState("");
    const [tdNbr, setTdNbr] = useState("");
    const [tpNbrByTd, setTpNbrByTd] = useState("");
    const [isAlternant, setIsAlternant] = useState(false);

    async function creationPromo() {
        if (promoName !== "" && tdNbr !== "" && tpNbrByTd !== "" && tdNbr > 0 && tpNbrByTd > 0) {
            onClose(); // Fermer la popup après soumission
            const newPromo = await handlePromos(); // Créer la promo normale
            if (newPromo) {
                await handleGroupes(newPromo); // Créer les groupes pour la promo normale

                if (isAlternant) {
                    // Créer la promo alternante
                    const alternantPromo = await handlePromosAlternant(newPromo);
                    if (alternantPromo) {
                        await handleGroupes(alternantPromo); // Créer les groupes pour la promo alternante
                    }
                }
            }
            window.location.reload();
        }

    }

    async function addPromo(selectedAnnee, alternantId, promoName, tdNbr, tpNbr, alternant) {
        return await axios.post('/api/promos', {
            annee_id: selectedAnnee.id,
            alternant_id: alternantId,
            nom: promoName,
            nombre_td: tdNbr,
            nombre_tp: tpNbr,
            alternant: alternant,
        });
    }
    async function addGroupe(promo, nom, type) {
        return await axios.post('/api/groupes', {
            promo_id: promo.id,
            nom: nom,
            type: type,
        });
    }

    const handlePromos = async () => {
        try {
            const promo = await addPromo(selectedAnnee,null, promoName, tdNbr, tpNbrByTd, false);
            console.log("Promo créée :", promo.data);
            return promo.data;
        } catch (err) {
            console.error("Erreur lors de la création de la promo", err);
            return null;
        }
    };

    const handlePromosAlternant = async (promo) => {
        try {
            const alternantPromo = await addPromo
            (selectedAnnee,promo.id, `${promo.nom} Alternant`, promo.nombre_td, promo.nombre_tp, true);

            // Mettre à jour la promo principale avec l'alternant_id
            await axios.post(`/api/update-promos/${promo.id}`, {
                alternant_id: alternantPromo.data.id,
            });

            console.log("Promo alternante créée :", alternantPromo.data);
            return alternantPromo.data;
        } catch (err) {
            console.error("Erreur lors de la création de la promo alternante", err);
            return null;
        }
    };

    const handleGroupes = async (promo) => {
        let num_td = 0;
        console.log("promo actuel", promo);
        await addGroupe(promo, "CM", "CM");

        for (let i = 0; i < promo.nombre_td; i++) {
            const nomTD = "TD" + parseInt(i + 1);
            const td = await addGroupe(promo, nomTD, "TD");

            for (let j = 1; j <= promo.nombre_tp; j++) {
                num_td = num_td+1;
                const nomTP = "TP" + num_td;
                const tp = await addGroupe(promo, nomTP, "TP");
                console.log(td,tp,td.data.id);

                await axios.post('/api/liaison', {
                    groupe_td_id: td.data.id,
                    groupe_tp_id: tp.data.id,
                });
            }
        }

    };

    return (
        <div className="custom-popup-overlay-unique" onClick={onClose}>
            <div className="custom-popup-content-unique" onClick={(e) => e.stopPropagation()}>
                <div
                    style={{
                        marginBottom: "10%",
                    }}>
                    <div className="custom-promo-name-container-unique">
                        <p>Nom de la promo :</p>
                        <input
                            type="text"
                            value={promoName}
                            onChange={(e) => setPromoName(e.target.value)}
                        />

                    </div>
                    {(promoName === "") && (
                        <div className="custom-input-container-unique">
                            <div className="custom-group-unique"
                                 style={{
                                     color: "red",
                                 }}>
                                <label>Le nom de la promo ne peut pas être vide.</label>
                            </div>
                        </div>
                    )}
                </div>
                <div className="custom-input-container-unique">
                    <div className="custom-group-unique">
                        <label>Nombre de groupe TD :</label>
                        <input
                            type="number"
                            value={tdNbr}
                            onChange={(e) => setTdNbr(e.target.value)} // Mise à jour de l'état
                        />
                    </div>
                    <div className="custom-group-unique">
                        <label>Nombre de groupe TP par TD :</label>
                        <input
                            type="number"
                            value={tpNbrByTd}
                            onChange={(e) => setTpNbrByTd(e.target.value)} // Mise à jour de l'état
                        />
                    </div>
                </div>
                {(tdNbr <= '0' || tpNbrByTd <= '0') && (
                    <div className="custom-input-container-unique">
                        <div className="custom-group-unique"
                             style={{
                                 color: "red",
                             }}>
                            <label>Le nombre de groupe de TD et TP doit être un nombre positif non nul.</label>
                        </div>
                    </div>
                )}

                <div className="custom-group-unique">
                    <label>Alternant :</label>
                    <input
                        type="checkbox"
                        checked={isAlternant}
                        onChange={(e) => setIsAlternant(e.target.checked)}
                    />
                </div>

                <div className="custom-group-unique">
                    <label
                        style={{
                            fontSize : 20,
                        }}
                    >La promo a TD : {tdNbr || 0} et TP : {tdNbr * tpNbrByTd || 0}</label>
                </div>
                <div className="custom-button-container-unique">
                    <button onClick={creationPromo}>Valider</button>
                </div>
            </div>
        </div>
    );
}

export default AjoutPromo;
