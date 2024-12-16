import React, { useState, useEffect } from 'react';
import { handleCellClick } from '../../utils';
import { getColorClass } from '../../utils';

function TableBody({ 
    semaines,
    semainesID,
    nbGroupe,
    nbCM,
    nbTD,
    clickedCells,
    enseignantId,
    enseignement,
    groupesID,
    enseignantCode,
    heures,
    minutes,
    setClickedCells,
    onCellClick,
    showIcons
}) {
    const [contextMenu, setContextMenu] = useState(null);

    useEffect(() => {
        const handleClickOutside = () => {
            setContextMenu(null);
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleClick = (rowIndex, colIndex, semaineId, groupeId, isSemaineColumn) => {
        if (contextMenu) {
            return;
        }

        if (!enseignantId) {
            onCellClick();
            return;
        }

        if (!showIcons) {
            handleCellClick(
                rowIndex,
                colIndex, 
                semaineId, 
                enseignantId, 
                enseignement.id, 
                groupeId, 
                isSemaineColumn, 
                nbGroupe, 
                groupesID, 
                semainesID, 
                enseignantCode, 
                heures,
                minutes, 
                setClickedCells
            );
        } else if (clickedCells[`${rowIndex}-${colIndex}`]?.text) {
            // Toggle the selection state of the cell
            setClickedCells((prev) => {
                const updatedCells = { ...prev };
                const key = `${rowIndex}-${colIndex}`;
                updatedCells[key] = {
                    ...updatedCells[key],
                    selected: !updatedCells[key]?.selected,
                };
                return updatedCells;
            });
        }
    };

    const handleContextMenu = (event, rowIndex, colIndex) => {
        event.preventDefault();
        event.stopPropagation();
        if (clickedCells[`${rowIndex}-${colIndex}`]?.text) {
            setContextMenu({
                mouseX: event.clientX,
                mouseY: event.clientY,
                rowIndex,
                colIndex
            });
        }
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleDuplicate = () => {
        // Logique pour dupliquer la cellule
        handleCloseContextMenu();
    };

    const handleEdit = () => {
        // Logique pour modifier la cellule
        handleCloseContextMenu();
    };

    const handleMove = () => {
        // Logique pour déplacer la cellule
        handleCloseContextMenu();
    };

    const handleDelete = () => {
        // Logique pour supprimer la cellule
        handleCloseContextMenu();
    };

    return (
        <>
            <tbody>
                {semaines.map((semaine, rowIndex) => (
                    <tr key={semaine}>
                        <td
                            className="border border-black p-2"
                            style={{ height: '70px', cursor: contextMenu ? 'default' : 'pointer' }}
                            onClick={() => handleClick(rowIndex, 0, null, null, true)}
                        >
                            {semaine}
                        </td>
                        {Array.from({ length: nbGroupe }, (_, index) => (
                            <td
                                key={index}
                                className={`border border-black p-2 ${
                                    clickedCells[`${rowIndex}-${index}`]?.clicked 
                                        ? getColorClass(index, nbCM, nbTD) 
                                        : ''
                                }`}
                                style={{ cursor: contextMenu ? 'default' : 'pointer', width: `${100 / (nbGroupe+2)}%`, position: 'relative' }}
                                onClick={() => handleClick(
                                    rowIndex,
                                    index,
                                    semainesID[rowIndex],
                                    groupesID[index],
                                    false
                                )}
                                onContextMenu={(event) => handleContextMenu(event, rowIndex, index)}
                            >
                                {showIcons && clickedCells[`${rowIndex}-${index}`]?.text && (
                                    <div 
                                        style={{ 
                                            position: 'absolute', 
                                            top: '4px', 
                                            right: '4px', 
                                            width: '8px', 
                                            height: '8px', 
                                            borderRadius: '50%', 
                                            border: '1px solid black', 
                                            backgroundColor: clickedCells[`${rowIndex}-${index}`]?.selected ? 'black' : 'transparent' 
                                        }} 
                                    />
                                )}
                                {clickedCells[`${rowIndex}-${index}`]?.text && (
                                    <h3>{clickedCells[`${rowIndex}-${index}`].text}</h3>
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            {contextMenu && (
                <div
                    style={{
                        position: 'fixed',
                        top: contextMenu.mouseY,
                        left: contextMenu.mouseX,
                        backgroundColor: 'white',
                        boxShadow: '0px 0px 5px rgba(0,0,0,0.5)',
                        zIndex: 1000,
                        cursor: 'pointer'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <ul style={{ listStyle: 'none', padding: '10px', margin: 0 }}>
                        <li onClick={handleDuplicate}>Dupliquer</li>
                        <li onClick={handleEdit}>Modifier</li>
                        <li onClick={handleMove}>Déplacer</li>
                        <li onClick={handleDelete}>Supprimer</li>
                    </ul>
                </div>
            )}
        </>
    );
}

export default TableBody;