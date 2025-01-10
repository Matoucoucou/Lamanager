import React, { useState } from 'react';

function DuplicatePopup({ duplicateOption, setDuplicateOption, customWeeks, setCustomWeeks, handleDuplicateConfirm, setShowDuplicatePopup }) {
    const [pairStart, setPairStart] = useState('');
    const [pairEnd, setPairEnd] = useState('');
    const [impairStart, setImpairStart] = useState('');
    const [impairEnd, setImpairEnd] = useState('');

    return (
        <div className="popup-overlay" style={overlayStyle}>
            <div className="popup-content" style={contentStyle}>
                <h2>Dupliquer</h2>
                <div style={radioContainerStyle}>
                    <label style={radioLabelStyle}>
                        <input
                            type="radio"
                            value="pairs"
                            checked={duplicateOption === 'pairs'}
                            onChange={() => setDuplicateOption('pairs')}
                            style={radioStyle}
                        />
                        <span style={textStyle}>Semaines paires</span>
                    </label>
                    <label style={radioLabelStyle}>
                        <input
                            type="radio"
                            value="impairs"
                            checked={duplicateOption === 'impairs'}
                            onChange={() => setDuplicateOption('impairs')}
                            style={radioStyle}
                        />
                        <span style={textStyle}>Semaines impaires</span>
                    </label>
                    <label style={radioLabelStyle}>
                        <input
                            type="radio"
                            value="custom"
                            checked={duplicateOption === 'custom'}
                            onChange={() => setDuplicateOption('custom')}
                            style={radioStyle}
                        />
                        <span style={textStyle}>Semaines spécifiques</span>
                        {duplicateOption === 'custom' && (
                            <input
                                type="text"
                                value={customWeeks}
                                onChange={(e) => setCustomWeeks(e.target.value)}
                                placeholder="Ex: 1,3,5 ou 1-5"
                                style={inputStyle}
                            />
                        )}
                    </label>
                </div>
                <div style={buttonContainerStyle}>
                    <button onClick={() => setShowDuplicatePopup(false)} style={buttonStyle}>Annuler</button>
                    <button onClick={handleDuplicateConfirm} style={buttonStyle}>Confirmer</button>
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
    width: '50%',
};

const inputContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
};

export default DuplicatePopup;
