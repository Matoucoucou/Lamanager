import React, { useEffect, useState } from 'react';

function TestConnection() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/test') // URL de l'API Laravel
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Erreur:', error));
  }, []);

  return (
    <div>
      <h1>Test de connexion</h1>
      <p>{message ? message : 'Chargement...'}</p>
    </div>
  );
}

export default TestConnection;