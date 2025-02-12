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

    useEffect(() => {
        if (editIndex !== null) {
            setEditData(prevEditData => ({
                ...prevEditData,
                couleur: prevEditData.couleur.toLowerCase()
            }));
        }
    }, [editIndex]);

    const handleEditClick = (index) => {
        setEditIndex(index);
        setEditData(data[index]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleSaveClick = async () => {
        try {
            const updatedData = { ...editData, couleur: editData.couleur.toUpperCase() };
            await axios.put(`/api/alertes/${editData.id}`, updatedData);
            const newData = [...data];
            newData[editIndex] = updatedData;
            setData(newData);
            setEditIndex(null);
            window.location.reload(); // Refresh the page
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
                                        <input type="number" name="heure_min" value={editData.heure_min} onChange={handleInputChange} className="w-full" />
                                    </td>
                                    <td className="border p-2">
                                        <input type="number"  name="heure_max" value={editData.heure_max} onChange={handleInputChange} className="w-full" />
                                    </td>
                                    <td className="border p-2">
                                        <input type="color" name="couleur" value={editData.couleur.toUpperCase()} onChange={handleInputChange} className="w-full" />
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
                                    <button onClick={() => handleEditClick(index)} className="p-2">Modifier</button>
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