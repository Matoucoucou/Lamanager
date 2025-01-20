import React, { useState, useCallback } from 'react';
import Header from '@/Components/Header';
import LeftPart from '@/Components/LeftPart';
import RightPart from '@/Components/RightPart';
import BarreOutils from '@/Components/BarreOutils';
import VersionProfLeftPart from '@/Components/VersionProfLeftPart';
import VersionProfRightPart from '@/Components/VersionProfRightPart';

export default function PageVersionProf() {
  const [selections, setSelections] = useState({});

  const handleSelectionChange = useCallback((newSelections) => {
    setSelections(newSelections);
  }, []);

  return (
    <>
      <Header ComposantProp={() => <BarreOutils lockButton = {true} />} />
      <div className="app">
        <LeftPart ComposantProp={() => <VersionProfLeftPart onSelectionChange={handleSelectionChange} />} />
        <RightPart ComposantProp={() => <VersionProfRightPart selections={selections} />} />
      </div>
    </>
  );
}
