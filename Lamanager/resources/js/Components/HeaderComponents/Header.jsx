import React from "react";
import ProfileButton from "@/Components/ButtonComponents/ProfileButton.jsx";

function Header({ ComposantProp }) {
  return (
    <header>
      <ComposantProp/>
      <ProfileButton />
    </header>

  );
}

export default Header;
