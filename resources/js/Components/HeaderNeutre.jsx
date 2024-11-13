import React from "react";
import logo from '../../img/testlogo.png';
import { Link } from '@inertiajs/react';

function HeaderNeutre({ }) {
    return (
        <>
        <Link href="/">
          <div className="header-content">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="title">Lamanager</h1>
          </div>
        </Link>
      </>
    )
}

export default HeaderNeutre;