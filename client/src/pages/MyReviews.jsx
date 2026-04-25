import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyReviews.css';
import { FiTrash2, FiStar, FiCalendar } from 'react-icons/fi';

import toast from 'react-hot-toast'; 

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchMyReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/evaluations/user/${user.id}`);
            setReviews(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Erreur lors du chargement des avis");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMyReviews();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet avis ?")) {
            try {
                await axios.delete(`http://localhost:5000/api/evaluations/delete/${id}`);
                setReviews(reviews.filter(r => r.id !== id));
            } catch (err) {
                toast.error("Erreur lors de la suppression");
            }
        }
    };

    if (loading) return <div className="loader">Chargement de vos avis...</div>;

    return (
        <div className="my-reviews-container">
            <div className="reviews-header">
                <h1>Mes <span className="blue-text">Avis</span></h1>
                <p>Retrouvez et gérez tous les témoignages que vous avez laissés.</p>
            </div>

            {reviews.length === 0 ? (
                <div className="empty-reviews">
                    <FiStar size={50} color="#cbd5e1" />
                    <p>Vous n'avez pas encore laissé d'avis.</p>
                </div>
            ) : (
                <div className="reviews-grid">
                    {reviews.map((review) => (
                        <div key={review.id} className="review-card-premium">
                            <div className="review-car-info">
                                <img src={`http://localhost:5000${review.image_url}`} alt={review.marque} />
                                <div>
                                    <h3>{review.marque} {review.modele}</h3>
                                    <div className="date-box">
                                        <FiCalendar /> {new Date(review.dateCreation).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="review-content">
                                <div className="stars-display">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <FiStar 
                                            key={s} 
                                            fill={s <= review.etoiles ? "#f1c40f" : "none"} 
                                            color={s <= review.etoiles ? "#f1c40f" : "#cbd5e1"} 
                                        />
                                    ))}
                                    <span className="rating-val">{review.etoiles}.0</span>
                                </div>
                                <p className="review-status">Avis vérifié par Two Go</p>
                            </div>

                            <button className="delete-review-btn" onClick={() => handleDelete(review.id)}>
                                <FiTrash2 /> Supprimer l'avis
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReviews;