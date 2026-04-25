import React, { useState, useEffect } from 'react';
import axios from 'axios';

import toast from 'react-hot-toast'; 

const StarRating = ({ carId, initialRating, userId, userRole }) => {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);

    // 1. إذا كان المستخدم Admin، لا نعرض النجوم نهائياً في هذا المكون
    if (userRole === 'admin') {
        return null; 
    }

    const handleRating = async (value) => {
        // 2. إذا كان زائراً (ليس لديه id)
        if (!userId) {
            toast.error("Veuillez vous connecter pour évaluer cette voiture.");
            return;
        }

        // 3. التقييم متاح فقط للـ Client
        if (userRole !== 'client') return;

        try {
            await axios.post('http://localhost:5000/api/evaluations/add', {
                utilisateur_id: userId,
                voiture_id: carId,
                etoiles: value
            });
            setRating(value);
        } catch (err) {
            console.error("Erreur evaluation", err);
        }
    };

    return (
        <div className="star-rating-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`star ${star <= (hover || rating) ? "star-filled" : "star-empty"}`}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => userRole === 'client' && setHover(star)}
                    onMouseLeave={() => userRole === 'client' && setHover(0)}
                    style={{ 
                        cursor: userId ? (userRole === 'client' ? 'pointer' : 'default') : 'pointer', 
                        fontSize: '22px',
                        color: star <= (hover || rating) ? "#f1c40f" : "#cbd5e1",
                        transition: '0.2s'
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRating;