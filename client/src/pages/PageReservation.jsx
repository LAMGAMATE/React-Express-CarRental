import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PageReservation.css';

import toast from 'react-hot-toast'; 

const BookingPage = () => {
    const { carId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const isAdminBooking = location.state?.isAdminBooking || false;

    const [car, setCar] = useState(null);
    const [dates, setDates] = useState({ startDate: '', endDate: '' });
    const [totalPrice, setTotalPrice] = useState(0);

    const [clientInfo, setClientInfo] = useState({
        nomComplet: '',
        phone: '',
        cin: ''
    });

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/cars/${carId}`);
                setCar(res.data);
            } catch (err) {
                console.error("Erreur fetching car", err);
            }
        };
        fetchCar();
    }, [carId]);

    useEffect(() => {
        if (dates.startDate && dates.endDate && car) {
            const start = new Date(dates.startDate);
            const end = new Date(dates.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
            setTotalPrice(diffDays * car.prixParJour);
        }
    }, [dates, car]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const reservationData = {
            utilisateur_id: isAdminBooking ? null : currentUser?.id, 
            voiture_id: carId,
            dateDebut: dates.startDate,
            dateFin: dates.endDate,
            prixTotal: totalPrice,
            statut: isAdminBooking ? 'confirmee' : 'en_attente',
            clientDetails: isAdminBooking ? {
                nomComplet: clientInfo.nomComplet,
                phone: clientInfo.phone,
                cin: clientInfo.cin
            } : null
        };

        try {
            await axios.post('http://localhost:5000/api/reservations/add', reservationData);
            toast.success(isAdminBooking ? "Location Directe Enregistrée !" : "Réservation envoyée !");
            navigate('/');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message); 
            } else {
                toast.error("Une erreur est survenue lors de la réservation.");
            }
        }
    };

    if (!car) return <div className="loading-state">Chargement...</div>;

    return (
        <div className="booking-wrapper">
            {/* زر العودة إلى الرئيسية */}
            <button className="back-home-btn" onClick={() => navigate('/')}>
                ← <span>Retour à l'accueil</span>
            </button>

            <div className="booking-container">
                <header className="booking-header">
                    <h2>{isAdminBooking ? "Location Directe" : "Confirmation de Réservation"}</h2>
                    <p className="subtitle">Veuillez vérifier les informations avant de valider.</p>
                </header>
                
                <div className="booking-grid">
                    {/* قسم ملخص السيارة */}
                    <aside className="car-summary card">
                        <div className="image-wrapper">
                            <img src={`http://localhost:5000${car.image_url}`} alt={car.marque} />
                        </div>
                        <div className="car-details-brief">
                            <h3>{car.marque} <span className="blue-text">{car.modele}</span></h3>
                            <div className="pricing-tag">
                                <span className="amount">{car.prixPar_Jour || car.prixParJour} DH</span>
                                <span className="unit">/ Jour</span>
                            </div>
                        </div>
                    </aside>

                    {/* قسم الفورم */}
                    <main className="booking-main">
                        <form onSubmit={handleSubmit} className="booking-form card">
                            {isAdminBooking && (
                                <section className="admin-client-section">
                                    <h4 className="section-title">👤 Informations du Client</h4>
                                    <div className="form-group full-width">
                                        <label>Nom Complet:</label>
                                        <input 
                                            type="text" 
                                            placeholder="Nom et Prénom"
                                            required 
                                            onChange={(e) => setClientInfo({...clientInfo, nomComplet: e.target.value})}
                                        />
                                    </div>
                                    <div className="input-row">
                                        <div className="form-group">
                                            <label>Téléphone:</label>
                                            <input 
                                                type="text" 
                                                placeholder="06XXXXXXXX"
                                                required 
                                                onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CIN:</label>
                                            <input 
                                                type="text" 
                                                placeholder="AB123456"
                                                required 
                                                onChange={(e) => setClientInfo({...clientInfo, cin: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <hr className="divider" />
                                </section>
                            )}

                            <h4 className="section-title">📅 Période de Location</h4>
                            <div className="input-row">
                                <div className="form-group">
                                    <label>Date de Début:</label>
                                    <input 
                                        type="date" 
                                        required 
                                        min={new Date().toISOString().split("T")[0]}
                                        onChange={(e) => setDates({...dates, startDate: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date de Fin:</label>
                                    <input 
                                        type="date" 
                                        required 
                                        min={dates.startDate || new Date().toISOString().split("T")[0]}
                                        onChange={(e) => setDates({...dates, endDate: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="price-summary-box">
                                <div className="price-row">
                                    <span>Prix Total</span>
                                    <span className="total-amount-display">{totalPrice} DH</span>
                                </div>
                            </div>

                            <button type="submit" className={`btn-confirm-final ${isAdminBooking ? 'admin-theme' : ''}`}>
                                {isAdminBooking ? "Enregistrer maintenant" : "Confirmer ma réservation"}
                            </button>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;