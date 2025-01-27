import React, { useState } from 'react';
import axios from 'axios';
import GestionCompte from './GestionCompte';

export default function ProfilRightPart({ userData = {} }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showGestionCompte, setShowGestionCompte] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }

        try {
            const response = await axios.post('/password-reset', {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword,
            });

            if (response.status === 200) {
                setSuccess('Mot de passe mis à jour avec succès.');
                setError('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            console.error('Error:', err.response);
            if (err.response && err.response.status === 400) {
                setError('Mot de passe actuel incorrect.');
            } else if (err.response && err.response.status === 422) {
                setError('Erreur de validation des données.');
            } else {
                setError('Erreur lors de la mise à jour du mot de passe.');
            }
            setSuccess('');
        }
    };

    return (
        <>
            {showGestionCompte ? (
                <GestionCompte />
            ) : (
                <div className="w-3/4 bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label className="text-gray-600">Nom</label>
                            <input 
                                type="text" 
                                value={userData.nom || ''} 
                                readOnly 
                                className="bg-pink-50 p-2 rounded-md"
                            />
                        </div>  
                        <div className="flex flex-col">
                            <label className="text-gray-600">Prénom</label>
                            <input 
                                type="text" 
                                value={userData.prenom || ''} 
                                readOnly 
                                className="bg-pink-50 p-2 rounded-md"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-600">Mail</label>
                            <input 
                                type="email" 
                                value={userData.mail || ''} 
                                readOnly 
                                className="bg-pink-50 p-2 rounded-md"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-600">Changer le mot de passe</label>
                            <form onSubmit={handlePasswordChange} className="flex flex-col space-y-2">
                                <input
                                    type="password"
                                    placeholder="Mot de passe actuel"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="bg-pink-50 p-2 rounded-md"
                                />
                                <input
                                    type="password"
                                    placeholder="Nouveau mot de passe"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="bg-pink-50 p-2 rounded-md"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirmer le nouveau mot de passe"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="bg-pink-50 p-2 rounded-md"
                                />
                                {error && <p className="text-red-500">{error}</p>}
                                {success && <p className="text-green-500">{success}</p>}
                                <button
                                    type="submit"
                                    className="bg-pink-100 text-gray-700 px-4 py-2 rounded-md hover:bg-pink-200"
                                >
                                    Mettre à jour le mot de passe
                                </button>
                            </form>
                        </div>
                    </div>
                    {userData.admin === true && (
                        <div className="fixed bottom-4 right-4">
                            <button 
                                className="bg-pink-100 text-gray-700 px-4 py-2 rounded-md hover:bg-pink-200"
                                onClick={() => setShowGestionCompte(true)}
                            >
                                Gestion des comptes
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}