import React, { useState, useEffect } from "react";
import logo from '../../img/testlogo.png';
import { Link } from '@inertiajs/react';
import { Table, ChartColumnIncreasing, MousePointer2, Settings, BookUser, FileUser, Download } from "lucide-react";
import axios from 'axios';

function BarreOutils() {
    const [promoName, setPromoName] = useState('');
    const params = new URLSearchParams(window.location.search);
    const promoId = params.get('promo_id');

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
            <Link href="/">
                <div className="header-content">
                    <img src={logo} alt="Logo" className="logo" />
                    <h1 className="title">Lamanager</h1>
                </div>
            </Link>
            <div className="NomPromo">
                <h2>{promoName}</h2>
            </div>
            <div className="BarreOutils">
                <ul className="barre-outils-list">
                    <li><Table /></li>
                    <li><ChartColumnIncreasing /></li>
                    <li><MousePointer2 /></li>
                    <li><Settings /></li>
                    <li><BookUser /></li>
                    <li><FileUser /></li>
                    <li><Download /></li>
                </ul>
            </div>
        </>
    );
}

export default BarreOutils;