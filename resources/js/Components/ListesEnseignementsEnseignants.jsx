import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListesEnseignementsEnseignants({ promoId, anneeId, onEnseignementSelect, selectedEnseignant, onEnseignantSelect }) {
    const [enseignements, setEnseignements] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const [loadingEnseignants, setLoadingEnseignants] = useState(true);
    const [errorEnseignants, setErrorEnseignants] = useState(null);
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

    useEffect(() => {
        const fetchEnseignants = async () => {
            try {
                const response = await axios.get('/api/enseignants');
                setEnseignants(response.data);

                if (response.data.length > 0 && !selectedEnseignant) {
                    onEnseignantSelect(response.data[0]);
                }
            } catch (err) {
                setErrorEnseignants('Erreur lors du chargement des enseignants');
            } finally {
                setLoadingEnseignants(false);
            }
        };

        fetchEnseignants();
    }, []);

    const updateUrlWithEnseignant = (enseignant) => {
        const url = new URL(window.location);
        url.searchParams.set('enseignant', enseignant.code);
        window.history.pushState({}, '', url);
    };

    if (!promoId || !anneeId) return null;
    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
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

            <div className="menu-wrapper">
                <h2 className="menu-title">Enseignants</h2>
                {loadingEnseignants ? (
                    <div>Chargement des enseignants...</div>
                ) : errorEnseignants ? (
                    <div>{errorEnseignants}</div>
                ) : (
                    <div className="menu-container">
                        {enseignants.map((enseignant) => (
                            <div 
                                key={enseignant.id}
                                id={enseignant.id}
                                className={`menu-item cursor-pointer ${selectedEnseignant?.id === enseignant.id ? 'bg-[#564787] text-white' : 'hover:bg-purple-100'}`}
                                onClick={() => {
                                    onEnseignantSelect(enseignant);
                                    updateUrlWithEnseignant(enseignant);  // Met à jour l'URL avec l'ID du prof
                                }}
                            >
                                {enseignant.nom} {enseignant.prenom}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default ListesEnseignementsEnseignants;
