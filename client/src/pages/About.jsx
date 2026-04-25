import React from 'react';
import './Pages.css';

import './About.css';


const About = () => {
    // الرابط المستخرج من خرائط جوجل لموقع Rue Juba
    const mapLocation = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.168748366914!2d-8.0169!3d31.6225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafef1d55555555%3A0xabcdef123456789!2sRue%20Juba%2C%20Marrakech!5e0!3m2!1sfr!2sma!4v1711440000000!5m2!1sfr!2sma";

    return (
        <div className="page-container">
            <h1 className="page-title">À Propos de <span className="blue-text">Two Go</span></h1>
            
            <div className="page-content">
                <section className="about-intro">
                    <p>
                        Bienvenue chez <strong>Two Go Car Rental</strong>, votre partenaire de confiance pour la location de voitures à <strong>Marrakech</strong>. 
                        Depuis notre installation au cœur de la Ville Ocre, nous nous engageons à offrir une expérience de mobilité exceptionnelle.
                    </p>
                </section>

                <div className="about-grid">
                    {/* معلومات الوكالة والتواصل */}
                    <div className="about-section info-card">
                        <h3><i className="fas fa-info-circle"></i> Contact & Informations</h3>
                        <ul className="contact-info-list">
                            <li><strong>📍 Adresse:</strong> Rue Juba, Marrakech (MWMP+VJ)</li>
                            <li><strong>📞 Téléphone:</strong> 06 03 57 57 21</li>
                            <li><strong>🌐 Site Web:</strong> <a href="https://twogocarrental.wixsite.com" target="_blank" rel="noreferrer">twogocarrental.wixsite.com</a></li>
                        </ul>
                    </div>

                    {/* ساعات العمل */}
                    <div className="about-section schedule-card">
                        <h3><i className="fas fa-clock"></i> Horaires d'Ouverture</h3>
                        <table className="schedule-table">
                            <tbody>
                                <tr><td>Lundi - Vendredi</td><td>09:00 – 20:00</td></tr>
                                <tr><td>Samedi</td><td>09:00 – 12:00</td></tr>
                                <tr className="closed-day"><td>Dimanche</td><td>Fermé</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="about-grid">
                    <div className="about-section">
                        <h3>Notre Mission</h3>
                        <p>
                            Simplifier votre séjour à Marrakech en proposant des solutions de location flexibles et un service irréprochable du moment de la réservation jusqu'à la remise des clés.
                        </p>
                    </div>

                    <div className="about-section">
                        <h3>Pourquoi Nous Choisir ?</h3>
                        <ul className="custom-list">
                            <li><strong>Emplacement :</strong> Au centre de Marrakech et service Aéroport.</li>
                            <li><strong>Transparence :</strong> Aucun frais caché, tarifs compétitifs.</li>
                            <li><strong>Assistance :</strong> Support client disponible pour vous accompagner.</li>
                        </ul>
                    </div>
                </div>

                <hr className="section-divider" />

                <section className="location-section">
                    <h3>Où nous trouver ?</h3>
                    <p className="location-text">
                        Notre agence est située à <strong>Rue Juba</strong>. Nous assurons également la livraison personnalisée à votre hôtel ou à l'aéroport Marrakech-Ménara.
                    </p>
                    
                    <div className="map-container">
                        <iframe 
                            title="Two Go Location"
                            src={mapLocation}
                            width="100%" 
                            height="400" 
                            style={{ border: 0, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;