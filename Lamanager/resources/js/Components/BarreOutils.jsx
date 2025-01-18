import React, { useState, useEffect } from "react";
import logo from '../../img/testlogo.png';
import { Link } from '@inertiajs/react';
import { Table, ChartColumnIncreasing, MousePointer2, Settings, BookUser, FileUser, Download } from "lucide-react";
import axios from 'axios';
import ImportPopup from "@/Components/ImportPopup.jsx";
import RolePopup from "@/Components/RolePopup.jsx";

function BarreOutils({ toggleIcons }) {
    const [showCustomPopup, setShowCustomPopup] = useState(false);
    const [showRolePopup, setShowRolePopup] = useState(false);
    const [promoName, setPromoName] = useState('');
    const [popupInfoButton, setPopupInfoButton] = useState("")
    const params = new URLSearchParams(window.location.search);
    const promoId = params.get('promo_id');

    const redirectionGestion = () => {
        <Link href="/profil"></Link>
    }
    useEffect(() => {
        const fetchPromoName = async () => {
            if (promoId) {
                try {
                    const response = await axios.get(`/api/promo/${promoId}`);
                    setPromoName(response.data.nom);
                } catch (error) {
                    console.error('Erreur lors de la récupération du nom de la promo:', error);
                }
            }
        };

        fetchPromoName();
    }, [promoId]);
    function handleMouseEnter(e,text) {
        const cell = e.target; // Récupère la cellule cible
        const rect = cell.getBoundingClientRect();
        setPopupInfoButton({
            visible: true,
            text : text,
            x : rect.x,
            y : rect.y,
            height : rect.height
        })
    }
    function handleMouseLeave() {
        setPopupInfoButton({ visible: false, x: 0, y: 0, content: '' });
    }

    return (

        <>
            {popupInfoButton.visible && (
                <div
                    style={{
                        position: 'fixed',
                        top: popupInfoButton.y + popupInfoButton.height,
                        left: popupInfoButton.x - 50,
                        backgroundColor: 'white',
                        border: '1px solid black',
                        paddingRight : '5px',
                        paddingLeft : '5px',
                        borderRadius: '5px',
                        zIndex: 1000,
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        display: 'flex',


                    }}
                >
                    {popupInfoButton.text}
                </div>
            )}
            <Link href="/">
                <div className="header-content">
                    <img src={logo} alt="Logo" className="logo" />
                    <h1 className="title">Lamanager</h1>
                </div>
            </Link>

            {window.location.pathname === '/tableau' && (
                <div className="NomPromo">
                    <h2>{promoName}</h2>
                </div>
            )}

            <div className="BarreOutils">
                <ul className="barre-outils-list">
                    <li className="barre-outils-item" onClick={() => setShowCustomPopup(true)}

                        onMouseEnter={(e) => handleMouseEnter(e,"Importation du MCCC")}
                        onMouseLeave={handleMouseLeave}

                    ><Table/></li>

                    <li className="barre-outils-item"
                        onMouseEnter={(e) => handleMouseEnter(e,"Version Professeur")}
                        onMouseLeave={handleMouseLeave}>
                        <Link href="/versionProf"><ChartColumnIncreasing /></Link></li>

                    <li className="barre-outils-item" onClick={toggleIcons}
                        onMouseEnter={(e) => handleMouseEnter(e,"Outil de sélection")}
                        onMouseLeave={handleMouseLeave}><MousePointer2 /></li>
                    <li className="barre-outils-item"
                        onMouseEnter={(e) => handleMouseEnter(e,"Gestion des comptes")}
                        onMouseLeave={handleMouseLeave}>
                        <Link href={"/profil?from=tableau"}>
                            <BookUser />
                        </Link>
                    </li>
                    <li className="barre-outils-item" onClick={() => setShowRolePopup(true)}
                        onMouseEnter={(e) => handleMouseEnter(e,"Gestion des roles")}
                        onMouseLeave={handleMouseLeave}><FileUser /></li>
                    <li className="barre-outils-item"
                        onMouseEnter={(e) => handleMouseEnter(e,"Téléchargement du prévisionel")}
                        onMouseLeave={handleMouseLeave}><Download /></li>
                </ul>
            </div>
            {showCustomPopup && (
                <ImportPopup
                    onClose={() => setShowCustomPopup(false)}
                />
            )}

            {showRolePopup && (
                <RolePopup
                    onClose={() => setShowRolePopup(false)}
                />
            )}
        </>
    );
}

export default BarreOutils;
