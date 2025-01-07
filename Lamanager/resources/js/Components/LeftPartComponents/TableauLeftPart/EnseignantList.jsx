import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EnseignantList({ selectedEnseignant, onEnseignantSelect }) {
    const [enseignants, setEnseignants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnseignants = async () => {
            try {
                const response = await axios.get('/api/enseignants');
                setEnseignants(response.data);

                if (!new URL(window.location).searchParams.get('enseignant') && response.data.length > 0) {
                    const firstEnseignant = response.data[0];
                    updateUrlWithEnseignant(firstEnseignant);
                    onEnseignantSelect(firstEnseignant);
                }
            } catch (err) {
                setError('Erreur lors du chargement des enseignants');
            } finally {
                setLoading(false);
            }
        };

        fetchEnseignants();
    }, []);

    const updateUrlWithEnseignant = (enseignant) => {
        const url = new URL(window.location);
        url.searchParams.set('enseignant', enseignant.id);
        window.history.pushState({}, '', url);
    };

    if (loading) return <div>Chargement des enseignants...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="menu-wrapper">
            <h2 className="menu-title">Enseignants</h2>
            <div className="menu-container">
                {enseignants.map((enseignant) => (
                    <div 
                        key={enseignant.id}
                        id={enseignant.id}
                        className={`menu-item cursor-pointer ${selectedEnseignant?.id === enseignant.id ? 'bg-[#564787] text-white' : 'hover:bg-purple-100'}`}
                        onClick={() => {
                            onEnseignantSelect(enseignant);
                            updateUrlWithEnseignant(enseignant);
                        }}
                    >
                        {enseignant.nom} {enseignant.prenom}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EnseignantList;