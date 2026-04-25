import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [showCarMenu, setShowCarMenu] = useState(false);

    // دالة لجلب تاريخ اليوم بتنسيق فرنسي
    const getCurrentDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('fr-FR', options);
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1 className="page-title">Portail <span className="blue-text">Admin</span></h1>
                <p className="subtitle">Ravi de vous revoir ! Voici l'activité d'aujourd'hui.</p>
                {/* عرض التاريخ الديناميكي */}
                <p className="current-date">{getCurrentDate()}</p>
            </header>
            
            <div className="stats-grid">
                {/* Card: Manage Cars */}
                <div className={`stat-card ${showCarMenu ? 'active-card' : ''}`}>
                    <div className="card-icon">🚗</div>
                    <h3>Gestion de Flotte</h3>
                    <p>Contrôlez votre inventaire de véhicules et vos annonces.</p>
                    
                    <button 
                        className="btn-main toggle-btn" 
                        onClick={() => setShowCarMenu(!showCarMenu)}
                    >
                        Gérer les Voitures {showCarMenu ? '▲' : '▼'}
                    </button>

                    {showCarMenu && (
                        <div className="sub-menu-options">
                            <Link 
                                to="/admin/add-car" 
                                className="sub-link" 
                                onClick={() => setShowCarMenu(false)}
                            >
                                ➕ Ajouter une voiture
                            </Link>
                            <Link 
                                to="/admin/cars" 
                                className="sub-link" 
                                onClick={() => setShowCarMenu(false)}
                            >
                                📂 Liste des voitures
                            </Link>
                        </div>
                    )}
                </div>

                {/* Card: Reservations */}
                <div className="stat-card">
                    <div className="card-icon">📅</div>
                    <h3>Réservations</h3>
                    <p>Consultez et approuvez les demandes de réservation en attente.</p>
                    <Link to="/admin/reservations" className="btn-main">Voir les Réservations</Link>
                </div>

                {/* Card: Clients */}
                <div className="stat-card">
                    <div className="card-icon">👥</div>
                    <h3>Clients</h3>
                    <p>Gérez les utilisateurs inscrits et leurs profils.</p>
                    <Link to="/admin/users" className="btn-main">Gérer les Utilisateurs</Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;