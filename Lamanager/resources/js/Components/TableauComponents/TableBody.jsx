import React, { useState, useEffect } from 'react';
import { handleClick, handleContextMenu, handleCloseContextMenu, handleDuplicate, handleDuplicateConfirm, handleMove, handleMoveConfirm, handleDelete, handleDeleteConfirm, parseWeeks, handleUpdate, handleUpdateConfirm } from '../../handlers';
import ContextMenu from './ContextMenu';
import DuplicatePopup from './DuplicatePopup';
import DeletePopup from './DeletePopup';
import MovePopup from './MovePopup';
import UpdatePopup from './UpdatePopup';
import { getColorClass, handleCellClick } from '../../utils';

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
    groupNames,
    enseignantCode,
    heures,
    minutes,
    setClickedCells,
    onCellClick,
    showIcons,
    setIsLoading
}) {
    const [contextMenu, setContextMenu] = useState(null);
    const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showMovePopup, setShowMovePopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [duplicateOption, setDuplicateOption] = useState('pairs');
    const [customWeeks, setCustomWeeks] = useState('');
    const [isLoading, setIsLoadingState] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState([]);

    useEffect(() => {
        const handleClickOutside = () => {
            setContextMenu(null);
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleDeleteClick = () => {
        handleDelete(setContextMenu, setShowDeletePopup);
    };

    const handleDeleteConfirmClick = (deleteOption, customRows) => {
        setIsLoading(true);
        handleDeleteConfirm(clickedCells, semainesID, groupesID, setClickedCells, setShowDeletePopup, deleteOption, 
            customRows, enseignement)
            .finally(() => setIsLoading(false));
    };

    const handleDuplicateConfirmClick = () => {
        setIsLoading(true);
        handleDuplicateConfirm(
            clickedCells, semainesID, enseignement, groupesID, setClickedCells, setIsLoading, setShowDuplicatePopup, handleCloseContextMenu, 
            duplicateOption, customWeeks, parseWeeks
        ).finally(() => setIsLoading(false));
    };

    const handleMoveConfirmClick = (selectedWeek) => {
        setIsLoading(true);
        handleMoveConfirm(
            selectedWeek, clickedCells, semainesID, enseignement, groupesID, setClickedCells, setIsLoading, setShowMovePopup, handleCloseContextMenu
        ).finally(() => setIsLoading(false));
    };

    const handleUpdateConfirmClick = (updatedData) => {
        setIsLoading(true);
        handleUpdateConfirm(updatedData, clickedCells, setClickedCells, semainesID, enseignantId, enseignement, groupesID, 
             enseignantCode, setShowUpdatePopup, setIsLoading
        ).finally(() => setIsLoading(false));
    };

    const isEvenSemester = enseignement.semestre % 2 === 0;
    const midIndex = Math.ceil(semaines.length / 2);
    const filteredSemaines = isEvenSemester ? semaines.slice(midIndex) : semaines.slice(0, midIndex);
    const filteredSemainesID = isEvenSemester ? semainesID.slice(midIndex) : semainesID.slice(0, midIndex);
    const startIndex = filteredSemainesID[0]-1;

    console.log('satrtIndex', startIndex);

    return (
        <>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}
            {!isLoading && (
                <tbody>
                    {filteredSemaines.map((semaine, rowIndex) => (
                        <tr key={semaine}>
                            <td
                                className="border border-black p-2"
                                style={{ height: '70px', cursor: contextMenu ? 'default' : 'pointer', position: 'relative' }}
                                onClick={() => handleClick(
                                    rowIndex + startIndex, 0, null, null, true, contextMenu, enseignantId, onCellClick, 
                                    showIcons, setClickedCells, nbGroupe, enseignement, groupesID, filteredSemainesID, 
                                    enseignantCode, heures, minutes, clickedCells, handleCellClick
                                )}
                            >
                                {semaine}
                                {showIcons && Object.keys(clickedCells).some(key => key.startsWith(`${rowIndex + startIndex}-`) && clickedCells[key]?.text) && (
                                    <div 
                                        style={{ 
                                            position: 'absolute', 
                                            top: '4px', 
                                            right: '4px', 
                                            width: '8px', 
                                            height: '8px', 
                                            borderRadius: '50%', 
                                            border: '1px solid black', 
                                            backgroundColor: clickedCells[`semaine-${rowIndex + startIndex}`]?.selected ? 'black' : 'transparent' 
                                        }} 
                                    />
                                )}
                            </td>
                            {Array.from({ length: nbGroupe }, (_, index) => (
                                <td
                                    key={index}
                                    className={`border border-black p-2 ${
                                        clickedCells[`${rowIndex + startIndex}-${index}`]?.clicked 
                                            ? getColorClass(index, nbCM, nbTD) 
                                            : ''
                                    }`}
                                    style={{ cursor: contextMenu ? 'default' : 'pointer', width: `${100 / (nbGroupe+2)}%`, position: 'relative' }}
                                    onClick={() => handleClick(
                                        rowIndex + startIndex, index, filteredSemainesID[rowIndex], groupesID[index], false, contextMenu, 
                                        enseignantId, onCellClick, showIcons, setClickedCells, nbGroupe, enseignement, 
                                        groupesID, filteredSemainesID, enseignantCode, heures, minutes, clickedCells, handleCellClick
                                    )}
                                    onContextMenu={(event) => handleContextMenu(event, rowIndex + startIndex, index, showIcons, clickedCells, setContextMenu)}
                                >
                                    {showIcons && clickedCells[`${rowIndex + startIndex}-${index}`]?.text && (
                                        <div 
                                            style={{ 
                                                position: 'absolute', 
                                                top: '4px', 
                                                right: '4px', 
                                                width: '8px', 
                                                height: '8px', 
                                                borderRadius: '50%', 
                                                border: '1px solid black', 
                                                backgroundColor: clickedCells[`${rowIndex + startIndex}-${index}`]?.selected ? 'black' : 'transparent' 
                                            }} 
                                        />
                                    )}
                                    {clickedCells[`${rowIndex + startIndex}-${index}`]?.text && (
                                        <h3>{clickedCells[`${rowIndex + startIndex }-${index}`].text}</h3>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            )}
            {contextMenu && (
                <ContextMenu
                    contextMenu={contextMenu}
                    handleDuplicate={() => handleDuplicate(setShowDuplicatePopup)}
                    handleEdit={() => handleUpdate(setShowUpdatePopup, setSelectedGroups, clickedCells, groupNames, groupesID, filteredSemainesID)}
                    handleMove={() => handleMove(setShowMovePopup)}
                    handleDelete={handleDeleteClick}
                    handleCloseContextMenu={() => handleCloseContextMenu(setContextMenu)}
                />
            )}
            {showDuplicatePopup && (
                <DuplicatePopup
                    duplicateOption={duplicateOption}
                    setDuplicateOption={setDuplicateOption}
                    customWeeks={customWeeks}
                    setCustomWeeks={setCustomWeeks}
                    handleDuplicateConfirm={handleDuplicateConfirmClick}
                    setShowDuplicatePopup={setShowDuplicatePopup}
                />
            )}
            {showDeletePopup && (
                <DeletePopup
                    handleDeleteConfirm={handleDeleteConfirmClick}
                    setShowDeletePopup={setShowDeletePopup}
                />
            )}
            {showMovePopup && (
                <MovePopup
                    semaines={semaines}
                    handleMoveConfirm={handleMoveConfirmClick}
                    setShowMovePopup={setShowMovePopup}
                />
            )}
            {showUpdatePopup && (
                <UpdatePopup
                    setShowUpdatePopup={setShowUpdatePopup}
                    initialData={{ heures, minutes, enseignant: enseignantCode }}
                    selectedGroups={selectedGroups}
                    groupesID={groupesID}
                    handleUpdateConfirm={handleUpdateConfirmClick}
                    enseignementId={enseignement.id}
                    semainesID={filteredSemainesID}
                />
            )}
        </>
    );
}

export default TableBody;