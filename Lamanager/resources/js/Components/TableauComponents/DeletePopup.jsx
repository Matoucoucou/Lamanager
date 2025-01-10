import React, { useState } from 'react';

function DeletePopup({ handleDeleteConfirm, setShowDeletePopup }) {
    const [deleteOption, setDeleteOption] = useState('selection');
    const [customRows, setCustomRows] = useState('');

    const handleOptionChange = (event) => {
        setDeleteOption(event.target.value);
    };

    const handleCustomRowsChange = (event) => {
        setCustomRows(event.target.value);
    };

    const handleConfirm = () => {
        handleDeleteConfirm(deleteOption, customRows);
    };

    return (
        <div className="popup-overlay" style={overlayStyle}>
            <div className="popup-content" style={contentStyle}>
                <h2>Supprimer</h2>
                <div style={radioContainerStyle}>
                    <label style={radioLabelStyle}>
                        <input
                            type="radio"
                            value="selection"
                            checked={deleteOption === 'selection'}
                            onChange={handleOptionChange}
                            style={radioStyle}
                        />
                        <span style={textStyle}>Supprimer la sélection</span>
                    </label>
                    <label style={radioLabelStyle}>
                        <input
                            type="radio"
                            value="custom"
                            checked={deleteOption === 'custom'}
                            onChange={handleOptionChange}
                            style={radioStyle}
                        />
                        <span style={textStyle}>Supprimer les lignes suivantes</span>
                        {deleteOption === 'custom' && (
                            <input
                                type="text"
                                value={customRows}
                                onChange={handleCustomRowsChange}
                                placeholder="Ex: 1,3 ou 1-5"
                                style={inputStyle}
                            />
                        )}
                    </label>
                </div>
                <div style={buttonContainerStyle}>
                    <button onClick={() => setShowDeletePopup(false)} style={buttonStyle}>Annuler</button>
                    <button onClick={handleConfirm} style={buttonStyle}>Confirmer</button>
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

const radioContainerStyle = {
    textAlign: 'left',
    marginTop: '10px',
};

const radioLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '18px',
    height: '50px',
};

const radioStyle = {
    width: '20px',
    height: '20px',
};

const textStyle = {
    marginLeft: '10px',
    fontSize: '18px',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
};

const buttonStyle = {
    marginLeft: '10px',
};

const inputStyle = {
    marginLeft: '10px',
    padding: '5px',
    width: '40%',
};

export default DeletePopup;
