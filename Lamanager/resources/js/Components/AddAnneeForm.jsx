import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AddAnneeForm = ({ onAnneeAdded, onClose }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAnnee, setNewAnnee] = useState('');
    const [error, setError] = useState(null);
    const popupRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/annees', { annee: newAnnee });
            onAnneeAdded(response.data);
            setNewAnnee('');
            handleClose();
        } catch (err) {
            setError('Erreur lors de l\'ajout de l\'année');
        }
    };

    const handleClose = () => {
        setShowAddForm(false);
        onClose();
        setNewAnnee('');
        setError(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
        <div style={{ width: '100%',padding: '0rem 1rem' }}>
            <button 
            onClick={() => setShowAddForm(true)}
            className="cursor-pointer btn-add-year"
            style={{ width: '100%', marginTop: '1vh', borderRadius: '10px', padding: '0.5rem 1rem' , boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
            >
            + Ajouter une année
            </button>
        </div>

        {showAddForm && (
        <div className="popup-overlay">
            <div className="popup-content" ref={popupRef} style={{ width: '400px',height: '200px' }}>
                <div className="popup-header">
                    <h2>Ajouter une année</h2>
                </div>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newAnnee}
                        onChange={(e) => setNewAnnee(e.target.value)}
                        placeholder="Format: xx/xx"
                        pattern="\d{2}/\d{2}"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#564787] focus:ring focus:ring-[#564787]"
                        required
                    />
                    <div className="button-container">
                        <button 
                            type="button" 
                            onClick={handleClose}
                            className="mr-2"
                        >
                            Annuler
                        </button>
                        <button type="submit">
                            Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
        )}
        </>
    );
};

export default AddAnneeForm;
