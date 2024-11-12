import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MenuAnnee({ selectedAnnee, onAnneeSelect }) {
    const [annees, setAnnees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnees = async () => {
            try {
                const response = await axios.get('/api/annees');
                setAnnees(response.data);
                // Sélectionne par défaut la première année si aucune n'est sélectionnée
                if (response.data.length > 0 && !selectedAnnee) {
                    onAnneeSelect(response.data[0]);
                }
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des années');
                setLoading(false);
            }
        };

        fetchAnnees();
    }, []);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="menu-wrapper">
            <h2 className="menu-title">Année Scolaire</h2>
            <div className="menu-container">
                {annees.map((annee) => (
                    <div 
                        key={annee.id} 
                        className={`menu-item cursor-pointer ${selectedAnnee?.id === annee.id ? 'bg-[#564787] text-white' : 'hover:bg-purple-100'}`}
                        onClick={() => onAnneeSelect(annee)}
                    >
                        {annee.annee_scolaire}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MenuAnnee;