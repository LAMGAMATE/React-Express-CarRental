import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // استيراد Navigate للرجوع
import '../../pages/Pages.css';

import toast from 'react-hot-toast'; 

const AddCar = () => {
    const navigate = useNavigate(); // تعريف دالة التنقل
    
    const initialState = {
        marque: '',
        modele: '',
        prixParJour: '',
        stock: 1,
        carburant: 'Diesel',
        description: ''
    };

    const [carData, setCarData] = useState(initialState);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        setCarData({ ...carData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('marque', carData.marque);
        formData.append('modele', carData.modele);
        formData.append('prixParJour', carData.prixParJour);
        formData.append('stock', carData.stock);
        formData.append('carburant', carData.carburant);
        formData.append('image', image); 
        formData.append('description', carData.description);

        try {
            const response = await axios.post('http://localhost:5000/api/cars/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            toast.success(response.data.message || "Voiture ajoutée avec succès !");

            // --- تفريغ جميع الحقول (حذف الحقول) بعد النجاح ---
            setCarData(initialState);
            setImage(null);
            setPreview(null);
            
            // إعادة تعيين حقل الملف يدوياً إذا لزم الأمر
            document.querySelector('input[type="file"]').value = "";

        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'ajout. Veuillez vérifier la console.");
        }
    };

    return (
        <div className="page-container" style={{maxWidth: '700px'}}>
            {/* زر الرجوع */}
            <button 
                onClick={() => navigate(-1)} 
                className="btn-retour"
                style={{ marginBottom: '20px', cursor: 'pointer' }}
            >
                ← Retour
            </button>

            <h1 className="page-title">Add New <span className="blue-text">Vehicle</span></h1>
            
            <form onSubmit={handleSubmit} className="admin-form-card">
                <div className="upload-section">
                    <label className="image-picker">
                        {preview ? (
                            <img src={preview} alt="Preview" className="img-preview" />
                        ) : (
                            <div className="upload-placeholder">
                                <span>+ Télécharger une photo de voiture</span>
                            </div>
                        )}
                        <input type="file" onChange={handleImageChange} accept="image/*" hidden required />
                    </label>
                </div>

                <div className="form-grid">
                    <div className="input-group">
                        <label>Nom de la marque</label>
                        <input name="marque" placeholder="e.g. Mercedes" value={carData.marque} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Version du modèle</label>
                        <input name="modele" placeholder="e.g. Classe G" value={carData.modele} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-grid">
                    <div className="input-group">
                        <label>Prix / Jour (DH)</label>
                        <input name="prixParJour" type="number" placeholder="400" value={carData.prixParJour} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Type de carburant</label>
                        <select name="carburant" value={carData.carburant} onChange={handleChange}>
                            <option value="Diesel">Diesel</option>
                            <option value="Gasoline">Gasoline</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Electric">Electric</option>
                        </select>
                    </div>
                </div>

                <div className="input-group">
                    <label>Stocks disponibles</label>
                    <input name="stock" type="number" value={carData.stock} onChange={handleChange} required />
                </div>
                
                <br />
                
                <div className="input-group">
                    <label>Description du véhicule</label>
                    <textarea 
                        name="description" 
                        rows="4" 
                        placeholder="Détails supplémentaires (ex: Climatisation, GPS, Bluetooth...)" 
                        value={carData.description} 
                        onChange={handleChange}
                        style={{padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db'}}
                    ></textarea>
                </div>

                <br />

                <div className="form-actions" style={{display: 'flex', gap: '10px'}}>
                    <button type="submit" className="btn-save-car" style={{flex: 2}}>
                        🚀 Sauvegarder la voiture
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCar;