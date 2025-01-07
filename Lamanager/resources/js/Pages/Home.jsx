import React, { useState } from 'react';
import Header from '../Components/HeaderComponents/Header.jsx';
import LeftPart from '../Components/LeftPartComponents/LeftPart.jsx';
import RightPart from '../Components/RightPartComponents/RightPart.jsx';
import PromoRightPart from '@/Components/RightPartComponents/PromoComponents/PromoRightPart.jsx';
import NeutralHeader from '@/Components/HeaderComponents/NeutralHeader.jsx';
import LeftPartYears from '@/Components/LeftPartComponents/LeftPartYears.jsx';

const Home = () => {
    const [selectedAnnee, setSelectedAnnee] = useState(null);

    const handleAnneeSelect = (annee) => {
        setSelectedAnnee(annee);
    };

    const MenuAnneeWithProps = () => (
        <LeftPartYears
            selectedAnnee={selectedAnnee}
            onAnneeSelect={handleAnneeSelect}
        />
    );

    return (
        <>
            <Header ComposantProp={NeutralHeader}/>
            <div className="app">
                <LeftPart ComposantProp={MenuAnneeWithProps} />
                <RightPart ComposantProp={() => <PromoRightPart selectedAnnee={selectedAnnee} />}/>
            </div>
        </>
    );
};

export default Home;
