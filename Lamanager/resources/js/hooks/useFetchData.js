import { useState, useEffect } from 'react';
import { fetchGroupes, fetchSemaines, fetchEnseignant, fetchCases, fetchEnseignantCodes } from '../api';

function useFetchData(selectedTime, selectedEnseignements, promoId, enseignantId, activeTableau, setActiveTableau) {
    const [semainesID, setSemainesID] = useState([]);
    const [semaines, setSemaines] = useState([]);
    const [groupesID, setGroupesID] = useState([]);
    const [groupNames, setGroupNames] = useState([]);
    const [nbCM, setNbCM] = useState(0);
    const [nbTP, setNbTP] = useState(0);
    const [nbTD, setNbTD] = useState(0);
    const [nbGroupe, setNbGroupe] = useState(0);
    const [enseignantCode, setEnseignantCode] = useState('');
    const [heures, setHeures] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [casesData, setCasesData] = useState([]);
    const [clickedCells, setClickedCells] = useState({});

    const processGroupes = (groupesData) => {
        const countCM = groupesData.filter((g) => g.type === 'CM').length;
        const countTP = groupesData.filter((g) => g.type === 'TP').length;
        const countTD = groupesData.filter((g) => g.type === 'TD').length;

        const cmGroups = groupesData.filter((g) => g.type === 'CM').sort((a, b) => a.nom.localeCompare(b.nom));
        const tdGroups = groupesData.filter((g) => g.type === 'TD').sort((a, b) => a.nom.localeCompare(b.nom));
        const tpGroups = groupesData.filter((g) => g.type === 'TP').sort((a, b) => a.nom.localeCompare(b.nom));

        const ids = [...cmGroups.map((g) => g.id), ...tdGroups.map((g) => g.id), ...tpGroups.map((g) => g.id)];
        const names = [...cmGroups.map((g) => g.nom), ...tdGroups.map((g) => g.nom), ...tpGroups.map((g) => g.nom)];

        setNbCM(countCM);
        setNbTP(countTP);
        setNbTD(countTD);
        setNbGroupe(groupesData.length);
        setGroupesID(ids);
        setGroupNames(names);
    };

    const handleCasesData = async (enseignementId, ids, semainesData) => {
        const casesData = await fetchCases(enseignementId);
        const enseignantIds = [...new Set(casesData.map((item) => item.enseignant_id))];
        const enseignantCodes = await fetchEnseignantCodes(enseignantIds);

        const newClickedCells = {};
        casesData.forEach((caseItem) => {
            const semaineIndex = semainesData.findIndex((s) => s.id === caseItem.semaine_id);
            const groupeIndex = ids.findIndex((g) => g === caseItem.groupe_id);

            console.log('caseItem.groupe_id:', caseItem.groupe_id); // Ajout de log
            console.log('ids:', ids); // Ajout de log

            if (semaineIndex !== -1 && groupeIndex !== -1) {
                const key = `${semaineIndex}-${groupeIndex}`;
                newClickedCells[key] = {
                    clicked: true,
                    text: `${caseItem.nombre_heure}h${caseItem.nombre_minute || ''} - ${enseignantCodes[caseItem.enseignant_id]}`,
                    heures: caseItem.nombre_heure,
                    minutes: caseItem.nombre_minute,
                    enseignantId: caseItem.enseignant_id,
                    enseignantCode: enseignantCodes[caseItem.enseignant_id],
                };
            }
        });

        console.log('newClickedCells', newClickedCells);
        console.log('casesData',casesData);

        setCasesData(casesData);
        setClickedCells(newClickedCells);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (typeof selectedTime === 'string' && selectedTime.includes(':')) {
                    const [h, m] = selectedTime.split(':').map(Number);
                    setHeures(h);
                    setMinutes(m);
                } else {
                    setHeures(0);
                    setMinutes(0);
                }

                if (!selectedEnseignements || selectedEnseignements.length === 0) {
                    return;
                }

                if (selectedEnseignements.length > 0 && !activeTableau) {
                    const dernierEnseignement = selectedEnseignements[selectedEnseignements.length - 1];
                    setActiveTableau(dernierEnseignement.nom);
                }

                const groupesData = await fetchGroupes(promoId);
                processGroupes(groupesData);

                const semainesData = await fetchSemaines();
                setSemainesID(semainesData.map((s) => s.id));
                setSemaines(semainesData.map((s) => s.numero));

                const enseignantData = await fetchEnseignant(enseignantId);
                if (enseignantData && enseignantData.code) {
                    setEnseignantCode(enseignantData.code);
                }

                if (activeTableau) {
                    const enseignementId = selectedEnseignements.find((e) => e.nom === activeTableau)?.id;
                    if (enseignementId) {
                        await handleCasesData(enseignementId, groupesID, semainesData);
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchData();
    }, [selectedTime, selectedEnseignements, activeTableau, promoId, enseignantId]);

    return {
        semainesID,
        semaines,
        groupesID,
        groupNames,
        nbCM,
        nbTP,
        nbTD,
        nbGroupe,
        enseignantCode,
        heures,
        minutes,
        clickedCells,
        setClickedCells,
    };
}

export default useFetchData;
