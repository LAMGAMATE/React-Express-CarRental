import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyReservations.css';

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchMyReservations = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/reservations/user/${user.id}`);
                setReservations(res.data);
            } catch (err) {
                console.error("Erreur fetching reservations", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchMyReservations();
    }, [user.id]);

    const getStatusStyle = (statut) => {
        switch (statut) {
            case 'confirmee': return 'status-confirmed';
            case 'en_attente': return 'status-pending';
            case 'annulee': return 'status-cancelled';
            case 'terminee': return 'status-finished';
            default: return '';
        }
    };

    const getStatusLabel = (statut) => {
        switch (statut) {
            case 'confirmee': return 'Confirmée';
            case 'en_attente': return 'En Attente';
            case 'annulee': return 'Annulée';
            case 'terminee': return 'Terminée';
            default: return statut;
        }
    };

    if (loading) return <div className="loader">Chargement de vos réservations...</div>;

    return (
        <div className="history-container">
            <h1 className="history-title">Mon Historique de <span className="blue-text">Réservations</span></h1>
            
            <div className="history-notice">
                <p>
                    <strong>Note :</strong> Pour optimiser nos services, l'historique des réservations est automatiquement nettoyé tous les 60 jours.
                </p>
            </div>

            {reservations.length === 0 ? (
                <div className="empty-state">
                    <p>Vous n'avez pas encore effectué de réservations.</p>
                </div>
            ) : (
                <div className="reservations-grid">
                    {reservations.map((res) => (
                        <div key={res.id} className="reservation-card">
                            <div className="res-image-container">
                                <img src={`http://localhost:5000${res.image_url}`} alt={res.marque} />
                                <span className={`res-status ${getStatusStyle(res.statut)}`}>
                                    {getStatusLabel(res.statut)}
                                </span>
                            </div>
                            
                            <div className="res-details">
                                <h3>{res.marque} {res.modele}</h3>
                                <div className="res-info-row">
                                    <span><strong>Début:</strong> {new Date(res.dateDebut).toLocaleDateString('fr-FR')}</span>
                                    <span><strong>Fin:</strong> {new Date(res.dateFin).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="res-price">
                                    <span>Total Payé:</span>
                                    <span className="amount">{res.prixTotal} DH</span>
                                </div>
                                <div className="res-footer">
                                    {/* هنا استخدمنا الحقل الجديد createdAt */}
                                    <small>Réservé le: {res.createdAt ? new Date(res.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReservations;