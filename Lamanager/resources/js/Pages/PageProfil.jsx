import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/Components/Header';
import LeftPart from '@/Components/LeftPart';
import RightPart from '@/Components/RightPart';
import BarreOutils from '@/Components/BarreOutils';
import ProfilLeftPart from '@/Components/ProfilLeftPart';
import ProfilRightPart from '@/Components/ProfilRightPart';
import GestionCompte from '@/Components/GestionCompte';

export default function PageProfil() {
    const [userData, setUserData] = useState(null);
    const [id, setId] = useState(null);
    const urlParams = new URLSearchParams(window.location.search);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const response = await axios.get('/api/session');
                setId(response.data.userId);
            } catch (err) {
                console.error('Erreur lors de la récupération de la session');
            }
        };

        fetchSessionData();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`/api/user/${id}`);
                    setUserData(response.data);
                } catch (err) {
                    console.error('Erreur lors du chargement des données utilisateur');
                }
            };

            fetchUserData();
        }
    }, [id]);

    if (!userData) return <div>Chargement...</div>;

    const nom = userData.nom;
    const prenom = userData.prenom;
    const mail = userData.mail;
    const admin = userData.admin;

    const userProfile = {
        nom: nom,
        prenom: prenom,
        mail: mail,
        admin: admin
    };

    if (urlParams.get('from') === 'tableau') {
        return (
            <>
                <Header ComposantProp={() => <BarreOutils lockButton={true} />} />
                <div className="app">
                    <LeftPart ComposantProp={ProfilLeftPart} userName={nom + " " + prenom} />
                    <RightPart ComposantProp={GestionCompte} />
                </div>
            </>
        );
    } else {
        return (
            <>
                <Header ComposantProp={() => <BarreOutils lockButton={true} />} />
                <div className="app">
                    <LeftPart ComposantProp={ProfilLeftPart} userName={nom + " " + prenom} />
                    <RightPart ComposantProp={ProfilRightPart} userData={userProfile} />
                </div>
            </>
        );
    }
}
