import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AlertesVersionProf() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const fetchCaseTableauDataAll = async () => {
            setLoading(true);
            try {
                const sessionResponse = await axios.get('/api/session');
                const userId = sessionResponse.data.userId;

                const response = await axios.get(`/api/alertes/${userId}`);
                setData(response.data); 

            } catch (err) {
                console.error('Erreur lors de la récupération des données', err);
                setError('Erreur lors de la récupération des données');
            } finally {
                setLoading(false);
            }
        };

        fetchCaseTableauDataAll();
    }, []);

    const handleEditClick = (index) => {
        setEditIndex(index);
        const newEditData = { ...data[index] };
        if (index > 0) {
            newEditData.heure_min = Number(data[index - 1].heure_max) + 1;
        }
        setEditData(newEditData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleSaveClick = async () => {
        if (editData.heure_min >= editData.heure_max) {
            setError('Heure minimum doit être inférieure à heure maximum');
            return;
        }

        try {
            const updatedData = { ...editData, couleur: editData.couleur.toUpperCase() };
            await axios.put(`/api/alertes/${editData.id}`, updatedData);
            const newData = [...data];
            newData[editIndex] = updatedData;
            setData(newData);
            setEditIndex(null);
        } catch (err) {
            console.error('Erreur lors de la mise à jour des données', err);
            setError('Erreur lors de la mise à jour des données');
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Alertes</h1>
            <table className="w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Niveau</th>
                        <th className="border p-2">Heure minimum</th>
                        <th className="border p-2">Heure maximum</th>
                        <th className="border p-2">Couleur</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((alerte, index) => (
                        <tr key={alerte.id}>
                            {editIndex === index ? (
                                <>
                                    <td className="border p-2">
                                        <input type="text" name="nom" value={editData.nom} onChange={handleInputChange} className="w-full"/>
                                    </td>
                                    <td className="border p-2">
                                        <input type="number" name="heure_min" value={editData.heure_min} onChange={handleInputChange} className="w-full" disabled={index > 0} />
                                    </td>
                                    <td className="border p-2">
                                        <input type="number" name="heure_max" value={editData.heure_max} onChange={handleInputChange} className="w-full" />
                                    </td>
                                    <td className="border p-2">
                                        <input type="color" name="couleur" value={editData.couleur} onChange={handleInputChange} className="w-full" />
                                    </td>
                                    <td className="border p-2">
                                        <button onClick={handleSaveClick} className="bg-blue-500 text-white p-2">Enregistrer</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="border p-2">{alerte.nom}</td>
                                    <td className="border p-2">{alerte.heure_min}</td>
                                    <td className="border p-2">{alerte.heure_max}</td>
                                    <td className="border p-2" style={{ backgroundColor: `${alerte.couleur}` }}></td>
                                    <td className="border p-2">
                                        <button onClick={() => handleEditClick(index)} className="p-2">Modifier</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AlertesVersionProf;