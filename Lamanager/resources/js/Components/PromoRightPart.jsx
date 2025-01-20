import React, { useState, useEffect } from "react";
import axios from 'axios';
import ChoixPromo from "./ChoixPromo";
import AjoutPromo from "@/Components/AjoutPromo.jsx";
import BoutonModificationsPromos from "./BoutonsModificationsPromos";
import { Trash2, Edit } from "lucide-react";
import { Link } from '@inertiajs/react';
import PopupModifPromo from "./PopupModifPromo";
import PopupSuppression from "./popupSuppression"; // Importez le composant PopupSuppression

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
                setPromos(response.data);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des promos');
                setLoading(false);
            }
        };

        fetchPromos();
    }, [selectedAnnee]);

    const handleDelete = (promoId) => {
        setPromos(promos.filter(promo => promo.id !== promoId));
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    var temp = [];
    for(var i=0;i<promos.length;i++){
        if(!promos[i].alternant){
            temp.push(promos[i]);
        }
    }
    
    temp.sort((a, b) => {
        // Extract the number from the 'nom' attribute
        const numA = parseInt(a.nom.replace(/\D/g, ''), 10);
        const numB = parseInt(b.nom.replace(/\D/g, ''), 10);
        return numA - numB;
    });

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
                onClose={() => setShowCustomPopup(false)}
            />
        )}

        {showDeletePopup && (
            <PopupSuppression
                onClose={() => setShowDeletePopup(false)}
                promos={promos}
                onDelete={handleDelete}
            />
        )}

        {showEditPopup && (
            <PopupModifPromo
                onClose={() => setShowEditPopup(false)}
                promos={promos}
                selectedYear={selectedAnnee.annee}
            />
        )}
    </>
    );
}

export default PromoRightPart;