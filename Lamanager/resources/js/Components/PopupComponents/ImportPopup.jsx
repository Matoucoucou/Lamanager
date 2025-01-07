import React, { useState, useEffect } from "react";
import axios from 'axios';

function ImportPopup({ onClose }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [listeRecherche, setListeRecherche] = useState([]); 
    const [semestre, setSemestre] = useState();
    const [listeHeures, setListeHeures] = useState([]);
    const [isAlternance, setIsAlternance] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const params = new URLSearchParams(window.location.search);
    const promoId = params.get('promo_id');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const parseValue = (value, field) => {
        if (field >= 0 && field <= 7) {
            return value === "" ? "" : parseFloat(value);
        }
        return value;
    };

    const handleInputChange = (e, index, field) => {
        const newValue = parseValue(e.target.value, field);
        const newListeHeures = [...listeHeures];
        newListeHeures[index][field] = newValue;
        setListeHeures(newListeHeures);
    };

    const toggleEditMode = () => {
        if (isEditing) {
            handleValidate(); 
        } else {
            setIsDisabled(true);
        }
        setIsEditing(!isEditing);
    };
    

    const handleValidate = async () => {
        if (!selectedFile) {
            setErrorMessage("Veuillez selectionner un fichier CSV en premier.");
        } else {
            setErrorMessage("");
            //console.log("Valeurs modifiées : ", listeHeures);

            try {
                const promo = await axios.get(`/api/promo/${promoId}`);
                console.log("Les valeurs de promo : ", promo);

                for (let index = 0; index < listeRecherche.length; index++) { 
                    if (promo.data.alternant_id !== null){
                        const item = listeRecherche[index]; 
                        const donnes_alternant = await axios.post('api/enseignements', { 
                            nom: item, 
                            promo_id: promo.data.alternant_id, 
                            alternant: isAlternance,
                            nombre_heures_cm: listeHeures[index][0], 
                            nombre_heures_td: listeHeures[index][1], 
                            nombre_heures_tp: listeHeures[index][2], 
                            semestre: semestre, 
                            nombre_heures_projet: listeHeures[index][3], 
                        }); 
                    };
                    const item = listeRecherche[index]; 
                    const response = await axios.post('api/enseignements', { 
                        nom: item, 
                        promo_id: promoId, 
                        alternant: false,
                        nombre_heures_cm: listeHeures[index][0], 
                        nombre_heures_td: listeHeures[index][1], 
                        nombre_heures_tp: listeHeures[index][2], 
                        semestre: semestre, 
                        nombre_heures_projet: listeHeures[index][3], 
                    }); 
                    //console.log(response.data);
                    setIsDisabled(false);
                    onClose();
                }
                
            } catch (error) {
                console.error("Erreur lors de la sauvegarde des données", error);
            }
        }
    };
    

    

    useEffect(() => {
        if (selectedFile) {
            const handleImport = async () => {
                try {
                    const reader = new FileReader();

                    reader.onload = (event) => {
                        const csvContent = event.target.result;
                        //console.log("CSV Content:", csvContent);

                        const rows = csvContent.split('\n').map(row => row.split(','));
                        //console.log("Parsed CSV:", rows);

                        let compteur = 18;
                        let i = 0;
                        let alternance = false;

                        let liste_recherche = [];
                        let liste_heures = [];

                        while (rows[compteur] && rows[compteur][1] !== "") {
                            let liste_temp = [];
                            liste_recherche.push(rows[compteur][1]);

                            let cm = parseFloat(rows[compteur][4] || "0");
                            let td = parseFloat(rows[compteur][5] || "0");
                            let tp = parseFloat(rows[compteur][6] || "0");
                            let total = parseFloat(rows[compteur][8]);

                            let heures_projet = total - (cm + td + tp);

                            liste_temp.push(cm);
                            liste_temp.push(td);
                            liste_temp.push(tp);
                            liste_temp.push(heures_projet);

                            if (rows[9][7] === "Alternance") {
                                alternance = true;
                                liste_temp.push(parseFloat(rows[compteur][10] || cm));
                                liste_temp.push(parseFloat(rows[compteur][11] || td));
                                liste_temp.push(parseFloat(rows[compteur][12] || tp));
                                liste_temp.push(parseFloat(rows[compteur][14]));
                            }

                            liste_heures.push(liste_temp);
                            compteur++;
                        }

                        
                        while (liste_recherche[i][0]!=="R"){
                            i++;
                        }
                        let semestre = liste_recherche[i][1];
                        //console.log("Liste des heures : ", liste_heures);
                        //console.log("Liste des ressources :", liste_recherche);        
                        //console.log(semestre);
                        
                        setIsAlternance(alternance);
                        setListeRecherche(liste_recherche); 
                        setListeHeures(liste_heures);
                        setSemestre(semestre);
                    };
                    

                    reader.readAsText(selectedFile);
                } catch (error) {
                    console.error("Erreur lors de la lecture du fichier:", error);
                }
            };
            handleImport();
        }
    }, [selectedFile]);

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <input type="file" accept=".csv" onChange={handleFileChange} />

                {errorMessage && <div className="error-message">{errorMessage}</div>}
                
                <div className="tableau-import">
                    {listeRecherche.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="border border-black p-2">Ressources / SAE</th> 
                                    <th colSpan={4} className="border border-black p-2">Formation initiale</th> 
                                    {isAlternance && <th colSpan={4} className="border border-black p-2">Alternance</th>}
                                </tr>
                                <tr>
                                    <th className="border border-black p-2">CM</th>
                                    <th className="border border-black p-2">TD</th>
                                    <th className="border border-black p-2">TP</th>
                                    <th className="border border-black p-2">Heures projet</th>
                                    {isAlternance && <th className="border border-black p-2">CM</th>} 
                                    {isAlternance && <th className="border border-black p-2">TD</th>} 
                                    {isAlternance && <th className="border border-black p-2">TP</th>} 
                                    {isAlternance && <th className="border border-black p-2">Heures projet</th>}
                                </tr>                            
                            </thead>

                            <tbody className="border border-black p-2">
                                {listeRecherche.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border border-black p-2">{item}</td>
                                        <td className="border border-black p-2">{isEditing ? <input class = "champ" type="text" maxlength="4" value={listeHeures[index][0] !== undefined ? listeHeures[index][0] : ''} onChange={(e) => handleInputChange(e, index, 0)} /> : listeHeures[index] && listeHeures[index][0]}</td>
                                        <td className="border border-black p-2">{isEditing ? <input class = "champ" type="text" maxlength="4" value={listeHeures[index][1] !== undefined ? listeHeures[index][1] : ''} onChange={(e) => handleInputChange(e, index, 1)} /> : listeHeures[index] && listeHeures[index][1]}</td>
                                        <td className="border border-black p-2">{isEditing ? <input class = "champ" type="text" maxlength="4" value={listeHeures[index][2] !== undefined ? listeHeures[index][2] : ''} onChange={(e) => handleInputChange(e, index, 2)} /> : listeHeures[index] && listeHeures[index][2]}</td>
                                        <td className="border border-black p-2">{isEditing ? <input class = "champ" type="text" maxlength="4" value={listeHeures[index][3] !== undefined ? listeHeures[index][3] : ''} onChange={(e) => handleInputChange(e, index, 3)} /> : listeHeures[index] && listeHeures[index][3]}</td>
                                        {isAlternance && (
                                            <>
                                                <td className="border border-black p-2">{isEditing ? <input class = "champ" type="text" value={listeHeures[index][4] !== undefined ? listeHeures[index][4] : ''} onChange={(e) => handleInputChange(e, index, 4)} /> : listeHeures[index] && listeHeures[index][4]}</td>
                                                <td className="border border-black p-2">{isEditing ? <input class = "champ" type="text" value={listeHeures[index][5] !== undefined ? listeHeures[index][5] : ''} onChange={(e) => handleInputChange(e, index, 5)} /> : listeHeures[index] && listeHeures[index][5]}</td>
                                                <td className="border border-black p-2">{isEditing ? <input class = "champ" type="text" value={listeHeures[index][6] !== undefined ? listeHeures[index][6] : ''} onChange={(e) => handleInputChange(e, index, 6)} /> : listeHeures[index] && listeHeures[index][6]}</td>
                                                <td className="border border-black p-2">{isEditing ? <input class = "champ" type="text" value={listeHeures[index][7] !== undefined ? listeHeures[index][7] : ''} onChange={(e) => handleInputChange(e, index, 7)} /> : listeHeures[index] && listeHeures[index][7]}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>  
                <div className="button-container">
                    <button onClick={handleValidate} disabled={isDisabled} className={isDisabled ? 'button-disabled' : ''} > Valider </button>
                    <button onClick={toggleEditMode}>{isEditing ? "Terminer" : "Modifier"}</button>
                </div>     
            </div>
        </div>
    );
}

export default ImportPopup;