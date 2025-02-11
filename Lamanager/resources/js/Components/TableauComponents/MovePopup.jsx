import React, { useState } from 'react';

function MovePopup({ semaines, handleMoveConfirm, setShowMovePopup }) {
    const [selectedWeek, setSelectedWeek] = useState('');

    console.log('selectedWeek:', selectedWeek);

    return (
        <div className="popup-overlay" style={overlayStyle}>
            <div className="popup-content" style={contentStyle}>
                <h2>Déplacer</h2>
                <div style={inputContainerStyle}>
                    <label style={labelStyle}>Sélectionnez la semaine de destination:</label>
                    <select
                        value={selectedWeek}
                        onChange={(e) => setSelectedWeek(e.target.value)}
                        style={selectStyle}
                        size={semaines.length}
                    >
                        <option value="">Sélectionner une semaine</option>
                        {semaines.map((semaine, index) => (
                            <option key={index} value={index}>
                                {semaine}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={buttonContainerStyle}>
                    <button onClick={() => setShowMovePopup(false)} style={buttonStyle}>Annuler</button>
                    <button onClick={() => handleMoveConfirm(selectedWeek)} style={buttonStyle}>Confirmer</button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const contentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
};

const inputContainerStyle = {
    textAlign: 'left',
    marginTop: '10px',
};

const labelStyle = {
    display: 'block',
    marginBottom: '10px',
    fontSize: '18px',
};

const selectStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    maxHeight: '200px',
    overflowY: 'auto',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
};

const buttonStyle = {
    marginLeft: '10px',
};

export default MovePopup;
