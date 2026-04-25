import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

import toast from 'react-hot-toast'; 

const Register = () => {
    const [formData, setFormData] = useState({
        cin: '',
        nomComplet: '',
        email: '',
        password: '',
        phone: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            toast.success(response.data.message || "Compte créé avec succès !");
            navigate('/login'); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Une erreur est survenue");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>Créer un compte</h2>
                    <p>Rejoignez-nous en remplissant les informations ci-dessous.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="input-row">
                        <div className="input-group">
                            <label htmlFor="cin">CIN</label>
                            <input id="cin" name="cin" type="text" placeholder="Ex: AB123456" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="phone">Téléphone</label>
                            <input id="phone" name="phone" type="text" placeholder="0600000000" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="input-group full-width">
                        <label htmlFor="nomComplet">Nom Complet</label>
                        <input id="nomComplet" name="nomComplet" type="text" placeholder="Votre nom et prénom" onChange={handleChange} required />
                    </div>

                    <div className="input-group full-width">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" placeholder="exemple@mail.com" onChange={handleChange} required />
                    </div>

                    <div className="input-group full-width">
                        <label htmlFor="password">Mot de passe</label>
                        <input id="password" name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
                    </div>

                    <button type="submit" className="register-button">
                        S'inscrire
                    </button>
                </form>

                <div className="register-footer">
                    <span>Déjà inscrit ? <Link to="/login">Se connecter</Link></span>
                </div>
            </div>
        </div>
    );
};

export default Register;