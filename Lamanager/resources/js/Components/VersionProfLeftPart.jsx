import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import MenuAnnee from './MenuAnnee';
import EnseignementListeVersionProf from './EnseignementListeVersionProf';
import TableauVersionProf from './TableauVersionProf';
import TableauVersionProfDetail from './TableauVersionProfDetail';
import AlertesVersionProf from './AlertesVersionProf';

export default function VersionProfLeftPart({ onSelectionChange }) {
    const [selectedAnnee, setSelectedAnnee] = useState(null);
    const [selectedEnseignement, setSelectedEnseignement] = useState(null);  
    const [isAllEnseignementsSelected, setIsAllEnseignementsSelected] = useState(false);
    const [showGroupes, setShowGroupes] = useState(false);
    const [showTableauPopup, setShowTableauPopup] = useState(false);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [showAlertesPopup,setShowAlertesPopup] = useState(false);

    const handleAnneeSelect = (annee) => {
        setSelectedAnnee(annee);
    };

    const handleTableauClick = () => {
        setShowTableauPopup(true);
    };

    const handleCloseTableauPopup = () => {
        setShowTableauPopup(false);
    };

    const handleAlertesClick = () => {
        setShowAlertesPopup(true);
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
        }
        if (isAllEnseignementsSelected) {
            onSelectionChange({selectedAnnee, all: "all"});
        }
    };
    return (
        <div>
            <MenuAnnee 
                selectedAnnee={selectedAnnee} 
                onAnneeSelect={handleAnneeSelect} 
            />
            {selectedAnnee && (
                <EnseignementListeVersionProf 
                    anneeId={selectedAnnee.id} 
                    onEnseignementSelect={setSelectedEnseignement} 
                    setIsAllEnseignementsSelected={setIsAllEnseignementsSelected}
                />
            )}
            <div className="p-4 pt-0">
                <label>
                    <input 
                        type="checkbox" 
                        checked={showGroupes}
                        onChange={() => setShowGroupes(!showGroupes)}  
                        className="mr-2 p-[5px] rounded border-2 border-[#564787] scale-125"
                    />
                    Groupes
                </label>
            </div>
            <div className="button-container">  
                <button onClick={handleTableauClick}>Tableau</button>
                <button onClick={handleAlertesClick}>Alertes</button>
            </div> 
            <div className="button-container">
                <button 
                    onClick={handleSelectionChange} 
                    className="flex items-center justify-center space-x-2"
                >
                    <Eye color="#ffffff" />
                    <span>Visualiser</span>
                </button>
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
            {showAlertesPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] relative">
                        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
                            
                            <button 
                                onClick={() => setShowAlertesPopup(false)} 
                                className="text-2xl font-bold hover:text-red-600">
                                &times;
                            </button>
                        
                            <div className="p-6 overflow-auto max-h-[calc(90vh-60px)]">
                            <AlertesVersionProf />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
