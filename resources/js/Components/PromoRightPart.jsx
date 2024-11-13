import React, { useState, useEffect } from "react";
import axios from 'axios';
import ChoixPromo from "./ChoixPromo";
import BoutonModificationsPromos from "./BoutonsModificationsPromos";
import { Trash2, Edit } from "lucide-react";
import { Link } from '@inertiajs/react';
import CustomPopup from "@/Components/CustomPopup.jsx";

function PromoRightPart({ selectedAnnee }) {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCustomPopup, setShowCustomPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);

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

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
        <div className="Promos">
            <ul className="promos-list">
                {promos.map((promo) => (
                    <li key={promo.id}>
                        <Link href={`/test?promo_id=${promo.id}&annee_id=${selectedAnnee.id}`}>
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
                <CustomPopup
                    onClose={() => setShowCustomPopup(false)}
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

        {/* Popup d'édition */}
        {showEditPopup && (
            <div className="popup-overlay">
            <div className="popup-content">
                <h2>Édition</h2>
                <p>Message de test pour l'édition</p>
                <button onClick={() => setShowEditPopup(false)}>Fermer</button>
            </div>
            </div>
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
