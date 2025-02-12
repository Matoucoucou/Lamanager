import React from "react";
import logo from '../../img/testlogo.png';
import { Link } from '@inertiajs/react';
import BoutonProfil from "@/Components/Profil/BoutonProfil.jsx";


function HeaderNeutre({ }) {
    return (
        <>
        <Link href="/">
          <div className="header-content">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="title">Lamanager</h1>
          </div>
        </Link>
        <BoutonProfil />
      </>
    )
}

export default HeaderNeutre;
