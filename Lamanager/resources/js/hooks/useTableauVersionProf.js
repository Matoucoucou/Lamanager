import { useState, useEffect } from 'react';
import axios from 'axios';

export function useTableauVersionProf(anneeId) {
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

  const processData = (rawData) => {
    return rawData.map(item => {
      const total = item.CM + item.TD + item.TP;
      const equivalentTD = (item.CM * 1.5) + item.TD + (item.TP * 2/3);

      return {
        ...item,
        total,
        equivalentTD
      };
    });
  };

  const processedData = data.length > 0 ? processData(data) : [];

  return {
    data,
    processedData,
    loading,
    error
  };
}