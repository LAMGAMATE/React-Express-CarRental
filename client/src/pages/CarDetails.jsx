import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi'; // تأكد من تثبيت react-icons أو استخدم نص عادي

const CarDetails = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // نفضل جلب بيانات سيارة واحدة فقط من الباك إند إذا كان الرابط متاحاً
        // لكن سنستمر على منطقك الحالي لجلب الكل والبحث عن الإيدي
        axios.get(`http://localhost:5000/api/cars/all`).then(res => {
            const found = res.data.find(c => c.id === parseInt(id));
            setCar(found);
        });
    }, [id]);

    // دالة التعامل مع الحجز (نفس منطق Home.jsx)
    const handleBooking = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        // توجيه لصفحة الحجز مع تمرير حالة الأدمن
        navigate(`/book/${car.id}`, { 
            state: { isAdminBooking: user.role === 'admin' } 
        });
    };

    if (!car) return <div className="loader">Chargement...</div>;

    const isOutOfStock = car.stock <= 0;

    return (
        <div className="page-container" style={{ padding: '30px 50px' }}>
            
            {/* زر الرجوع */}
            <button 
                onClick={() => navigate('/')} 
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '20px',
                    padding: '0'
                }}
            >
                <FiArrowLeft size={24} /> Retour à l'accueil
            </button>

            <div style={{ display: 'flex', gap: '40px' }}>
                {/* قسم الصورة */}
                <div style={{ flex: 1, position: 'relative' }}>
                    <img 
                        src={`http://localhost:5000${car.image_url}`} 
                        alt={car.marque} 
                        style={{
                            width: '100%', 
                            borderRadius: '20px', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            filter: isOutOfStock ? 'grayscale(100%)' : 'none'
                        }} 
                    />
                    {isOutOfStock && (
                        <div style={{
                            position: 'absolute', top: '20px', right: '20px',
                            background: '#ef4444', color: 'white', padding: '5px 15px',
                            borderRadius: '10px', fontWeight: 'bold'
                        }}>
                            Épuisé
                        </div>
                    )}
                </div>

                {/* قسم التفاصيل */}
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                        {car.marque} <span className="blue-text">{car.modele}</span>
                    </h1>
                    
                    <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>
                        {car.carburant} • 
                        <span style={{ color: isOutOfStock ? '#ef4444' : '#10b981', marginLeft: '5px' }}>
                            {isOutOfStock ? "Indisponible" : `${car.stock} disponibles`}
                        </span>
                    </p>
                    
                    <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '10px' }}>Description</h3>
                        <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
                            {car.description || "Aucune description fournie pour ce véhicule."}
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
                            {car.prixParJour} DH <small style={{ fontSize: '1rem', color: '#9ca3af' }}> / jour</small>
                        </span>
                        
                        {/* الزر الذكي */}
                        <button 
                            className={isOutOfStock ? "btn-unavailable" : "btn-send"} 
                            style={{ width: '250px', padding: '15px' }}
                            onClick={handleBooking}
                            disabled={isOutOfStock}
                        >
                            {isOutOfStock ? "Indisponible" : 
                             !user ? "Se connecter pour réserver" : 
                             user.role === 'admin' ? "Réserver (Direct)" : "Réserver Maintenant"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;