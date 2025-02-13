import React, { useState } from 'react';
import { CircleX } from "lucide-react";
import TableHeader from './TableauComponents/TableHeader';
import TableTotal from './TableauComponents/TableTotal';
import TableBody from './TableauComponents/TableBody';
import useFetchData from './../hooks/useFetchData';
import { traitementNom } from '../utils';

function EnseignementComponent({ promoId, selectedEnseignements, onRemoveEnseignement, selectedTime, onCellClick, showIcons }) {
    const [activeTableau, setActiveTableau] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Ajout de isLoading et setIsLoading
    const [popupTotal, setPopupTotal] = useState({ visible: false, x: 0, y: 0, content: '' });
    const enseignantId = new URLSearchParams(window.location.search).get('enseignant');

    const {
        semainesID,
        semaines,
        groupes,
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
            <>
                {/* Popup affichée en dehors du tableau */}
                {popupTotal.visible && (
                    <div
                        style={{
                            position: 'fixed',
                            width: popupTotal.width,
                            height: popupTotal.height,
                            top: popupTotal.y - 1,
                            left: popupTotal.x,
                            backgroundColor: 'white',
                            border: '1px solid black',
                            paddingTop : '5px',
                            borderRadius: '5px',
                            zIndex: 1000,
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            display: 'flex',


                        }}
                    >

                {(Object.entries(popupTotal.content).map(([groupIndex, total]) => {
                            return <div key={groupIndex}
                                        style={{
                                            fontSize: popupTotal.frontSize,
                                            width: (popupTotal.width / popupTotal.content.length),
                                            color : popupTotal.color_list[groupIndex]}}>
                                        {total}</div>;}))}
                    </div>
                )}
                </>
            {selectedEnseignements.map((enseignement) => enseignement && (
                <div
                    key={enseignement.id}
                    className="Tableau"
                    id={enseignement.nom}
                    style={{ display: activeTableau === enseignement.nom && !isLoading ? 'block' : 'none' }}
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
                                    groupNames={groupes.map(g => g.name)}
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
                                    enseignantCode={enseignantCode}
                                    groupes={groupes}
                                    heures={heures}
                                    minutes={minutes}
                                    setClickedCells={setClickedCells}
                                    onCellClick={onCellClick}
                                    showIcons={showIcons}
                                    setIsLoading={setIsLoading}
                                />
                            </table>
                            <table className="w-full border-collapse border border-black sticky bottom-0 bg-white">
                                <TableTotal
                                    nbGroupe={nbGroupe}
                                    nbCM={nbCM}
                                    nbTD={nbTD}
                                    nbTP={nbTP}
                                    enseignement={enseignement}
                                    longueurSemaines={longueurSemaines}
                                    clickedCells={clickedCells}
                                    setPopupTotal={setPopupTotal}
                                />
                            </table>
                        </div>
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="loading-overlay-right" style={loadingOverlayRightStyle}>
                    <div className="loading-spinner" style={loadingSpinnerStyle}></div>
                </div>
            )}
        </>
    );
}

const loadingOverlayRightStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const loadingSpinnerStyle = {
    width: '100px',
    height: '100px',
    border: '5px solid rgba(0, 0, 0, 0.1)',
    borderTop: '5px solid #564787', // Changement de couleur en violet
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
};

export default EnseignementComponent;

