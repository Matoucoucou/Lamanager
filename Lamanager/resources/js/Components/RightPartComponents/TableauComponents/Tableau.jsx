import React, { useState, useEffect } from 'react';
import { CircleX } from "lucide-react";
import TableHeader from '@/Components/RightPartComponents/TableauComponents/TableHeader.jsx';
import TableTotal from '@/Components/RightPartComponents/TableauComponents/TableTotal.jsx';
import TableBody from '@/Components/RightPartComponents/TableauComponents/TableBody.jsx';
import useFetchData from '../../../hooks/useFetchData.js';
import { traitementNom } from '../../../utils.js';

function EnseignementComponent({ promoId, selectedEnseignements, onRemoveEnseignement, selectedTime, onCellClick, showIcons }) {
    const [activeTableau, setActiveTableau] = useState(null);
    const enseignantId = new URLSearchParams(window.location.search).get('enseignant');

    const {
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
    } = useFetchData(selectedTime, selectedEnseignements, promoId, enseignantId, activeTableau, setActiveTableau);

    const longueurSemaines = semaines.length;

    if (!selectedEnseignements || selectedEnseignements.length === 0) {
        return <h1 className="Select-enseignement">Veuillez selectionner un enseignement</h1>;
    }

    const handleTableauClick = (nom) => {
        setActiveTableau(nom);
    };

    return (
        <>
            <div className="liste-ressources">
                {selectedEnseignements.map((enseignement) => enseignement && (
                    <div
                        key={enseignement.id}
                        className={`tab-item ${activeTableau === enseignement.nom ? 'active' : ''}`}
                        onClick={() => handleTableauClick(enseignement.nom)}
                    >
                        <span style={{ display: 'flex', justifyContent: 'center', width: '45px'}} className="mr-2">{traitementNom(enseignement.nom) || 'Sans nom'}</span>
                            <CircleX size={28} className="circle-x" onClick={(e) => {
                                e.stopPropagation();
                                onRemoveEnseignement(enseignement.id);
                            }}/>
                    </div>
                ))}
            </div>

            {selectedEnseignements.map((enseignement) => enseignement && (
                <div
                    key={enseignement.id}
                    className="Tableau"
                    id={enseignement.nom}
                    style={{ display: activeTableau === enseignement.nom ? 'block' : 'none' }}
                >
                    <div className="flex flex-col">
                        <div className="mb-4 relative">
                            <table className="w-full border-collapse border border-black">
                                <thead>
                                <TableHeader
                                    enseignement={enseignement}
                                    nbGroupe={nbGroupe}
                                    nbCM={nbCM}
                                    nbTD={nbTD}
                                    nbTP={nbTP}
                                    groupNames={groupNames}
                                />
                                </thead>
                                <TableBody
                                    semaines={semaines}
                                    semainesID={semainesID}
                                    nbGroupe={nbGroupe}
                                    nbCM={nbCM}
                                    nbTD={nbTD}
                                    clickedCells={clickedCells}
                                    enseignantId={enseignantId}
                                    enseignement={enseignement}
                                    groupesID={groupesID}
                                    enseignantCode={enseignantCode}
                                    heures={heures}
                                    minutes={minutes}
                                    setClickedCells={setClickedCells}
                                    onCellClick={onCellClick}
                                    showIcons={showIcons}
                                />
                            </table>
                            <table className="w-full border-collapse border border-black sticky bottom-0 bg-white">
                            <TableTotal
                                    nbGroupe={nbGroupe}
                                    nbCM={nbCM}
                                    nbTD={nbTD}
                                    nbTP={nbTP}
                                    longueurSemaines={longueurSemaines}
                                    clickedCells={clickedCells}
                                />
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default EnseignementComponent;
