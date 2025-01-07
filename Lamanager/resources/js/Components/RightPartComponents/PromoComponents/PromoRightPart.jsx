import React, { useState, useEffect } from "react";
import axios from 'axios';
import ChoixPromo from "./ChoixPromo.jsx";
import AjoutPromo from "@/Components/PopupComponents/AjoutPromo.jsx";
import BoutonModificationsPromos from "../../BoutonsModificationsPromos.jsx";
import { Trash2, Edit } from "lucide-react";
import { Link } from '@inertiajs/react';
import PopupModifPromo from "../../PopupModifPromo.jsx";

function PromoRightPart({ selectedAnnee }) {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showCustomPopup, setShowCustomPopup] = useState(false);
    useEffect(() => {
        const fetchPromos = async () => {
            if (!selectedAnnee) return;
            try {

                const response = await axios.get(`/api/promos/${selectedAnnee.id}`);


                //console.log(response.data);
                setPromos(response.data);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des promos');
                setLoading(false);
            }
        };

        fetchPromos();
    }, [selectedAnnee]);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    var temp = [];
    for(var i=0;i<promos.length;i++){
        if(!promos[i].alternant){
            temp.push(promos[i]);
            //console.log('temp',temp);
        }
    }

    return (
        <>
        <div className="Promos">
            <ul className="promos-list">
                {temp.map((promo) => (
                    <li key={promo.id}>
                        <Link href={`/tableau?promo_id=${promo.id}&annee_id=${selectedAnnee.id}`}>
                            <ChoixPromo className="but-class" title={promo.nom} />
                        </Link>
                    </li>
                ))}
                <li onClick={() => setShowCustomPopup(true)}><ChoixPromo className="but-class" title="+"/></li>
            </ul>
        </div>
        <div className="ModificationsPromos">
            <BoutonModificationsPromos
            className="btn-modif-class"
            Icon={Trash2}
            onClick={() => setShowDeletePopup(true)}
            />
            <BoutonModificationsPromos
            className="btn-modif-class"
            Icon={Edit}
            onClick={() => setShowEditPopup(true)}
            />
        </div>

            {showCustomPopup && (
                <AjoutPromo
                    selectedAnnee={selectedAnnee}
                    onClose={() => setShowCustomPopup(false )}
                />
            )}

        {/* Popup de suppression */}
        {showDeletePopup && (
            <div className="popup-overlay">
            <div className="popup-content">
                <h2>Suppression</h2>
                <p>Message de test pour la suppression</p>
                <button onClick={() => setShowDeletePopup(false)}>Fermer</button>
            </div>
            </div>
        )}

        {showEditPopup && (
                <PopupModifPromo
                    onClose={() => setShowEditPopup(false)}
                    promos={promos}
                    selectedYear={selectedAnnee.annee}
                />
        )}

        {/* Popup d'ajout */}
        {showAddPopup && (
            <div className="popup-overlay">
            <div className="popup-content">
                <h2>Ajout</h2>
                <p>Message de test pour l'ajout</p>
                <button onClick={() => setShowAddPopup(false)}>Fermer</button>
            </div>
            </div>
        )}
    </>
    );
}

export default PromoRightPart;

