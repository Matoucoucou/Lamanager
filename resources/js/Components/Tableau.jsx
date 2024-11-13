import React, { useState, useEffect } from 'react';
import { CircleX } from "lucide-react";

function EnseignementComponent({ selectedEnseignements, onRemoveEnseignement }) {
    const [clickedCells, setClickedCells] = useState({});
    if (!selectedEnseignements || selectedEnseignements.length === 0) {
        return <h1 className="Select-enseignement">Veuillez selectionner un enseignement</h1>;
    }

    const [activeTableau, setActiveTableau] = useState(null);

    useEffect(() => {
        if (selectedEnseignements.length > 0) {
            const dernierEnseignement = selectedEnseignements[selectedEnseignements.length - 1];
            setActiveTableau(dernierEnseignement.nom);
        }
    }, [selectedEnseignements]);

    const handleTableauClick = (nom) => {
            setActiveTableau(nom);
    };

    const handleCellClick = (rowIndex, colIndex) => {
        const key = `${rowIndex}-${colIndex}`;
        const params = new URLSearchParams(window.location.search);
        const enseignant = params.get('enseignant') || 'Inconnu';
    
        setClickedCells((prev) => {
            const updatedCells = { ...prev };
    
            if (colIndex === 0) {
                // Gérer la sélection de la ligne entière
                const isRowFullyColored = [1, 2, 3, 4, 5, 6, 7].every(
                    (col) => updatedCells[`${rowIndex}-${col}`] && updatedCells[`${rowIndex}-${col}`].clicked
                );
    
                if (isRowFullyColored) {
                    // Si toute la ligne est colorée, on réinitialise toutes les cases
                    for (let i = 1; i <= 7; i++) {
                        updatedCells[`${rowIndex}-${i}`] = { clicked: false, text: "" };
                    }
                } else {
                    // Sinon, on colore toutes les cases de cette ligne
                    for (let i = 1; i <= 7; i++) {
                        updatedCells[`${rowIndex}-${i}`] = { clicked: true, text: `2h - ${enseignant}` };
                    }
                }
            } else {
                // Inverser l'état de la cellule spécifique
                if (!updatedCells[key]) {
                    updatedCells[key] = { clicked: false, text: "" };
                }
    
                const cell = updatedCells[key];
                if (cell.text === "") {
                    updatedCells[key] = { clicked: true, text: `2h - ${enseignant}` };
                } else {
                    updatedCells[key] = { clicked: false, text: "" };
                }
            }
    
            return updatedCells;
        });
    };

    const getColorClass = (colIndex) => {
        if (colIndex === 1) return 'bg-yellow-300';
        if (colIndex === 2 || colIndex === 3) return 'bg-red-300';
        if (colIndex >= 4 && colIndex <= 7) return 'bg-blue-300';
        return '';
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
                        <span style={{ display: 'flex', justifyContent: 'center', width: '45px'}} className="mr-2">{enseignement.nom || 'Sans nom'}</span>
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
                                    <tr>
                                        <th className="border border-black p-2" style={{ width: '70px', height: '70px' }}>{enseignement.nom}</th>
                                        <th className="border border-black p-2" style={{ width: '13%' }}>CM</th>
                                        <th className="border border-black p-2" style={{ width: '26%' }} colSpan="2">TD</th>
                                        <th className="border border-black p-2" style={{ width: '52%' }} colSpan="4">TP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10'].map((row, rowIndex) => (
                                        <tr key={row}>
                                            <td
                                                className="border border-black p-2"
                                                style={{ height: '70px', cursor: row !== 'Total' ? 'pointer' : 'default' }}
                                                onClick={row !== 'Total' ? () => handleCellClick(rowIndex, 0): null}
                                            >
                                                {row}
                                            </td>
                                            {[1, 2, 3, 4, 5, 6, 7].map((colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    className={`border border-black p-2 ${clickedCells[`${rowIndex}-${colIndex}`]?.clicked ? getColorClass(colIndex) : ''} `}
                                                    style={{ cursor: row !== 'Total' ? 'pointer' : 'default', width: '13%' }}
                                                    onClick={row !== 'Total' ? () => handleCellClick(rowIndex, colIndex): null}
                                                >
                                                    {clickedCells[`${rowIndex}-${colIndex}`]?.text && <h3>{clickedCells[`${rowIndex}-${colIndex}`].text}</h3>}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <table className="w-full border-collapse border border-black sticky bottom-0 bg-white">
                                <colgroup>
                                    <col style={{ width: '70px' }} />
                                    <col style={{ width: '13%' }} />
                                    <col style={{ width: '26%' }} />
                                    <col style={{ width: '52%' }} />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <td className="border border-black p-2" style={{ height: '70px' }}>Total</td>
                                        {[1, 2, 3].map((colIndex) => (
                                            <td
                                                key={colIndex}
                                                className={`border border-black p-2 ${clickedCells[`10-${colIndex}`]?.clicked ? getColorClass(colIndex) : ''}`}
                                            >
                                                {clickedCells[`10-${colIndex}`]?.text && <span>{clickedCells[`10-${colIndex}`].text}</span>}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default EnseignementComponent;
