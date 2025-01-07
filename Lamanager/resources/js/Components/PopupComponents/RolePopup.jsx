import React, { useState } from "react";

const RoleManagementPopup = ({ onClose }) => {
  // Données brutes simulées
  const initialRoles = [
    { id: 1, name: "Chercheur", hours: 392 },
    { id: 2, name: "Plein Temps", hours: 1000 },
  ];

  const [roles, setRoles] = useState(initialRoles);
  const [newRole, setNewRole] = useState({ id: null, name: "", hours: "" });

  const handleAddRole = () => {
    if (newRole.name && newRole.hours) {
      const newRoleData = {
        id: roles.length ? roles[roles.length - 1].id + 1 : 1,
        name: newRole.name,
        hours: parseInt(newRole.hours, 10),
      };
      setRoles([...roles, newRoleData]);
      setNewRole({ id: null, name: "", hours: "" });
    }
  };

  const handleEditRole = (id) => {
    const roleToEdit = roles.find((role) => role.id === id);
    setNewRole(roleToEdit);
    setRoles(roles.filter((role) => role.id !== id));
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>Gestion des rôles</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="popup-body">
          <div className="roles-section">
            <h3>Rôles</h3>
            <ul>
              {roles.map((role) => (
                <li key={role.id}>
                  {role.name} ({role.hours}h)
                  <button onClick={() => handleEditRole(role.id)}>
                    <i className="edit-icon">✏️</i>
                  </button>
                  <button>
                    <i className="validate-icon">✔️</i>
                  </button>
                </li>
              ))}
            </ul>
            <button className="add-button" onClick={handleAddRole}>+</button>
          </div>
          <div className="creation-section">
            <h3>Création</h3>
            <label>
              Nom du rôle
              <input
                type="text"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
            </label>
            <label>
              Nombre d'heures
              <input
                type="number"
                value={newRole.hours}
                onChange={(e) => setNewRole({ ...newRole, hours: e.target.value })}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagementPopup;
