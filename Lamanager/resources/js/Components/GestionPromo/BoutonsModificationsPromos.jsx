import React from "react";

function BoutonModificationsPromos({ className, Icon, onClick }) {
  return (
    <div className={className} onClick={onClick}>
      <Icon width={50} height={50} color="#564787" />
    </div>
  );
}

export default BoutonModificationsPromos;