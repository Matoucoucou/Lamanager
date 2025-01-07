import React, { useState, useEffect } from "react";
import logo from '../../../img/testlogo.png';
import { Link } from '@inertiajs/react';
import { Table, ChartColumnIncreasing, MousePointer2, Settings, BookUser, FileUser, Download } from "lucide-react";
import axios from 'axios';
import ImportPopup from "@/Components/PopupComponents/ImportPopup.jsx";
import RolePopup from "@/Components/PopupComponents/RolePopup.jsx";

function Toolbar({ toggleIcons }) {
    const [showCustomPopup, setShowCustomPopup] = useState(false);
    const [showRolePopup, setShowRolePopup] = useState(false);
    const [promoName, setPromoName] = useState('');
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

    return (
        <>
            <Link href="/public">
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
                    <li className="barre-outils-item" onClick={() => setShowCustomPopup(true)}><Table/></li>
                    <li className="barre-outils-item"><ChartColumnIncreasing /></li>
                    <li className="barre-outils-item" onClick={toggleIcons}><MousePointer2 /></li>
                    <li className="barre-outils-item"><Settings /></li>
                    <li className="barre-outils-item">
                        <Link href={"/profil?from=tableau"}>
                            <BookUser />
                        </Link>
                    </li>
                    <li className="barre-outils-item" onClick={() => setShowRolePopup(true)}><FileUser /></li>
                    <li className="barre-outils-item"><Download /></li>
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

export default Toolbar;
