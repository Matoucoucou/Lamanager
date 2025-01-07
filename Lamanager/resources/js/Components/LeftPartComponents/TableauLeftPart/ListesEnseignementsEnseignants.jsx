import React from 'react';
import EnseignementSelect from './EnseignementSelect.jsx';
import EnseignantList from './EnseignantList.jsx';
import TimeSelector from './TimeSelector.jsx';
import SwitchAlternant from './SwitchAlternant.jsx';

function ListesEnseignementsEnseignants({
    promoId,
    anneeId,
    onEnseignementSelect,
    selectedEnseignant,
    onEnseignantSelect,
    onTimeSelect,
    defaultTime,
    isAlternant,
    onAlternantChange
}) {
    return (
        <>
            <EnseignementSelect
                promoId={promoId}
                anneeId={anneeId}
                onEnseignementSelect={onEnseignementSelect}
            />
            <EnseignantList
                selectedEnseignant={selectedEnseignant}
                onEnseignantSelect={onEnseignantSelect}
            />
            <TimeSelector
                defaultTime={defaultTime}
                onTimeSelect={onTimeSelect}
            />
            <SwitchAlternant
                    promoId={promoId}
                    onSwitchChange={onAlternantChange}
            />
        </>
    );
}

export default ListesEnseignementsEnseignants;
