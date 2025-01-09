import React from 'react';
import Header from '../Components/Header';
import ListesEnseignementsEnseignants from '../Components/TableauLeftPart/ListesEnseignementsEnseignants';
import LeftPart from '@/Components/LeftPart';
import RightPart from '@/Components/RightPart';
import Tableau from '@/Components/Tableau';
import BarreOutils from '@/Components/BarreOutils';

export default function Test() {
    const [selectedEnseignements, setSelectedEnseignements] = React.useState([]);
    const [selectedEnseignant, setSelectedEnseignant] = React.useState(null);
    const [selectedTime, setSelectedTime] = React.useState('02:00');
    const [showNoEnseignantPopup, setShowNoEnseignantPopup] = React.useState(false);
    const [showIcons, setShowIcons] = React.useState(false); // Ajouter l'état showIcons
    // Récupérer le paramètre BUT depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const promoId = urlParams.get('promo_id');
    const anneeId = urlParams.get('annee_id');
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

    const ListesEnseignementsEnseignantsWithProps = () => (
        <ListesEnseignementsEnseignants 
            promoId={promoId} 
            anneeId={anneeId}
            onEnseignementSelect={handleEnseignementSelect} 
            selectedEnseignant={selectedEnseignant}
            onEnseignantSelect={handleEnseignantSelect}
            onTimeSelect={handleTimeSelect}
            defaultTime={selectedTime}
        />
    );

    // Rendu du composant Tableau avec les enseignements sélectionnés
    const TableauWithProps = () => (
        <Tableau 
            promoId={promoId} 
            selectedEnseignements={selectedEnseignements}
            onRemoveEnseignement={handleRemoveEnseignement}
            selectedTime={selectedTime}
            onCellClick={() => setShowNoEnseignantPopup(true)}
            showIcons={showIcons} // Passer showIcons en prop à Tableau
        />
    );

    return (
        <>
            <Header ComposantProp={() => <BarreOutils toggleIcons={toggleIcons} />} />
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

