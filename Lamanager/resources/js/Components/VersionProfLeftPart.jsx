import React, { useState, useEffect } from 'react';
import MenuAnnee from './MenuAnnee';
import EnseignementListeVersionProf from './EnseignementListeVersionProf';
import TableauVersionProf from './TableauVersionProf';
import TableauVersionProfDetail from './TableauVersionProfDetail';

export default function VersionProfLeftPart({ onSelectionChange }) {
    const [selectedAnnee, setSelectedAnnee] = useState(null);
    const [selectedEnseignement, setSelectedEnseignement] = useState(null);  
    const [isAllEnseignementsSelected, setIsAllEnseignementsSelected] = useState(false);
    const [showGroupes, setShowGroupes] = useState(false);
    const [showTableauPopup, setShowTableauPopup] = useState(false);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);

    const handleTableauClick = () => {
        setShowTableauPopup(true);
    };

    const handleCloseTableauPopup = () => {
        setShowTableauPopup(false);
    };

    const handleDetailsClick = () => {
        setShowDetailsPopup(true);
    };

    const handleCloseDetailsPopup = () => {
        setShowDetailsPopup(false);
    };

    const handleSelectionChange = () => {
        if (selectedAnnee && selectedEnseignement) {    
            onSelectionChange({ selectedAnnee, selectedEnseignement, showGroupes });
            console.log(selectedAnnee, selectedEnseignement, showGroupes);
        }
    };

    useEffect(() => {
        if (isAllEnseignementsSelected) {
            onSelectionChange({selectedAnnee, all: "all"});
        }
    }, [isAllEnseignementsSelected]);

    return (
        <div>
            <MenuAnnee 
                onAnneeSelect={setSelectedAnnee} 
            />
            {selectedAnnee && (
                <EnseignementListeVersionProf 
                    anneeId={selectedAnnee.id} 
                    onEnseignementSelect={setSelectedEnseignement} 
                    setIsAllEnseignementsSelected={setIsAllEnseignementsSelected}
                />
            )}
            <div className="button-container">
                <label className="flex items-center">
                    <input 
                        type="checkbox" 
                        checked={showGroupes}
                        onChange={() => setShowGroupes(!showGroupes)}  
                        className="mr-2"
                    />
                    Groupes
                </label>
                <button onClick={handleTableauClick}>Tableau</button>
            </div> 
            <div className="button-container">
                <button>Alertes</button>
                <button onClick={handleSelectionChange}>Appliquer Sélection</button>
            </div>

            {showTableauPopup && selectedAnnee && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative">
                    <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
                        <button 
                            onClick={handleCloseTableauPopup} 
                            className="absolute top-4 right-4 text-2xl font-bold hover:text-red-600"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Tableau des Enseignements</h2>
                    </div>
                        <TableauVersionProf anneeId={selectedAnnee.id} />
                        <div className="button-container">
                            <button onClick={handleDetailsClick}>Détail Semaine</button>
                        </div>
                    </div>
                </div>
            )}

            {showDetailsPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] relative">
                        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
                            <h2 className="text-2xl font-bold">Détail Semaine</h2>
                            <button 
                                onClick={handleCloseDetailsPopup} 
                                className="text-2xl font-bold hover:text-red-600">
                                &times;
                                </button>
                        </div>
                        <div className="p-6 overflow-auto max-h-[calc(90vh-60px)]">
                            <TableauVersionProfDetail anneeId={selectedAnnee.id} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
