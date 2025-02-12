import React from 'react';
import { Link } from '@inertiajs/react';
import BarreOutils from './BarreOutils/BarreOutils.jsx';
import BoutonProfil from './Profil/BoutonProfil.jsx';

export default function Header({ ComposantProp, isAdmin }) {
    return (
        <header>
            <div className="header-content">
                <Link href="/">
                    <img src="/testlogo.png" alt="Logo" className="logo" />
                    <h1 className="title">Lamanager</h1>
                </Link>
            </div>
            {isAdmin==true && <ComposantProp />}
            <BoutonProfil />
        </header>
    );
}
