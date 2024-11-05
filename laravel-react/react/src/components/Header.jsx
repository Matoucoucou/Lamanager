import React from "react";
import logo from '../assets/lamanager.png';

function Header() {
  return (
    <header>
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="title">Lamanager</h1>
    </header>
  );
}

export default Header;