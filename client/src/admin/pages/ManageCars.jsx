import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ManageCars.css';

import toast from 'react-hot-toast'; 

const ManageCars = () => {
    const [cars, setCars] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    
    // حالات البحث والتقسيم
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 5;

    const fetchCars = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/cars/all');
            setCars(res.data);
        } catch (err) {
            console.error("Erreur fetching cars", err);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?")) {
            try {
                await axios.delete(`http://localhost:5000/api/cars/delete/${id}`);
                fetchCars();
            } catch (err) {
                toast.error("Erreur lors de la suppression");
            }
        }
    };

    const toggleDescription = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // --- منطق البحث ---
    const filteredCars = cars.filter(car => 
        car.marque.toLowerCase().includes(searchTerm.toLowerCase()) || 
        car.modele.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- منطق التقسيم (Pagination) ---
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
    const totalPages = Math.ceil(filteredCars.length / carsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="page-title">Inventaire de la <span className="blue-text">flotte</span></h1>
                <div className="header-actions">
                    <input 
                        type="text" 
                        placeholder="Recherche par marque ou modèle..." 
                        className="search-input"
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Link to="/admin/add-car" className="btn-add-car-top">+ Ajouter un nouveau véhicule</Link>
                </div>
            </div>

            <div className="table-container shadow-sm">
                <table className="cars-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Véhicule</th>
                            <th>Description</th>
                            <th>Carburant</th>
                            <th>Prix/Day</th>
                            <th>Stock</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCars.length > 0 ? (
                            currentCars.map((car) => (
                                <tr key={car.id}>
                                    <td>
                                        <img src={`http://localhost:5000${car.image_url}`} alt="car" className="table-img" />
                                    </td>
                                    <td>
                                        <div className="car-name-cell">
                                            <strong>{car.marque}</strong>
                                            <span>{car.modele}</span>
                                        </div>
                                    </td>
                                    <td className="description-cell">
                                        <div className="desc-content">
                                            {expandedId === car.id 
                                                ? car.description 
                                                : `${car.description?.substring(0, 40)}`
                                            }
                                            {car.description?.length > 40 && (
                                                <button className="show-more-btn" onClick={() => toggleDescription(car.id)}>
                                                    {expandedId === car.id ? ' Show Less' : ' ...Show More'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td><span className="badge-fuel">{car.carburant}</span></td>
                                    <td><strong>{car.prixParJour} DH</strong></td>
                                    <td>
                                        {/* تلوين رقم المخزون إذا كان صفراً */}
                                        <span className={car.stock === 0 ? 'stock-out' : 'stock-in'}>
                                            {car.stock}
                                        </span>
                                    </td>
                                    <td>
                                        {/* المنطق الجديد للحالة بناءً على Stock */}
                                        <span className={`status-badge ${car.stock > 0 ? 'available' : 'unavailable'}`}>
                                            {car.stock > 0 ? 'Disponible' : 'Indisponible'}
                                        </span>
                                    </td>
                                    <td className="table-actions">
                                        <Link to={`/admin/edit-car/${car.id}`} className="btn-edit">Modifier</Link>
                                        <button onClick={() => handleDelete(car.id)} className="btn-delete">Supprimer</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="8" className="no-results">No cars found matching your search.</td></tr>
                        )}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="pagination">
                        
                        
                        {[...Array(totalPages)].map((_, index) => (
                            <button 
                                key={index + 1} 
                                onClick={() => paginate(index + 1)}
                                className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCars;