import { addCellToDatabase, deleteCellFromDatabase } from './utils';

export const handleClick = (
    rowIndex, colIndex, semaineId, groupeId, isSemaineColumn, contextMenu, enseignantId, 
    onCellClick, showIcons, setClickedCells, nbGroupe, enseignement, groupesID, semainesID, 
    enseignantCode, heures, minutes, clickedCells, handleCellClick
) => {
    if (contextMenu) {
        return;
    }

    if (!enseignantId) {
        onCellClick();
        return;
    }

    if (isSemaineColumn) {
        if (showIcons) {
            // Mode sélection activé
            setClickedCells((prev) => {
                const updatedCells = { ...prev };
                const semaineKey = `semaine-${rowIndex}`;
                const isSelected = !updatedCells[semaineKey]?.selected;

                updatedCells[semaineKey] = {
                    ...updatedCells[semaineKey],
                    selected: isSelected,
                };

                for (let i = 0; i < nbGroupe; i++) {
                    const cellKey = `${rowIndex}-${i}`;
                    if (updatedCells[cellKey]?.text) {
                        updatedCells[cellKey] = {
                            ...updatedCells[cellKey],
                            selected: isSelected,
                        };
                    }
                }

                return updatedCells;
            });
        } else {
            // Mode sélection désactivé
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
        }
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
        setClickedCells((prev) => {
            const updatedCells = { ...prev };
            const key = `${rowIndex}-${colIndex}`;
            updatedCells[key] = {
                ...updatedCells[key],
                selected: !updatedCells[key]?.selected,
            };

            const allSelected = Array.from({ length: nbGroupe }, (_, i) => `${rowIndex}-${i}`)
                .filter(cellKey => updatedCells[cellKey]?.text)
                .every(cellKey => updatedCells[cellKey]?.selected);

            updatedCells[`semaine-${rowIndex}`] = {
                ...updatedCells[`semaine-${rowIndex}`],
                selected: allSelected,
            };

            return updatedCells;
        });
    }
};

export const handleContextMenu = (event, rowIndex, colIndex, showIcons, clickedCells, setContextMenu) => {
    event.preventDefault();
    event.stopPropagation();
    if (showIcons && clickedCells[`${rowIndex}-${colIndex}`]?.text) {
        const selectedCells = Object.keys(clickedCells).filter(key => clickedCells[key]?.selected && !key.startsWith('semaine-'));
        const selectedRows = [...new Set(selectedCells.map(key => key.split('-')[0]))];
        const canDuplicate = selectedRows.length === 1;

        setContextMenu({
            mouseX: event.clientX,
            mouseY: event.clientY,
            rowIndex,
            colIndex,
            canDuplicate
        });
    }
};

export const handleCloseContextMenu = (setContextMenu) => {
    if (typeof setContextMenu === 'function') {
        setContextMenu(null);
    }
};

export const handleDuplicate = (setShowDuplicatePopup) => {
    setShowDuplicatePopup(true);
};

export const handleDuplicateConfirm = async (
    clickedCells, semainesID, enseignement, groupesID, setClickedCells, setIsLoading, setShowDuplicatePopup, handleCloseContextMenu, 
    duplicateOption, customWeeks, parseWeeks, setErrorMessage
) => {
    setIsLoading(true);
    const selectedCells = Object.keys(clickedCells).filter(key => clickedCells[key]?.selected && !key.startsWith('semaine-'));
    const selectedRows = [...new Set(selectedCells.map(key => key.split('-')[0]))];

    let weeksToDuplicate = [];

    if (selectedRows.length === 1) {
        if (duplicateOption === 'pairs') {
            weeksToDuplicate = semainesID.filter((_, index) => index % 2 !== 0);
        } else if (duplicateOption === 'impairs') {
            weeksToDuplicate = semainesID.filter((_, index) => index % 2 === 0);
        } else if (duplicateOption === 'custom') {
            weeksToDuplicate = parseWeeks(customWeeks).map(week => week);
        }
    } else {
        weeksToDuplicate = semainesID.slice(selectedRows[0], selectedRows[selectedRows.length - 1] + 1);
    }

    // Vérifier si toutes les valeurs de weeksToDuplicate sont présentes dans semainesID
    const invalidWeeks = weeksToDuplicate.filter(week => !semainesID.includes(week));
    if (invalidWeeks.length > 0) {
        setErrorMessage(`Les semaines suivantes ne sont pas valides: ${invalidWeeks.join(', ')}`);
        setIsLoading(false);
        return;
    }

    // Vérifier si weeksToDuplicate contient uniquement la valeur de selectedRows
    if (weeksToDuplicate.length === 1 && weeksToDuplicate[0] === parseInt(selectedRows[0]) + 1) {
        setErrorMessage(`Veuillez saisir une semaine différente de la semaine sélectionnée.`);
        setIsLoading(false);
        return;
    }

    for (const cellKey of selectedCells) {
        const [rowIndex, colIndex] = cellKey.split('-').map(Number);
        const cellData = clickedCells[cellKey];

        for (const week of weeksToDuplicate) {
            const newCellKey = `${week-1}-${colIndex}`;
            if (clickedCells[newCellKey]?.text) {
                try {
                    await deleteCellFromDatabase(
                        week,
                        groupesID[colIndex],
                        enseignement.id
                    );
                } catch (error) {
                    console.error('Erreur lors de la suppression de la base de données:', error);
                }
            }

            try {
                await addCellToDatabase(
                    week,
                    cellData.enseignantId,
                    enseignement.id,
                    groupesID[colIndex],
                    cellData.heures,
                    cellData.minutes,
                );

                setClickedCells((prev) => {
                    const updatedCells = { ...prev };
                    updatedCells[newCellKey] = {
                        clicked: true,
                        text: `${cellData.heures}h${cellData.minutes !== 0 ? cellData.minutes : ''} - ${cellData.enseignantCode}`,
                        heures: cellData.heures,
                        minutes: cellData.minutes,
                        enseignantId: cellData.enseignantId,
                        enseignantCode: cellData.enseignantCode
                    };
                    return updatedCells;
                });
            } catch (error) {
                console.error('Erreur lors de l\'ajout à la base de données:', error);
            }
        }
    }

    setIsLoading(false);
    setShowDuplicatePopup(false);
    handleCloseContextMenu();
};

export const handleMove = (setShowMovePopup) => {
    setShowMovePopup(true);
};

export const handleMoveConfirm = async (
    selectedWeek, clickedCells, semainesID, enseignement, groupesID,
     setClickedCells, setIsLoading, setShowMovePopup, handleCloseContextMenu
) => {
    setIsLoading(true);
    const selectedCells = Object.keys(clickedCells).filter(key => clickedCells[key]?.selected && !key.startsWith('semaine-'));
    const selectedRows = [...new Set(selectedCells.map(key => key.split('-')[0]))].sort((a, b) => a - b);

    if (parseInt(semainesID[selectedWeek]) === parseInt(selectedRows[0])) {
        setIsLoading(false);
        setShowMovePopup(false);
        handleCloseContextMenu();
        return;
    }

    for (const cellKey of selectedCells) {
        const [rowIndex, colIndex] = cellKey.split('-').map(Number);
        const newRowIndex = parseInt(semainesID[selectedWeek]) + (rowIndex - 1 - parseInt(selectedRows[0]));
        const cellData = clickedCells[cellKey];

        try {
            await deleteCellFromDatabase(
                rowIndex+1,
                groupesID[colIndex],
                enseignement.id
            );

            await addCellToDatabase(
                newRowIndex+1,
                cellData.enseignantId,
                enseignement.id,
                groupesID[colIndex],
                cellData.heures,
                cellData.minutes
            );

            setClickedCells((prev) => {
                const updatedCells = { ...prev };
                const newCellKey = `${newRowIndex}-${colIndex}`;
                updatedCells[newCellKey] = {
                    clicked: true,
                    text: `${cellData.heures}h${cellData.minutes !== 0 ? cellData.minutes : ''} - ${cellData.enseignantCode}`,
                    heures: cellData.heures,
                    minutes: cellData.minutes,
                    enseignantId: cellData.enseignantId,
                    enseignantCode: cellData.enseignantCode
                };
                updatedCells[cellKey] = {
                    clicked: false,
                    text: ""
                };
                return updatedCells;
            });
        } catch (error) {
            console.error('Erreur lors du déplacement:', error);
        }
    }

    setIsLoading(false);
    setShowMovePopup(false);
    handleCloseContextMenu();
};

export const handleDelete = (
    setContextMenu, setShowDeletePopup
) => {
    setShowDeletePopup(true);
    handleCloseContextMenu(setContextMenu);
};

