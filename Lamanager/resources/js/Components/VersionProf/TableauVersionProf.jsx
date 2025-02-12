import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TableauVersionProf({ anneeId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaseTableauDataAll = async () => {
      setLoading(true);
      try {
        const sessionResponse = await axios.get('/api/session');
        const userId = sessionResponse.data.userId;
  
        const response = await axios.get(`/api/cases/rechercheComplete/${anneeId}/${userId}`);
        
        // Process data
        const enseignementsData = {};
        response.data.forEach((caseItem) => {
          const enseignementName = caseItem.nom;
          
          if (!enseignementsData[enseignementName]) {
            enseignementsData[enseignementName] = { 
              enseignement: enseignementName,
              CM: 0, 
              TD: 0, 
              TP: 0 
            };
          }

          const hours = caseItem.nombre_heure || 0;
          const minutes = caseItem.nombre_minute || 0;
          const type = caseItem.type;

          enseignementsData[enseignementName][type] += hours + minutes / 60;
        });

        const formattedEnseignementsData = Object.values(enseignementsData);
        console.log(formattedEnseignementsData);
        setData(formattedEnseignementsData);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des données', err);
        setError('Erreur lors de la récupération des données');
        setLoading(false);
      }
    };

    if (anneeId) {
      fetchCaseTableauDataAll();
    }
  }, [anneeId]);

  const processedData = data.length > 0 
    ? data.map(item => {
        const total = item.CM + item.TD + item.TP;
        const equivalentTD = (item.CM * 1.5) + item.TD + (item.TP * 2/3);

        return {
          ...item,
          total,
          equivalentTD
        };
      })
    : [];

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <table className="w-full border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Enseignement</th>
          <th className="border p-2">CM</th>
          <th className="border p-2">TD</th>
          <th className="border p-2">TP</th>
          <th className="border p-2">Total</th>
          <th className="border p-2">Equivalent TD</th>
        </tr>
      </thead>
      <tbody>
        {processedData.length > 0 ? (
          processedData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border p-2 text-center">{row.enseignement}</td>
              <td className="border p-2 text-right">{row.CM.toFixed(2)}</td>
              <td className="border p-2 text-right">{row.TD.toFixed(2)}</td>
              <td className="border p-2 text-right">{row.TP.toFixed(2)}</td>
              <td className="border p-2 text-right">{row.total.toFixed(2)}</td>
              <td className="border p-2 text-right">{row.equivalentTD.toFixed(2)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center p-4">Aucune donnée disponible</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}