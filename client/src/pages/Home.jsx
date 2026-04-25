import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 
import StarRating from '../components/StarRating'; 

const Home = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 8;

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/cars/all');
                const carsData = res.data;

                const carsWithRatings = await Promise.all(carsData.map(async (car) => {
                    try {
                        const ratingRes = await axios.get(`http://localhost:5000/api/evaluations/average/${car.id}`);
                        return { ...car, rating: ratingRes.data.averageRating || 0 };
                    } catch {
                        return { ...car, rating: 0 };
                    }
                }));

                setCars(carsWithRatings);
                setFilteredCars(carsWithRatings);
            } catch (err) {
                console.error("Erreur lors du chargement des voitures");
            }
        };
        fetchCars();
    }, []);

    // نظام البحث والفلترة
    useEffect(() => {
        let results = cars.filter(car => 
            car.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.modele.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filterCategory !== "All") {
            results = results.filter(car => car.carburant === filterCategory);
        }

        setFilteredCars(results);
        setCurrentPage(1); // العودة للصفحة الأولى عند البحث
    }, [searchTerm, filterCategory, cars]);

    // حسابات الـ Pagination
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
    const totalPages = Math.ceil(filteredCars.length / carsPerPage);

    const handleBooking = (carId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate(`/book/${carId}`, { 
            state: { isAdminBooking: user.role === 'admin' } 
        });
    };

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Louez la voiture de vos <span className="blue-text">rêves</span></h1>
                <p>Une expérience de conduite premium avec notre sélection exclusive.</p>
            </div>

            {/* قسم البحث والفلترة */}
            <div className="filter-search-container">
                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="Rechercher une marque ou modèle..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <select onChange={(e) => setFilterCategory(e.target.value)}>
                        <option value="All">Tous les types</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Gasoline">Gasoline</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Électrique">Électrique</option>
                    </select>
                </div>
            </div>

            <div className="car-grid">
                {currentCars.length > 0 ? (
                    currentCars.map(car => {
                        const isOutOfStock = car.stock <= 0;
                        return (
                            <div key={car.id} className={`car-card ${isOutOfStock ? 'card-disabled' : ''}`}>
                                <div className="car-image">
                                    <img src={`http://localhost:5000${car.image_url}`} alt={car.marque} />
                                    {isOutOfStock && <div className="overlay-unavailable">Indisponible</div>}
                                </div>
                                
                                <div className="car-details">
                                    <div className="car-header">
                                        <h3>{car.marque} {car.modele}</h3>
                                        <div className="car-rating-wrapper">
                                            <StarRating 
                                                carId={car.id} 
                                                initialRating={car.rating} 
                                                userId={user?.id} 
                                                userRole={user?.role}
                                            />
                                            <div className="rating-display">
                                                <span className="rating-number">
                                                    {Number(car.rating).toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="car-info-tags">
                                        <span>{car.carburant}</span>
                                        <span className={!isOutOfStock ? "tag-available" : "tag-exhausted"}>
                                            {!isOutOfStock ? `Disponible` : 'Épuisé'}
                                        </span>
                                    </div>
                                    
                                    <div className="car-footer">
                                        <div className="price-tag">
                                            <span className="price">{car.prixPar_jour || car.prixParJour}</span>
                                            <span className="currency">DH / JOUR</span>
                                        </div>
                                        
                                        <div className="action-buttons">
                                            <button className="btn-details" onClick={() => navigate(`/car/${car.id}`)}>
                                                Détails
                                            </button>
                                            <button 
                                                className={isOutOfStock ? "btn-unavailable" : (!user ? "btn-login-to-reserve" : "btn-reserve")}
                                                onClick={() => !isOutOfStock && handleBooking(car.id)}
                                                disabled={isOutOfStock}
                                            >
                                                {isOutOfStock ? "Indisponible" : (!user ? "Connecter" : (user.role === 'admin' ? "Direct" : "Réserver"))}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-cars-found">
                        <p>Aucun résultat trouvé pour "{searchTerm}"</p>
                    </div>
                )}
            </div>

            {/* نظام التنقيم (Pagination) */}
            {totalPages > 1 && (
                <div className="pagination">
                    
                    {[...Array(totalPages)].map((_, index) => (
                        <button 
                            key={index} 
                            onClick={() => setCurrentPage(index + 1)}
                            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;