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
        if (colIndex === 0) {
            const isRowFullyColored = [1, 2, 3, 4, 5, 6, 7].every(
                (col) => clickedCells[`${rowIndex}-${col}`]
            );

            setClickedCells((prev) => {
                const updatedCells = { ...prev };
                
                if (isRowFullyColored) {
                    for (let i = 1; i <= 7; i++) {
                        delete updatedCells[`${rowIndex}-${i}`];
                    }
                } else {
                    for (let i = 1; i <= 7; i++) {
                        updatedCells[`${rowIndex}-${i}`] = true;
                    }
                }
                
                return updatedCells;
            });
        } else {
            setClickedCells((prev) => ({
                ...prev,
                [`${rowIndex}-${colIndex}`]: !prev[`${rowIndex}-${colIndex}`],
            }));
        }
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
                        <div className="mb-4">
                            <table className="w-full border-collapse border border-black">
                                <thead>
                                    <tr>
                                        <th className="border border-black p-2" style={{ width: '70px', height: '70px' }}>{enseignement.nom}</th>
                                        <th className="border border-black p-2" style={{ width: '300px' }}>CM</th>
                                        <th className="border border-black p-2" colSpan="2" style={{ width: '600px' }}>TD</th>
                                        <th className="border border-black p-2" colSpan="4" style={{ width: '900px' }}>TP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'Total'].map((row, rowIndex) => (
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
                                                    className={`border border-black p-2 ${clickedCells[`${rowIndex}-${colIndex}`] ? getColorClass(colIndex) : ''}`}
                                                    style={{ cursor: row !== 'Total' ? 'pointer' : 'default' }}
                                                    onClick={row !== 'Total' ? () => handleCellClick(rowIndex, colIndex): null}
                                                ></td>
                                            ))}
                                        </tr>
                                    ))}
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
