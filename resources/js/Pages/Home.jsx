import React, { useState } from 'react';
import Header from '../Components/Header';
import LeftPart from '../Components/LeftPart';
import RightPart from '../Components/RightPart';
import PromoRightPart from '@/Components/PromoRightPart';
import HeaderNeutre from '@/Components/HeaderNeutre';
import MenuAnnee from '@/Components/MenuAnnee';

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