import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import ListesEnseignementsEnseignants from '../Components/TableauLeftPart/ListesEnseignementsEnseignants';
import LeftPart from '@/Components/LeftPart';
import RightPart from '@/Components/RightPart';
import Tableau from '@/Components/Tableau';
import BarreOutils from '@/Components/BarreOutils/BarreOutils.jsx';
import BoutonProfil from '@/Components/Profil/BoutonProfil.jsx';

export default function PageTableau() {
    // Déplacer la déclaration de urlParams avant son utilisation
    const urlParams = new URLSearchParams(window.location.search);
    const promoId = urlParams.get('promo_id');
    const anneeId = urlParams.get('annee_id');

    const [selectedEnseignements, setSelectedEnseignements] = useState([]);
    const [selectedEnseignant, setSelectedEnseignant] = useState(null);
    const [selectedTime, setSelectedTime] = useState('02:00');
    const [showNoEnseignantPopup, setShowNoEnseignantPopup] = useState(false);
    const [showIcons, setShowIcons] = useState(false);
    const [currentPromoId, setCurrentPromoId] = useState(promoId);
    const [alternantId, setAlternantId] = useState(null);


    const handleEnseignementSelect = (enseignement) => {
        if (enseignement && !selectedEnseignements.some(e => e.id === enseignement.id)) {
            setSelectedEnseignements([...selectedEnseignements, enseignement]);
        }
    };

    // Fonction pour supprimer un enseignement de la liste sélectionnée
    const handleRemoveEnseignement = (enseignementId) => {
        setSelectedEnseignements(selectedEnseignements.filter(e => e.id !== enseignementId));
    };

    const handleEnseignantSelect = (enseignant) => {
        setSelectedEnseignant(enseignant);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);

    };

    const toggleIcons = () => {
        setShowIcons(!showIcons);
    };

    useEffect(() => {
        const fetchPromoData = async () => {
            try {
                const response = await fetch(`/api/promo/${promoId}`);
                const data = await response.json();
                setAlternantId(data.alternant_id);
            } catch (error) {
                console.error('Error fetching promo data:', error);
            }
        };
        fetchPromoData();
    }, [promoId]);

    const handleAlternantChange = (isChecked) => {
        setCurrentPromoId(isChecked ? alternantId : promoId);
    };

    const ListesEnseignementsEnseignantsWithProps = () => (
        <ListesEnseignementsEnseignants
            promoId={promoId}
            anneeId={anneeId}
            onEnseignementSelect={handleEnseignementSelect}
            selectedEnseignant={selectedEnseignant}
            onEnseignantSelect={handleEnseignantSelect}
            onTimeSelect={handleTimeSelect}
            defaultTime={selectedTime}
            onAlternantChange={handleAlternantChange}
        />
    );

    // Rendu du composant Tableau avec les enseignements sélectionnés
    const TableauWithProps = () => (
        <Tableau
            promoId={currentPromoId}
            selectedEnseignements={selectedEnseignements}
            onRemoveEnseignement={handleRemoveEnseignement}
            selectedTime={selectedTime}
            onCellClick={() => setShowNoEnseignantPopup(true)}
            showIcons={showIcons} // Passer showIcons en prop à Tableau
        />
    );

    return (
        <>
            <Header ComposantProp={() => <BarreOutils lockButton = {false} toggleIcons={toggleIcons} />} isAdmin={true}/>
            <div className="app">
                <LeftPart ComposantProp={ListesEnseignementsEnseignantsWithProps} />
                <RightPart ComposantProp={TableauWithProps} />
            </div>

            {showNoEnseignantPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Attention</h2>
                        <p>Veuillez sélectionner un enseignant avant de remplir le tableau.</p>
                        <button onClick={() => setShowNoEnseignantPopup(false)}>Fermer</button>
                    </div>
                </div>
            )}
        </>
    );
}

