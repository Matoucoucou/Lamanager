import React from 'react';
import Header from '../Components/Header';
import ListesEnseignementsEnseignants from '@/Components/ListesEnseignementsEnseignants';
import LeftPart from '@/Components/LeftPart';
import RightPart from '@/Components/RightPart';
import Tableau from '@/Components/Tableau';
import BarreOutils from '@/Components/BarreOutils';

export default function Test() {
    const [selectedEnseignements, setSelectedEnseignements] = React.useState([]);
    const [selectedEnseignant, setSelectedEnseignant] = React.useState(null);

    // Récupérer le paramètre BUT depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const promoId = urlParams.get('promo_id');
    const anneeId = urlParams.get('annee_id');
    console.log(promoId);
    console.log(anneeId);
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
    const ListesEnseignementsEnseignantsWithProps = () => (
        <ListesEnseignementsEnseignants 
            promoId={promoId} 
            anneeId={anneeId}
            onEnseignementSelect={handleEnseignementSelect} 
            selectedEnseignant={selectedEnseignant}
            onEnseignantSelect={handleEnseignantSelect}
        />
    );

    // Rendu du composant Tableau avec les enseignements sélectionnés
    const TableauWithProps = () => (
        <Tableau 
            selectedEnseignements={selectedEnseignements}
            onRemoveEnseignement={handleRemoveEnseignement}
        />
    );

    return (
        <>
            <Header ComposantProp={BarreOutils} />
            <div className="app">
                {/* Left Part : Liste des enseignements */}
                <LeftPart ComposantProp={ListesEnseignementsEnseignantsWithProps} />

                {/* Right Part : Tableau des enseignements sélectionnés */}
                <RightPart ComposantProp={TableauWithProps} />
            </div>
        </>
    );
}
