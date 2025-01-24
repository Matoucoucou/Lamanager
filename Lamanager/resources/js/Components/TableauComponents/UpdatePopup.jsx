import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdatePopup({ setShowUpdatePopup, initialData, selectedGroups, handleUpdateConfirm, enseignementId }) {
    console.log('initialData', selectedGroups);
    const [heures, setHeures] = useState(selectedGroups.map(() => `${initialData.heures}:${initialData.minutes}`));
    const [enseignants, setEnseignants] = useState([]);
    const [enseignantsMap, setEnseignantsMap] = useState({});
    const [selectedEnseignants, setSelectedEnseignants] = useState(new Array(selectedGroups.length).fill(''));

    useEffect(() => {
        const fetchEnseignants = async () => {
            try {
                const response = await axios.get('/api/enseignants'); // Remplacez par l'URL de votre API
                const enseignantsData = response.data;
    
                // Créer un objet de mappage enseignantId => code
                const map = enseignantsData.reduce((acc, enseignant) => {
                    acc[enseignant.id] = enseignant.code; // Mappage de l'ID au nom complet
                    return acc;
                }, {});
    
                setEnseignants(enseignantsData);
                setEnseignantsMap(map);
            } catch (error) {
                console.error('Erreur lors de la récupération des enseignants:', error);
            }
        };
    
        fetchEnseignants();
    }, []);

    const handleHeuresChange = (index, value) => {
        const newHeures = [...heures];
        newHeures[index] = value;
        setHeures(newHeures);
    };

    const handleEnseignantChange = (index, value) => {
        const newSelectedEnseignants = [...selectedEnseignants];
        newSelectedEnseignants[index] = value;
        setSelectedEnseignants(newSelectedEnseignants);
    };

    const handleConfirmClick = () => {
        const updatedData = [];

        Object.keys(groupedCells).forEach((groupeId, index) => {
            const [hours, minutes] = heures[index].split(':').map(Number);
            const enseignantId = selectedEnseignants[index];
            const enseignantCode = enseignantsMap[enseignantId];

            groupedCells[groupeId].forEach(cell => {
                updatedData.push({
                    groupeId: cell.groupeId,
                    heures: hours,
                    minutes: minutes,
                    enseignantId: enseignantId,
                    enseignantCode: enseignantCode,
                    enseignementId: enseignementId,
                    semaineId: cell.semaineId,
                    cellKey: cell.cellKey
                });
            });
        });

        handleUpdateConfirm(updatedData);
        if (typeof setShowUpdatePopup === 'function') {
            setShowUpdatePopup(false);
        }
    };

    // Regrouper les cellules par groupeId
    const groupedCells = selectedGroups.reduce((acc, cell) => {
        if (!acc[cell.groupeId]) {
            acc[cell.groupeId] = [];
        }
        acc[cell.groupeId].push(cell);
        return acc;
    }, {});

    console.log('selectedGroups', selectedGroups);

    console.log('groupedCells', groupedCells);

    return (
        <div className="popup-overlay" style={overlayStyle}>
            <div className="popup-content" style={contentStyle}>
                <h2>Modifier</h2>
                <div style={inputContainerStyle}>
                    <div style={columnHeaderStyle}>
                        {Object.keys(groupedCells).map((groupeId, index) => (
                            <div key={`header-${index}`} style={columnStyle}>
                                <label style={labelStyle}>{groupedCells[groupeId][0].name}</label>
                            </div>
                        ))}
                    </div>
                    <div style={columnHeaderStyle}>
                        {Object.keys(groupedCells).map((groupeId, index) => (
                            <div key={`input-${index}`} style={columnStyle}>
                                <input
                                    type="time"
                                    value={heures[index]}
                                    onChange={(e) => handleHeuresChange(index, e.target.value)}
                                    style={inputStyle}
                                    placeholder="HH:MM"
                                />
                                <select
                                    value={selectedEnseignants[index]}
                                    onChange={(e) => handleEnseignantChange(index, e.target.value)}
                                    style={selectStyle}
                                    size={enseignants.length}
                                >
                                    <option value="" disabled>Choisir un enseignant</option>
                                    {enseignants.map((enseignant) => (
                                        <option key={enseignant.id} value={enseignant.id}>
                                            {enseignant.nom} {enseignant.prenom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={buttonContainerStyle}>
                    <button onClick={() => setShowUpdatePopup(false)} style={buttonStyle}>Annuler</button>
                    <button onClick={handleConfirmClick} style={buttonStyle}>Confirmer</button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const contentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
    maxWidth: '1200px',
    width: '100%',
    textAlign: 'center',
};

const inputContainerStyle = {
    textAlign: 'left',
    marginTop: '10px',
};

const columnHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
};

const columnStyle = {
    flex: 1,
    textAlign: 'center',
};

const labelStyle = {
    fontSize: '18px',
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
};

const selectStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
    maxHeight: '150px',
    overflowY: 'auto'
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
};

const buttonStyle = {
    marginLeft: '10px',
};

export default UpdatePopup;
