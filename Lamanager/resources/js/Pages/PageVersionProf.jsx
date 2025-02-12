import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import Header from '@/Components/Header';
import LeftPart from '@/Components/LeftPart';
import RightPart from '@/Components/RightPart';
import BarreOutils from '@/Components/BarreOutils/BarreOutils.jsx';
import VersionProfLeftPart from '@/Components/VersionProf/VersionProfLeftPart.jsx';
import VersionProfRightPart from '@/Components/VersionProf/VersionProfRightPart.jsx';

export default function PageVersionProf() {
  const [selections, setSelections] = useState({});
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

  const handleSelectionChange = useCallback((newSelections) => {
    setSelections(newSelections);
  }, []);

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

  return (
    <>
      <Header ComposantProp={() => <BarreOutils lockButton={true} />} isAdmin={admin} />
      <div className="app">
        <LeftPart ComposantProp={() => <VersionProfLeftPart onSelectionChange={handleSelectionChange} />} />
        <RightPart ComposantProp={() => <VersionProfRightPart selections={selections} />} />
      </div>
    </>
  );
}
