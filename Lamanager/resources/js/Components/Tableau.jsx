import React, { useState } from 'react';

function CsvImport() {
    const [selectedFile, setSelectedFile] = useState(null);

    // Gestion de la sélection de fichier
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Gestion de l'affichage du CSV dans la console
    const handleImport = () => {
        if (!selectedFile) {
            alert("Please select a CSV file first.");
            return;
        }

        const reader = new FileReader();

        // Fonction appelée lorsque le fichier est lu avec succès
        reader.onload = (event) => {
            const csvContent = event.target.result;
            console.log("CSV Content:", csvContent);

            // Optionnel : traiter le CSV pour l'afficher sous forme d'objet ou de tableau
            const rows = csvContent.split('\n').map(row => row.split(','));
            console.log("Parsed CSV:", rows);
        };

        // Lire le fichier comme texte
        reader.readAsText(selectedFile);
    };

    return (
        <div className="Tableau">
            <h2>Tableau</h2>
            <h3>CSV Import</h3>
        <input type="file" accept=".csv" onChange={handleFileChange}/>
            <button onClick={handleImport}>Show CSV in Console</button>
        </div>
    );
}


export default CsvImport;
