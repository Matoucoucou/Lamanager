import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EnseignementListeVersionProf({ anneeId, onEnseignementSelect, setIsAllEnseignementsSelected }) {
    const [enseignements, setEnseignements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnseignements = async () => {
            try {
                const sessionResponse = await axios.get('/api/session');
                const userId = sessionResponse.data.userId; 
                const response = await axios.get(`/api/enseignants/${anneeId}/${userId}`);
                setEnseignements(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Erreur lors du chargement des enseignements:', err);
                setError('Erreur lors du chargement des enseignements');
                setLoading(false);
            }
        };

        if (anneeId) {
            fetchEnseignements();
        }
    }, [anneeId]);

    if (!anneeId) return null;
    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="select-container">
            <select 
                className="w-full p-2 rounded-md border border-gray-300 focus:border-[#564787] focus:ring focus:ring-[#564787] focus:ring-opacity-50"
                onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const selectedEnseignement = enseignements.find(e => e.id === selectedId);
                    console.log("selectedId:", selectedId);
                    console.log("selectedEnseignement trouvé:", selectedEnseignement);
                    if (selectedEnseignement) {
                        onEnseignementSelect(selectedEnseignement);
                        setIsAllEnseignementsSelected(false);
                        console.log('Enseignement sélectionné:', selectedEnseignement);
                    }
                    if(e.target.value === 'all') {
                        console.log('Tous les enseignements');
                        setIsAllEnseignementsSelected(true);
                    }
                }}
                defaultValue=""
            >
                <option value="" disabled>Sélectionnez un enseignement</option>
                <option value="all">Tous les enseignements</option>
                {enseignements.map((enseignement) => (
                    <option key={enseignement.id} value={enseignement.id}>
                        {enseignement.nom}
                    </option>
                ))}
            </select>
        </div>
    );
}
export default EnseignementListeVersionProf;