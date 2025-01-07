import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/GestionCompte.css"; // Ajustez le chemin d'importation

const GestionCompte = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formAccount, setFormAccount] = useState({
    nom: '',
    prenom: '',
    mail: '',
    role_id: '',
    password: '',
    actif: 1,
    admin: false, // Ajoutez le champ admin
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('/api/enseignants/liste');
        setAccounts(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des enseignants:', error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get('/api/roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles:', error);
      }
    };

    fetchAccounts();
    fetchRoles();
  }, []);

  const handleEditClick = (account) => {
    setSelectedAccount(account);
    setFormAccount({
      nom: account.nom || '',
      prenom: account.prenom || '',
      mail: account.mail || '',
      role_id: account.role_id || '',
      password: '', // Ne pas pré-remplir le mot de passe
      actif: account.actif || 1,
      admin: account.admin || false,
    });
    setShowForm(true);
  };

  const handleDelete = () => {
    setAccounts(accounts.filter((a) => a.id !== selectedAccount.id));
    setSelectedAccount(null);
  };

  const handleValidate = async (e) => {
    e.preventDefault();
    console.log('Form Account:', formAccount);
    if (selectedAccount) {
        // Update existing account
        try {
            const response = await axios.put(`/api/enseignants/${selectedAccount.id}`, formAccount);
            setAccounts(accounts.map((account) => (account.id === selectedAccount.id ? response.data : account)));
            setSelectedAccount(null);
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'enseignant:', error);
        }
    } else {
        // Add new account
        try {
            const response = await axios.post('/api/enseignants', {
                ...formAccount,
                password_confirmation: formAccount.password, // Add password confirmation
            });
            setAccounts([...accounts, response.data]);
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Erreur lors de la création de l\'enseignant:', error);
        }
    }
    setShowForm(false);
    setFormAccount({
        nom: '',
        prenom: '',
        mail: '',
        role_id: '',
        password: '',
        actif: 1,
        admin: false, // Réinitialisez le champ admin
    });
  };

  const handleAccountChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormAccount((prevState) => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormAccount({
        nom: '',
        prenom: '',
        mail: '',
        role_id: '',
        password: '',
        actif: 1,
        admin: false, // Réinitialisez le champ admin
    });
  };

  const handleAddClick = () => {
    setSelectedAccount(null);
    setFormAccount({
        nom: '',
        prenom: '',
        mail: '',
        role_id: '',
        password: '',
        actif: 1,
        admin: false, // Réinitialisez le champ admin
    });
    setShowForm(true);
  };

  const toggleActiveStatus = async (accountId) => {
    const account = accounts.find((a) => a.id === accountId);
    const updatedAccount = { ...account, actif: !account.actif };

    try {
      await axios.put(`/api/enseignants/${accountId}`, updatedAccount);
      setAccounts(accounts.map((a) => (a.id === accountId ? updatedAccount : a)));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut actif:', error);
    }
  };

  return (
    <div className="account-manager">
      <div className="account-selection">
        <div className="header">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="add-btn" onClick={handleAddClick}>Ajouter un Compte</button>
        </div>
        {accounts.filter(account => account.nom.includes(searchTerm) || account.prenom.includes(searchTerm)).map((account) => (
          <div key={account.id} className="account-item">
            <span>{account.nom} {account.prenom}</span>
            <div>
              <span
                className={`status-icon ${account.actif ? "active" : "inactive"}`}
                onClick={() => toggleActiveStatus(account.id)}
              >
                ●
              </span>
              <button
                className="edit-btn"
                onClick={() => handleEditClick(account)}
              >
                ✎
              </button>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="account-modification">
          <div className="form-header">
            <h3>{selectedAccount ? 'Modifier le Compte' : 'Ajouter un Compte'}</h3>
          </div>
          <form onSubmit={handleValidate}>
            <label>Nom</label>
            <input
              type="text"
              name="nom"
              value={formAccount.nom}
              onChange={handleAccountChange}
              required
            />
            <label>Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formAccount.prenom}
              onChange={handleAccountChange}
              required
            />
            <label>Mail</label>
            <input
              type="email"
              name="mail"
              value={formAccount.mail}
              onChange={handleAccountChange}
              required
            />
            <label>Rôle</label>
            <select
              name="role_id"
              value={formAccount.role_id}
              onChange={handleAccountChange}
              required
            >
              <option value="">Sélectionner un rôle</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.nom} ({role.nombre_heure} h)
                </option>
              ))}
            </select>
            {!selectedAccount && (
              <>
                <label>Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={formAccount.password}
                  onChange={handleAccountChange}
                  required
                />
              </>
            )}
            <label>Actif</label>
            <select
              name="actif"
              value={formAccount.actif}
              onChange={handleAccountChange}
              required
            >
              <option value={1}>Actif</option>
              <option value={0}>Inactif</option>
            </select>
            <label>Admin</label>
            <input
              type="checkbox"
              name="admin"
              className="admin-checkbox"
              checked={formAccount.admin}
              onChange={handleAccountChange}
            />
            <div className="action-buttons">
              <button type="submit" className="validate-btn">Valider</button>
              <button type="button" className="cancel-btn" onClick={handleCancel}>Annuler</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GestionCompte;
