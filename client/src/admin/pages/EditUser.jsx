import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Admin.css'; 

import toast from 'react-hot-toast'; 

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        cin: '',
        nomComplet: '',
        email: '',
        phone: ''
    });

    // جلب بيانات المستخدم عند تحميل الصفحة لتظهر في الحقول
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/auth/users/${id}`);
                // تعبئة البيانات المستلمة في الـ state لتظهر في الـ input
                if(res.data) {
                    setUserData({
                        cin: res.data.cin || '',
                        nomComplet: res.data.nomComplet || '',
                        email: res.data.email || '',
                        phone: res.data.phone || ''
                    });
                }
            } catch (err) {
                console.error("Error loading user data", err);
                toast.error("Impossible de charger les informations de l'utilisateur");
            }
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/auth/users/update/${id}`, userData);
            toast.success("Informations mises à jour avec succès !");
            navigate('/admin/users');
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de la modification");
        }
    };

    return (
        <div className="admin-container"> {/* استخدمنا حاوية الـ admin للتناسق */}
            <div className="add-car-container">
                <div className="form-card shadow-sm">
                    <h2 className="page-title">Modifier <span className="blue-text">Client</span></h2>
                    <p className="subtitle">Mettre à jour les informations du profil.</p>
                    
                    <form onSubmit={handleSubmit} className="add-car-form">
                        <div className="form-group">
                            <label>CIN</label>
                            <input type="text" name="cin" value={userData.cin} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Nom Complet</label>
                            <input type="text" name="nomComplet" value={userData.nomComplet} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={userData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Téléphone</label>
                            <input type="text" name="phone" value={userData.phone} onChange={handleChange} required />
                        </div>
                        
                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={() => navigate('/admin/users')}>
                                Annuler
                            </button>
                            <button type="submit" className="btn-submit">
                                Enregistrer les modifications
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUser;