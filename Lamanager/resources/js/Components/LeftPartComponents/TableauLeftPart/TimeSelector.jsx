import React, { useState } from 'react';

function TimeSelector({ defaultTime, onTimeSelect }) {
    const [selectedTime, setSelectedTime] = useState(defaultTime);
    const [error, setError] = useState(null);

    const validateTimeFormat = (value) => {
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(value);
    };

    const handleTimeChange = (e) => {
        const value = e.target.value;
        if (value === ':') return;
        
        let cleanValue = value.replace(/[^\d:]/g, '');
        
        if (cleanValue.length === 2 && !cleanValue.includes(':')) {
            cleanValue = cleanValue + ':';
        }
        
        if (cleanValue.length > 5) {
            cleanValue = cleanValue.slice(0, 5);
        }
    
        setSelectedTime(cleanValue);
        setError(null);
    };

    return (
        <div className="flex items-center space-x-2">
            <div className="w-full">
                <input
                    type="text"
                    placeholder="HH:MM"
                    maxLength="5"
                    className="mt-2 w-full p-2 rounded-md border border-gray-300 focus:border-[#564787] focus:ring focus:ring-[#564787] focus:ring-opacity-50"
                    value={selectedTime}
                    onChange={handleTimeChange}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <button
                className="mt-2 px-4 py-2 bg-[#564787] text-white rounded-md hover:bg-[#453a6b] focus:outline-none focus:ring focus:ring-[#564787] focus:ring-opacity-50"
                onClick={() => {
                    if (selectedTime) {
                        if (validateTimeFormat(selectedTime)) {
                            onTimeSelect(selectedTime);
                        } else {
                            setError('Format invalide (ex: 02:00)');
                        }
                    }
                }}
            >
                Valider
            </button>
        </div>
    );
}

export default TimeSelector;