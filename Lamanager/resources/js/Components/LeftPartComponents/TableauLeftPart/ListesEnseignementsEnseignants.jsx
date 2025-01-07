import React from 'react';
import TeacherSelect from './TeacherSelect.jsx';
import TeacherList from './TeacherList.jsx';
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
            <TeacherSelect
                promoId={promoId}
                anneeId={anneeId}
                onEnseignementSelect={onEnseignementSelect}
            />
            <TeacherList
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
