import React from "react";
import logo from '../../../img/testlogo.png';
import { Link } from '@inertiajs/react';
import ProfileButton from "@/Components/ButtonComponents/ProfileButton.jsx";


function HeaderNeutre({ }) {
    return (
        <>
        <Link href="/public">
          <div className="header-content">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="title">Lamanager</h1>
          </div>
        </Link>
        <ProfileButton />
      </>
    )
}

export default HeaderNeutre;
