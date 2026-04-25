import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pages.css';

import toast from 'react-hot-toast'; 

const Profile = () => {
    // 1. جلب البيانات من LocalStorage
    const user = JSON.parse(localStorage.getItem('user'));
    
    const [formData, setFormData] = useState({
        userId: user?.id || '', 
        email: user?.email || '',
        phone: user?.phone || '',
        oldPassword: '',
        newPassword: ''
    });

    // للتأكد من تحديث البيانات إذا دخل المستخدم الصفحة مباشرة
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                userId: user.id,
                email: user.email,
                phone: user.phone
            }));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // اختيار اختياري: إظهار رسالة تحميل بينما يتم الرد من السيرفر
        const loadingToast = toast.loading('Updating profile...');

        try {
            const response = await axios.put('http://localhost:5000/api/auth/update-profile', formData);
            
            // نجاح العملية
            toast.success(response.data.message, { id: loadingToast });

            // تحديث البيانات محلياً
            const updatedUser = { ...user, email: formData.email, phone: formData.phone };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setFormData(prev => ({
                ...prev,
                oldPassword: '',
                newPassword: ''
            }));

        } catch (error) {
            console.error("Error details:", error.response);
            
            // فشل العملية
            const errorMsg = error.response?.data?.message || "Update failed";
            toast.error(errorMsg, { id: loadingToast });
        }
    };

    return (
        <div className="page-container" style={{maxWidth: '500px'}}>
            <h1 className="page-title">Edit <span className="blue-text">Profile</span></h1>
            <form onSubmit={handleSubmit} className="contact-form">
                <label>Adresse email</label>
                <input 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                />

                <label>Numéro de téléphone</label>
                <input 
                    name="phone" 
                    type="text" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                />

                <hr style={{margin: '20px 0', border: '0.5px solid #eee'}} />
                <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '10px'}}>
                    To confirm changes, please enter your password:
                </p>

                <label>Mot de passe actuel</label>
                <input 
                    name="oldPassword" 
                    type="password" 
                    value={formData.oldPassword} // تأكد من ربط القيمة بـ state
                    onChange={handleChange} 
                    required 
                />

                <label>Nouveau mot de passe</label>
                <input 
                    name="newPassword" 
                    type="password" 
                    placeholder="Leave blank to keep current" 
                    value={formData.newPassword} // تأكد من ربط القيمة بـ state
                    onChange={handleChange} 
                />

                <button type="submit" className="btn-send" style={{marginTop: '20px'}}>
                    Enregistrer les modifications
                </button>
            </form>
        </div>
    );
};

export default Profile;