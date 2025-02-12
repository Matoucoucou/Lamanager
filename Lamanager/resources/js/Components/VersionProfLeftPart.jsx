import React, { useState, useEffect } from 'react';
import MenuAnnee from './MenuAnnee';
import EnseignementListeVersionProf from './EnseignementListeVersionProf';
import TableauVersionProf from './TableauVersionProf';
import TableauVersionProfDetail from './TableauVersionProfDetail';
import { useTableauVersionProf } from '../hooks/useTableauVersionProf';
import { usePDFDownload } from '../hooks/usePDFDownload';

export default function VersionProfLeftPart({ onSelectionChange }) {
    const [selectedAnnee, setSelectedAnnee] = useState(null);
    const [selectedEnseignement, setSelectedEnseignement] = useState(null);  
    const [isAllEnseignementsSelected, setIsAllEnseignementsSelected] = useState(false);
    const [showGroupes, setShowGroupes] = useState(false);
    const [showTableauPopup, setShowTableauPopup] = useState(false);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [processedTableauData, setProcessedTableauData] = useState([]);
    const [processedDetailsData, setProcessedDetailsData] = useState([]);

    const { processedData } = useTableauVersionProf(selectedAnnee?.id);
    const { downloadTableauRecapitulatif, downloadTableauDetails } = usePDFDownload();

    useEffect(() => {
        // Only update if processedData has changed and is not empty
        if (processedData.length > 0 && 
            JSON.stringify(processedData) !== JSON.stringify(processedTableauData)) {
            setProcessedTableauData(processedData);
        }
    }, [processedData]);

    useEffect(() => {
        if (selectedAnnee && selectedEnseignement) {    
            onSelectionChange({ selectedAnnee, selectedEnseignement, showGroupes });
        }
    }, [selectedAnnee, selectedEnseignement, showGroupes, onSelectionChange]);

    const handleGroupesClick = () => {
        setShowGroupes(prevShowGroupes => !prevShowGroupes);
        if (selectedAnnee && selectedEnseignement) {
          onSelectionChange({ selectedAnnee, selectedEnseignement, showGroupes: !showGroupes });
        }
      };

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

    const handleDownloadTableauClick = () => {
        downloadTableauRecapitulatif(processedTableauData);
    };

    const handleDownloadDetailsClick = () => {
        downloadTableauDetails(processedDetailsData);
    };

    const handleDetailsDataReady = (data) => {
        setProcessedDetailsData(data);
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
                <button onClick={handleGroupesClick}>Groupes</button>
                <button onClick={handleTableauClick}>Tableau</button>
                <button>Alertes</button>
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
                            <button onClick={handleDownloadTableauClick}>Télécharger PDF</button>
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
                            <TableauVersionProfDetail 
                                anneeId={selectedAnnee.id} 
                                onDataReady={handleDetailsDataReady} 
                            />
                            <div className="button-container">
                                <button onClick={handleDownloadDetailsClick}>Télécharger PDF</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
