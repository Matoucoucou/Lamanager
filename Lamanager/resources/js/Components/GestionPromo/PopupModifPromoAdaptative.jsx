import React, { useState, useEffect } from "react";
import axios from "axios";
import InputModifPromo from "./InputModifPromo.jsx";
import ConfirmModifPromo from "./ConfirmModifPromo.jsx";
import "../../../css/modifpromoadapt.css";

function PopupModifPromoAdaptative({ onClose, promoName, promos, updatePromoData, refreshPromoData }) {
    const promo = promos.find(promo => promo.nom === promoName);
    const [groupesData, setGroupesData] = useState([]);
    const [liaisons, setLiaisons] = useState([]);
    const [isInputModalOpen, setInputModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [modalType] = useState("");
    const [tdGroupName] = useState("");
    const [tdGroupToDelete, setTdGroupToDelete] = useState(null);

    useEffect(() => {
        const fetchGroupes = async () => {
            try {
                const response = await axios.get(`/api/groupes/${promo.id}`);
                setGroupesData(response.data);
            } catch (error) {
                console.error("Error fetching groupes:", error);
            }
        };

        fetchGroupes().then(() => {
            setGroupesData(prevGroupesData => prevGroupesData.sort((a, b) => a.nom.localeCompare(b.nom, undefined, { numeric: true })));
        });

        const fetchLiaisons = async () => {
            try {
                const response = await axios.get(`/api/liaison_groupes`);
                setLiaisons(response.data);
            } catch (error) {
                console.error("Error fetching liaisons:", error);
            }
        };

        fetchGroupes();
        fetchLiaisons();
    }, [promo.id]);

    const isGroupNameExists = (name) => {
        return groupesData.some(groupe => groupe.nom === name);
    };

    const handleInputChange = (id, field, value) => {
        const newGroupesData = groupesData.map(groupe =>
            groupe.id === id ? { ...groupe, [field]: value } : groupe
        );
        setGroupesData(newGroupesData);
    };

    const handleAddGroup = async (type) => {
        let newGroupName = 'amodifier';
        let counter = 1;
        while (isGroupNameExists(newGroupName)) {
            newGroupName = `amodifier${counter}`;
            counter++;
        }
        try {
            const payload = { promo_id: promo.id, type, nom: newGroupName };
            const response = await axios.post('/api/groupes', payload);
            const newGroup = response.data;
            setGroupesData([...groupesData, newGroup]);
            updatePromoData(promo.id, type, groupesData.length + 1);
        } catch (error) {
            console.error("Error adding group:", error);
        }
    };

    const handleAddTPGroup = async (tdGroupName) => {
        const tdGroup = groupesData.find(groupe => groupe.nom === tdGroupName && groupe.type === 'TD');
        if (!tdGroup) {
            alert("Groupe TD non trouvé.");
            return;
        }
        let newGroupName = 'amodifier';
        let counter = 1;
        while (isGroupNameExists(newGroupName)) {
            newGroupName = `amodifier${counter}`;
            counter++;
        }
        try {
            const payload = { promo_id: promo.id, type: 'TP', nom: newGroupName };
            const response = await axios.post('/api/groupes', payload);

            const newGroup = response.data;

            // Create the liaison between TD and TP groups
            const liaisonPayload = { groupe_td_id: tdGroup.id, groupe_tp_id: newGroup.id };
            await axios.post('/api/liaison_groupes', liaisonPayload);

            setGroupesData(prevGroupesData => [...prevGroupesData, newGroup]);
            setLiaisons(prevLiaisons => [...prevLiaisons, { groupe_td_id: tdGroup.id, groupe_tp_id: newGroup.id }]);
            updatePromoData(promo.id, 'TP', groupesData.length + 1);
        } catch (error) {
            console.error("Error adding TP group:", error);
        }
    };

    const handleDeleteGroup = async (type, groupNameToDelete) => {
        const group = groupesData.find(groupe => groupe.type === type && groupe.nom === groupNameToDelete);

        if (group) {
            try {
                await axios.delete(`/api/groupes/${group.id}`);
                setGroupesData(groupesData.filter(groupe => groupe.id !== group.id));
                updatePromoData(promo.id, type, groupesData.length - 1);
            } catch (error) {
                console.error("Error deleting group:", error);
            }
        } else {
            alert("Groupe non trouvé.");
        }
    };

    const handleDeleteTDGroup = (tdGroupName) => {
        setTdGroupToDelete(tdGroupName);
        setConfirmModalOpen(true);
    };

    const confirmDeleteTDGroup = async () => {
        const tdGroup = groupesData.find(groupe => groupe.nom === tdGroupToDelete && groupe.type === 'TD');
        if (tdGroup) {
            try {
                // Delete related TP groups
                const relatedTPGroups = liaisons
                    .filter(liaison => liaison.groupe_td_id === tdGroup.id)
                    .map(liaison => liaison.groupe_tp_id);

                for (const tpGroupId of relatedTPGroups) {
                    await axios.delete(`/api/groupes/${tpGroupId}`);
                }

                // Delete the TD group
                await axios.delete(`/api/groupes/${tdGroup.id}`);
                setGroupesData(groupesData.filter(groupe => groupe.id !== tdGroup.id && !relatedTPGroups.includes(groupe.id)));
                setLiaisons(liaisons.filter(liaison => liaison.groupe_td_id !== tdGroup.id));
                updatePromoData(promo.id, 'TD', groupesData.length - 1);
                updatePromoData(promo.id, 'TP', groupesData.filter(groupe => groupe.type === 'TP').length);
            } catch (error) {
                console.error("Error deleting TD group:", error);
            }
        } else {
            alert("Groupe TD non trouvé.");
        }
        setConfirmModalOpen(false);
        setTdGroupToDelete(null);
    };

    const handleDeleteTPGroup = async (tpGroupName) => {
        const tpGroup = groupesData.find(groupe => groupe.nom === tpGroupName && groupe.type === 'TP');
        if (tpGroup) {
            try {
                await axios.delete(`/api/groupes/${tpGroup.id}`);
                setGroupesData(groupesData.filter(groupe => groupe.id !== tpGroup.id));
                setLiaisons(liaisons.filter(liaison => liaison.groupe_tp_id !== tpGroup.id));
                updatePromoData(promo.id, 'TP', groupesData.length - 1);
            } catch (error) {
                console.error("Error deleting TP group:", error);
            }
        } else {
            alert("Groupe TP non trouvé.");
        }
    };

    const handleSubmit = async () => {
        const groupNames = groupesData.map(groupe => groupe.nom);
        const hasDuplicateNames = groupNames.some((name, index) => groupNames.indexOf(name) !== index);

        if (hasDuplicateNames) {
            alert("Il y a des noms de groupes en double. Veuillez les corriger avant de valider.");
            return;
        }

        try {
            await axios.post('/api/update-groupes', { groupes: groupesData });

            // Recalculate the counts of TD and TP groups
            const tdCount = groupesData.filter(groupe => groupe.type === 'TD').length;
            const tpCount = groupesData.filter(groupe => groupe.type === 'TP').length;

            // Update the parent component's state with the new counts
            updatePromoData(promo.id, 'TD', tdCount);
            updatePromoData(promo.id, 'TP', tpCount);

            refreshPromoData();
            onClose(); // Close the popup after successful submission
        } catch (error) {
            console.error("Error updating groupes:", error);
        }
    };

    return (
        <div className="custom-popup-overlay-modif" onClick={onClose}>
            <div className="custom-popup-content-modif-voir" onClick={(e) => e.stopPropagation()}>
                <div className="popupmodifpromo-header">
                    <h2>Modification de {promo.nom}</h2>
                </div>

                <div className="td-blocks-container">
                    {groupesData.filter(groupe => groupe.type === 'TD').sort((a, b) => a.nom.localeCompare(b.nom, undefined, { numeric: true })).map((groupeTD) => (                        <div key={groupeTD.id} className="td-block">
                            <div className="td-group">
                                <input
                                    type="text"
                                    value={groupeTD.nom}
                                    onChange={(e) => handleInputChange(groupeTD.id, 'nom', e.target.value)}
                                />
                            </div>
                            <div className="tp-groups">
                                {liaisons.filter(liaison => liaison.groupe_td_id === groupeTD.id).map((liaison) => (
                                    groupesData.filter(groupe => groupe.id === liaison.groupe_tp_id).map((groupeTP) => (
                                        <div key={groupeTP.id} className="tp-group">
                                            <input
                                                type="text"
                                                value={groupeTP.nom}
                                                onChange={(e) => handleInputChange(groupeTP.id, 'nom', e.target.value)}
                                            />
                                            <div className="tp-group-buttons">

                                                <button onClick={() => handleDeleteTPGroup(groupeTP.nom)}>-</button>
                                            </div>
                                        </div>
                                    ))
                                ))}
                            </div>
                            <div className="custom-button-container-block">
                                <button onClick={() => handleAddTPGroup(groupeTD.nom)}>Ajout TP</button>
                                <button onClick={() => handleDeleteTDGroup(groupeTD.nom)}>Supprimer TD</button>
                            </div>
                        </div>
                    ))}
                    <div className="td-block-aj">
                        <div className="td-group-aj">
                            <button onClick={() => handleAddGroup('TD')} style={{ width: '100%', height: '100%' }}>
                                Ajouter TD
                            </button>
                        </div>
                    </div>
                </div>



                <div className="custom-button-container-mod">

                    <button onClick={handleSubmit}>Valider</button>
                </div>

            </div>
            <InputModifPromo
                isOpen={isInputModalOpen}
                onClose={() => setInputModalOpen(false)}
                onSubmit={(value) => {
                    if (modalType === 'addTP') handleAddTPGroup(value);
                    if (modalType === 'deleteTP') handleDeleteTPGroup(tdGroupName, value);
                    if (modalType === 'deleteTD') handleDeleteGroup('TD', value);
                }}
                title={modalType === 'addTP' ? "Ajouter TP" : modalType === 'deleteTP' ? "Supprimer TP" : "Supprimer TD"}
                label={modalType === 'addTP' ? "Nom du groupe TD" : modalType === 'deleteTP' ? "Nom du groupe TP" : "Nom du groupe TD"}
            />
            <ConfirmModifPromo
                isOpen={isConfirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={confirmDeleteTDGroup}
                message={`Êtes-vous sûr de vouloir supprimer le groupe TD "${tdGroupToDelete}" ?`}
            />
        </div>
    );
}

export default PopupModifPromoAdaptative;
