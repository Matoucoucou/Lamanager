import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TableauVersionProfDetail({ anneeId }) {
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
        // Regroupement par semaine
        const semaineSummary = {};

        response.data.forEach((caseItem) => {
          const enseignementName = caseItem.nom;
          const enseignementSemaine = caseItem.numero;
          
          if (!semaineSummary[enseignementSemaine]) {
            semaineSummary[enseignementSemaine] = {
              semaine: enseignementSemaine,
              enseignements: {},
              totalCM: 0,
              totalTD: 0,
              totalTP: 0
            };
          }

          // Initialiser l'enseignement s'il n'existe pas
          if (!semaineSummary[enseignementSemaine].enseignements[enseignementName]) {
            semaineSummary[enseignementSemaine].enseignements[enseignementName] = {
              nom: enseignementName,
              CM: 0,
              TD: 0,
              TP: 0
            };
          }

          const hours = caseItem.nombre_heure || 0;
          const minutes = caseItem.nombre_minute || 0;
          const type = caseItem.type;
          const totalHours = hours + minutes / 60;

          // Mettre à jour les heures pour l'enseignement
          semaineSummary[enseignementSemaine].enseignements[enseignementName][type] += totalHours;
          
          // Mettre à jour les totaux par type de cours pour la semaine
          semaineSummary[enseignementSemaine][`total${type}`] += totalHours;
        });

        // Convertir en tableau final
        const formattedSemaineData = Object.values(semaineSummary).map(semaine => ({
          ...semaine,
          enseignements: Object.values(semaine.enseignements)
        }));

        // Trier les semaines par numéro
        formattedSemaineData.sort((a, b) => a.semaine - b.semaine);
        setData(formattedSemaineData);
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
      const total = item.totalCM + item.totalTD + item.totalTP;
      return {
        ...item,
        total
      };
    })
    .sort((a, b) => {
      const numA = parseInt(a.semaine.replace('S', ''), 10);
      const numB = parseInt(b.semaine.replace('S', ''), 10);
      return numA - numB;
    })
  : [];
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <table className="w-full border-collapse border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2" colSpan="2">Enseignement</th>
          {processedData.map(item => (
            <th key={item.semaine} className="border p-2">{item.semaine}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Récupérer les noms uniques des enseignements */}
        {[...new Set(processedData.flatMap(item => 
          item.enseignements.map(ens => ens.nom)
        ))].map(enseignementName => (
          <>
            <tr key={enseignementName}>
              <th className="border p-2 font-bold" rowSpan={4}>{enseignementName}</th>
            </tr>
            {['CM', 'TD', 'TP'].map(type => (
              <tr key={`${enseignementName}-${type}`}>
                <th className="border p-2">{type}</th>
                {processedData.map(item => {
                  // Trouver l'enseignement correspondant
                  const enseignement = item.enseignements.find(
                    ens => ens.nom === enseignementName
                  );
                  return (
                    <td key={`${item.semaine}-${type}`} className="border p-2">
                      {enseignement ? (enseignement[type] > 0 ? `${enseignement[type].toFixed(2)}h` : '-') : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th className="bg-gray-100 border p-2" colSpan="2">Total</th>
          {processedData.map(item => (
            <td key={item.semaine} className="border p-2">
              {item.total.toFixed(2)+'h'}
            </td>
          ))}
        </tr>
      </tfoot>
    </table>
  )
};