export const handleDeleteConfirm = async (
    clickedCells, semainesID, groupesID, setClickedCells, setShowDeletePopup, deleteOption, customRows, enseignement
) => {
    let selectedCells = [];

    if (deleteOption === 'selection') {
        selectedCells = Object.keys(clickedCells).filter(key => clickedCells[key]?.selected && !key.startsWith('semaine-'));
    } else if (deleteOption === 'custom') {
        const rows = parseRows(customRows);
        selectedCells = rows.flatMap(rowIndex => 
            Array.from({ length: groupesID.length }, (_, colIndex) => `${rowIndex - 1}-${colIndex}`)
        );
    }

    for (const cellKey of selectedCells) {
        const [rowIndex, colIndex] = cellKey.split('-').map(Number);

        try {
            await deleteCellFromDatabase(
                semainesID[rowIndex],
                groupesID[colIndex],
                enseignement.id
            );
        } catch (error) {
            console.error('Erreur lors de la suppression de la base de données:', error);
        }
    }

    setClickedCells((prev) => {
        const updatedCells = { ...prev };
        selectedCells.forEach(cellKey => {
            updatedCells[cellKey] = {
                ...updatedCells[cellKey],
                selected: false,
                clicked: false,
                text: ""
            };
        });
        return updatedCells;
    });

    setShowDeletePopup(false);
};

export const handleUpdate = (setShowUpdatePopup, setSelectedGroups, clickedCells, groupes, semainesID) => {
    const selectedGroups = Object.keys(clickedCells)
        .filter(key => clickedCells[key]?.selected && clickedCells[key]?.clicked)
        .map(key => {
            const [rowIndex, colIndex] = key.split('-').map(Number);
            return {
                cellKey: key,
                semaineId: rowIndex + 1,
                groupeId: groupes.map(g => g.id)[colIndex],
                name: groupes.map(g => g.name)[colIndex],
                type: groupes.map(g => g.type)[colIndex],
            };
        });

    setSelectedGroups(selectedGroups);
    setShowUpdatePopup(true);
};

export const handleUpdateConfirm = async (updatedData, clickedCells, setClickedCells) => {
    let selectedCells = Object.keys(clickedCells).filter(key => clickedCells[key]?.selected && !key.startsWith('semaine-'));
    
    selectedCells = selectedCells.sort((a, b) => {
        const [rowA, colA] = a.split('-').map(Number);
        const [rowB, colB] = b.split('-').map(Number);
        return colA - colB || rowA - rowB;
    });

    console.log(updatedData);

    for (const { groupeId, heures, minutes, enseignantId, enseignementId, semaineId } of updatedData) {
        await deleteCellFromDatabase(semaineId, groupeId, enseignementId);

        await addCellToDatabase(semaineId, enseignantId, enseignementId, groupeId, heures, minutes);
    }

    selectedCells.forEach((cellKey, index) => {
        const [rowIndex, colIndex] = cellKey.split('-').map(Number);
        const cellData = clickedCells[cellKey];

        const { groupeId, heures, minutes, enseignantId, enseignantCode, enseignementId, semaineId } = updatedData[index];

        setClickedCells((prev) => {
            const updatedCells = { ...prev };
            const newCellKey = `${rowIndex}-${colIndex}`;

            updatedCells[newCellKey] = {
                clicked: true,
                text: `${heures}h${minutes !== 0 ? minutes : ''} - ${enseignantCode}`,
                heures: heures,
                minutes: minutes,
                enseignantId: enseignantId,
                enseignantCode: enseignantCode,
                enseignementId: enseignementId
            };
            return updatedCells;
        });
    });
};

const parseRows = (rowsString) => {
    if (!rowsString) return [];
    const rows = [];
    const ranges = rowsString.split(',');
    ranges.forEach(range => {
        if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            for (let i = start; i <= end; i++) {
                rows.push(i);
            }
        } else {
            rows.push(Number(range));
        }
    });
    return rows;
};

const parseWeeks = (weeksString) => {
    if (!weeksString) return [];
    const weeks = [];
    const ranges = weeksString.split(',');
    ranges.forEach(range => {
        if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            for (let i = start; i <= end; i++) {
                weeks.push(i);
            }
        } else {
            weeks.push(Number(range));
        }
    });
    return weeks;
};

export { parseRows, parseWeeks };

