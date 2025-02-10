import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HistogrammeGroupe from '@/Components/HistogrammeGroupe';
import HistogrammeTousEnseignements from '@/Components/HistogrammeTousEnseignements';
import Histogramme from '@/Components/Histogramme';

export default function VersionProfRightPart({ selections }) {
  const [dataForChart, setDataForChart] = useState([]);
  const [dataForGroupes, setDataForGroupes] = useState([]);
  const [dataForEnseignements, setDataForEnseignements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAllEnseignementsSelected, setIsAllEnseignementsSelected] = useState(false);
  const [alertes, setAlertes] = useState([]);
  const [alertesLoaded, setAlertesLoaded] = useState(false);

  useEffect(() => {
    fetchAlertes();
  }, []);

  useEffect(() => {
    if (alertesLoaded) {
    //console.log('Enseignement sélectionné right:', selections);
    if (selections.selectedAnnee && selections.selectedEnseignement) {
      fetchCaseTableauData(selections.selectedAnnee.id, selections.selectedEnseignement.id);
    }
    if (selections.all === "all") {
      setIsAllEnseignementsSelected(true);
      fetchCaseTableauDataAll(selections.selectedAnnee.id);
    } else {
      setIsAllEnseignementsSelected(false);
    }}
  }, [alertesLoaded,selections]);

  const fetchAlertes = async () => {
    try {
      const sessionResponse = await axios.get('/api/session');
      const userId = sessionResponse.data.userId;
      const response = await axios.get(`/api/alertes/${userId}`);
      //console.log('alertes:', response.data);
      setAlertes(response.data);
      setAlertesLoaded(true);
    } catch (err) {
      console.error('Erreur lors de la récupération des alertes', err);
    }
  };

  const fetchCaseTableauData = async (anneeId, enseignementId) => {
    setLoading(true);
    try {
      const sessionResponse = await axios.get('/api/session');
      const userId = sessionResponse.data.userId;

      const response = await axios.get(`/api/cases/recherche/${anneeId}/${enseignementId}/${userId}`);
      //console.log('data:', response.data);
      processData(response.data, false);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des données', err);
      setError('Erreur lors de la récupération des données');
      setLoading(false);
    }
  };

  const fetchCaseTableauDataAll = async (anneeId) => {
    setLoading(true);
    try {
      const sessionResponse = await axios.get('/api/session');
      const userId = sessionResponse.data.userId;

      const response = await axios.get(`/api/cases/rechercheComplete/${anneeId}/${userId}`);
      processData(response.data, true);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des données', err);
      setError('Erreur lors de la récupération des données');
      setLoading(false);
    }
  };
  const getCouleurForHeures = (heure) => {
    //console.log('Heure:', heure);
    if (alertes.length === 0) {
        //console.log('Aucune alerte disponible');
        return '#AD71C1'; 
    }
    for (let alerte of alertes) {
        //console.log('Alerte:', alerte);
        //console.log('Heure min:', alerte.heure_min);
        //console.log('Heure max:', alerte.heure_max); 
        if (heure >= alerte.heure_min && heure <= alerte.heure_max) {
            //console.log('Match found:', alerte);
            return `${alerte.couleur}`;
        }
    }
    return '#AD71C1'; 
  };

  const processData = (cases, isAllEnseignementsSelected) => {
    const weeksData = {};
    const groupesData = {};
    const enseignements = new Set();
  
    cases.forEach((caseItem) => {
      const weekId = caseItem.semaine_id;
      const hours = caseItem.nombre_heure;
      const minutes = caseItem.nombre_minute || 0;
      const type = caseItem.type;
      const enseignement = caseItem.nom;
  
      if (!weeksData[weekId]) {
        weeksData[weekId] = {total: 0};
      }
      
      weeksData[weekId].total += hours + minutes / 60;
      enseignements.add(enseignement);

      if (!weeksData[weekId][enseignement]) {
        weeksData[weekId][enseignement] = 0;
      }
      weeksData[weekId][enseignement] += hours + minutes / 60;
      
      if (!groupesData[weekId]) {
        groupesData[weekId] = { CM: 0, TD: 0, TP: 0 };
      }
      groupesData[weekId][type] += hours + minutes / 60;
    });

    const allEnseignements = Array.from(enseignements);
    
    const formattedData = Object.keys(weeksData).map(weekId => ({
      semaine: `S${weekId}`,
      heures: weeksData[weekId].total,
      couleur: getCouleurForHeures(weeksData[weekId].total)
    }));

    const formattedEnseignementsData = Object.keys(weeksData).map(weekId => {
      const weekData = { semaine: `S${weekId}`, total: weeksData[weekId].total };
      allEnseignements.forEach(enseignement => {
        weekData[enseignement] = weeksData[weekId][enseignement] || 0;
      });
      return weekData;
    });

    const formattedGroupesData  = Object.keys(groupesData).map(weekId => ({
      semaine: `S${weekId}`,
      CM: groupesData[weekId].CM,
      TD: groupesData[weekId].TD,
      TP: groupesData[weekId].TP,
    }));

    //console.log('data groupes:', formattedGroupesData);
    //console.log('data histogramme:', formattedData);
  
    if (isAllEnseignementsSelected) {
      setDataForEnseignements(formattedEnseignementsData);
    } else {
      setDataForChart(formattedData);
    }
    setDataForGroupes(formattedGroupesData);
  };

  const refreshData = () => {
    if (selections.selectedAnnee && selections.selectedEnseignement) {
      fetchCaseTableauData(selections.selectedAnnee.id, selections.selectedEnseignement.id);
    }
    if (selections.all === "all") {
      fetchCaseTableauDataAll(selections.selectedAnnee.id);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;


  return (
    <div className='histogramme'>
      {selections.showGroupes ? (
        <HistogrammeGroupe data={dataForGroupes} />
      ) : (
        isAllEnseignementsSelected ? (
          <HistogrammeTousEnseignements data={dataForEnseignements} />
        ) : (
          dataForChart.length >=   1 && (
            <Histogramme data={dataForChart} alertes={alertes}/>
          )
        )
      )}
    </div>
  );
}