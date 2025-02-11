import axios from 'axios';

export const getColorClass = (colIndex, nbCM, nbTD) => {
    if (colIndex < nbCM) return 'bg-yellow-300';
    if (colIndex >= nbCM && colIndex < nbCM + nbTD) return 'bg-red-300';
    if (colIndex >= nbCM + nbTD) return 'bg-blue-300';
    return '';
};
export const traitementNom = (nom) => {
    return nom.length > 8 ? nom.substring(0, 8) + '...' : nom;
};

export const addCellToDatabase = async (semaineID, enseignantId, enseignementId, groupeId, heures, minutes) => {
    try {
        if (!semaineID || !enseignantId || !enseignementId || !groupeId) {
            console.error('Paramètres invalides:', {
                semaineID,
                enseignantId,
                enseignementId,
                groupeId
            });
            throw new Error('Tous les paramètres sont requis et doivent être non nuls');
        }

        const response = await axios.post('api/cases', {
            semaine_id: semaineID,
            enseignant_id: enseignantId,
            enseignement_id: enseignementId,
            groupe_id: groupeId,
            nombre_heure: heures,
            nombre_minute: minutes
        });

        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout à la base de données:', error);
        throw error;
    }
};

export const deleteCellFromDatabase = async (semaineId, groupeId, enseignementId) => {
    try {
        const response = await axios.delete('/api/cases', {
            data: {
                semaine_id: semaineId,
                groupe_id: groupeId,
                enseignement_id: enseignementId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de la base de données:', error);
        throw error;
    }
};

export const handleCellClick = async (rowIndex, colIndex, semaineId, enseignantId, enseignementId, groupeID, isSemaineColumn, nbGroupe, groupesID, semainesID, enseignantCode, heures, minutes, setClickedCells
    ) => {
        const enseignantIdInt = Number(enseignantId);
    
        setClickedCells((prev) => {
            const updatedCells = { ...prev };
    
            if (isSemaineColumn) {
                // Clic sur la colonne semaine
                const isRowFullyColored = Array.from({ length: nbGroupe }, (_, index) => index).every(
                    (col) => prev[`${rowIndex}-${col}`]?.clicked
                );

                for (let i = 0; i < groupesID.length; i++) {
                    try {
                        deleteCellFromDatabase(rowIndex+1, groupesID[i], enseignementId);
                    } catch (error) {
                    }
                }
                
                for (let i = 0; i < groupesID.length; i++) {
                    const cellKey = `${rowIndex}-${i}`;
                    if (isRowFullyColored) {
                        // Décocher et supprimer de la BDD
                        updatedCells[cellKey] = { clicked: false, text: "", heures: null, minutes: null, enseignantCode: null };
                        try {
                        } catch (error) {
                            console.error('Erreur lors de la suppression:', error);
                        }
                    } else {
                        // Cocher et ajouter à la BDD
                        updatedCells[cellKey] = { clicked: true, text: `${heures}h${minutes !== 0 ? minutes : ''} - ${enseignantCode}`, 
                        heures: heures,
                        minutes: minutes,
                        enseignantCode: enseignantCode};
                        try {
                            addCellToDatabase(rowIndex+1, enseignantIdInt, enseignementId, groupesID[i], heures, minutes);
                        } catch (error) {
                            console.error('Erreur lors de l\'ajout:', error);
                        }
                    }
                }
            } else {
                // Clic sur une cellule individuelle (CM, TD, TP)
                const key = `${rowIndex}-${colIndex}`;
                const isCurrentlyClicked = prev[key]?.clicked;
    
                if (isCurrentlyClicked) {
                    // Si la cellule est déjà cochée, on la décoche
                    updatedCells[key] = { clicked: false, text: "", heures: null, minutes: null, enseignantCode: null };
                    try {
                        deleteCellFromDatabase(semaineId, groupeID, enseignementId);
                    } catch (error) {
                        console.error('Erreur lors de la suppression:', error);
                    }
                } else {
                    // Si la cellule n'est pas cochée, on la coche
                    updatedCells[key] = { clicked: true, text: `${heures}h${minutes !== 0 ? minutes : ''} - ${enseignantCode}`,
                    heures: heures,
                    minutes: minutes,
                    enseignantCode: enseignantCode};
                    try {
                        addCellToDatabase(semaineId, enseignantIdInt, enseignementId, groupeID, heures, minutes);
                    } catch (error) {
                        console.error('Erreur lors de l\'ajout:', error);
                    }
                }
            }
            return updatedCells;
        });
    };