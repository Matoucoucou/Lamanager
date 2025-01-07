import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EnseignementSelect({ promoId, anneeId, onEnseignementSelect }) {
    const [enseignements, setEnseignements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnseignements = async () => {
            try {
                const response = await axios.get(`/api/enseignements/${promoId}/${anneeId}`);
                setEnseignements(response.data);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des enseignements');
                setLoading(false);
            }
        };

        if (promoId && anneeId) {
            fetchEnseignements();
        }
    }, [promoId, anneeId]);

    if (!promoId || !anneeId) return null;
    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="select-container">
            <select 
                className="w-full p-2 rounded-md border border-gray-300 focus:border-[#564787] focus:ring focus:ring-[#564787] focus:ring-opacity-50"
                onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const selectedEnseignement = enseignements.find(e => e.id === selectedId);
                    if (selectedEnseignement) {
                        onEnseignementSelect(selectedEnseignement);
                    }
                }}
                defaultValue=""
            >
                <option value="" disabled>Sélectionnez un enseignement</option>
                {enseignements.map((enseignement) => (
                    <option key={enseignement.id} value={enseignement.id}>
                        {enseignement.nom}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default EnseignementSelect;