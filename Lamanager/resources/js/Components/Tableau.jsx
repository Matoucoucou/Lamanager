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

            
            var compteur = 18;

            var liste_recherche = [];
            var liste_heures = [];
            
            // Voici le code le moins modulable de France !!
            while(rows[compteur][1] !== ""){
                var liste_temp = [];
                var compteur2 = 2;
                liste_recherche.push(rows[compteur][1]);
               
                liste_temp.push(rows[compteur][4]);
                liste_temp.push(rows[compteur][5]);
                liste_temp.push(rows[compteur][6]);
                liste_temp.push(rows[compteur][8]);
                liste_temp.push(rows[compteur][10]);
                liste_temp.push(rows[compteur][11]);
                liste_temp.push(rows[compteur][12]);
                liste_temp.push(rows[compteur][14]);
                
                // while(compteur2<rows[compteur].length){
                //      const split_row = rows[compteur][compteur2].split("");
                //      if (split_row[0]>0 && split_row[0]<9){
                //          var temp = "";
                //          for (var i=0;i<split_row.length;i++){
                //              temp = temp + split_row[i];
                //          }
                //          list_temp.push(parseInt(temp));
                //      }        
                //      compteur2++;
                // }
                // liste_heures.push(list_temp);
                compteur++;
                liste_heures.push(liste_temp);
            };
            
            console.log("Liste des heures : ",liste_heures)
            console.log(liste_recherche);
            //console.log(liste_heures);
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
