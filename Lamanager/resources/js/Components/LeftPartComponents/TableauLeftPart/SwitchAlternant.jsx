import React, { useEffect, useState } from 'react';

function SwitchAlternant({ promoId, onSwitchChange }) {
    const [isChecked, setIsChecked] = useState(() => {
        // Initialiser avec la valeur du localStorage
        return localStorage.getItem(`switchState-${promoId}`) === 'true';
    });
    const [showSwitch, setShowSwitch] = useState(false);
    const [alternantId, setAlternantId] = useState(null);

    useEffect(() => {
        const fetchPromoData = async () => {
            try {
                const response = await fetch(`/api/promo/${promoId}`);
                const data = await response.json();
                const hasAlternantId = data.alternant_id !== null;
                setShowSwitch(hasAlternantId);
                setAlternantId(data.alternant_id);
            } catch (error) {
                console.error('Error fetching promo data:', error);
                setShowSwitch(false);
            }
        };

        if (promoId) {
            fetchPromoData();
        }
    }, [promoId]);

    const handleChange = (e) => {
        const checked = e.target.checked;
        setIsChecked(checked);
        // Sauvegarder l'état dans localStorage
        localStorage.setItem(`switchState-${promoId}`, checked);
        onSwitchChange(checked);
    };

    if (!showSwitch) return null;

    return (
        <div className="form-check form-switch">
            <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id={`alternantSwitch-${promoId}`}
                checked={isChecked}
                onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={`alternantSwitch-${promoId}`}>
                Alternant
            </label>
        </div>
    );
}

export default SwitchAlternant;
