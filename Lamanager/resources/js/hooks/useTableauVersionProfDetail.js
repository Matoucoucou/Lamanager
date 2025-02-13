import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export function useTableauVersionProfDetail(anneeId) {
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

  const processedData = useMemo(() => {
    return data.length > 0 
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
  }, [data]);

  return {
    data,
    processedData,
    loading,
    error
  };
}