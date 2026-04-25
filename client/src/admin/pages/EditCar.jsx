import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditCar.css'; 

import toast from 'react-hot-toast'; 

const EditCar = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [carData, setCarData] = useState({
        marque: '',
        modele: '',
        prixParJour: '',
        stock: '',
        carburant: 'Diesel',
        description: ''
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/cars/${id}`);
                setCarData(res.data);
                setPreview(`http://localhost:5000${res.data.image_url}`);
            } catch (err) {
                console.error("Erreur loading car data");
            }
        };
        fetchCar();
    }, [id]);

    const handleChange = (e) => {
        setCarData({ ...carData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(carData).forEach(key => formData.append(key, carData[key]));
        if (image) formData.append('image', image);

        try {
            await axios.put(`http://localhost:5000/api/cars/update/${id}`, formData);
            toast.success("Véhicule mis à jour !");
            navigate('/admin/cars');
        } catch (err) {
            toast.error("Erreur lors de la modification");
        }
    };

    return (
        <div className="add-car-container">
            <div className="form-card">
                <h2>Modifier le <span className="blue-text">Véhicule</span></h2>
                <form onSubmit={handleSubmit} className="add-car-form">
                    <div className="form-group">
                        <label>Marque</label>
                        <input type="text" name="marque" value={carData.marque} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Modèle</label>
                        <input type="text" name="modele" value={carData.modele} onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Prix / Jour (DH)</label>
                            <input type="number" name="prixParJour" value={carData.prixParJour} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Stock</label>
                            <input type="number" name="stock" value={carData.stock} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Carburant</label>
                        <select name="carburant" value={carData.carburant} onChange={handleChange}>
                            <option value="Diesel">Diesel</option>
                            <option value="Essence">Essence</option>
                            <option value="Hybride">Hybride</option>
                            <option value="Électrique">Électrique</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={carData.description} onChange={handleChange} rows="4"></textarea>
                    </div>

                    <div className="form-group">
                        <label>Image du véhicule</label>
                        <input type="file" onChange={handleImageChange} accept="image/*" />
                        {preview && <img src={preview} alt="Preview" className="image-preview" />}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => navigate('/admin/cars')}>Annuler</button>
                        <button type="submit" className="btn-submit">Enregistrer les modifications</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCar;