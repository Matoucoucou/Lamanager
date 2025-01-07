import React, { useState } from 'react';
import Header from '../Components/HeaderComponents/Header.jsx';
import LeftPart from '../Components/LeftPartComponents/LeftPart.jsx';
import RightPart from '../Components/RightPartComponents/RightPart.jsx';
import PromoRightPart from '@/Components/RightPartComponents/PromoComponents/PromoRightPart.jsx';
import HeaderNeutre from '@/Components/HeaderComponents/HeaderNeutre.jsx';
import MenuAnnee from '@/Components/LeftPartComponents/MenuAnnee.jsx';

const Home = () => {
    const [selectedAnnee, setSelectedAnnee] = useState(null);

    const handleAnneeSelect = (annee) => {
        setSelectedAnnee(annee);
    };

    const MenuAnneeWithProps = () => (
        <MenuAnnee
            selectedAnnee={selectedAnnee}
            onAnneeSelect={handleAnneeSelect}
        />
    );

    return (
        <>
            <Header ComposantProp={HeaderNeutre}/>
            <div className="app">
                <LeftPart ComposantProp={MenuAnneeWithProps} />
                <RightPart ComposantProp={() => <PromoRightPart selectedAnnee={selectedAnnee} />}/>
            </div>
        </>
    );
};

export default Home;
