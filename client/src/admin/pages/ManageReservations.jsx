import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManageReservations.css';
import toast from 'react-hot-toast';

const ManageReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const navigate = useNavigate();

    // --- نظام Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // تحديث لـ 8 عناصر في الصفحة

    const fetchReservations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/reservations/all');
            setReservations(res.data);
        } catch (err) {
            console.error("Erreur lors du chargement:", err);
            toast.error("Erreur de connexion au serveur");
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/reservations/update-status/${id}`, {
                newStatut: status
            });
            toast.success("Statut mis à jour");
            fetchReservations(); 
        } catch (err) {
            toast.error("Erreur lors de la mise à jour");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous supprimer définitivement ce record ?")) {
            try {
                await axios.delete(`http://localhost:5000/api/reservations/delete/${id}`);
                toast.success("Réservation supprimée");
                fetchReservations();
            } catch (err) {
                toast.error("Erreur lors de la suppression");
            }
        }
    };

    // فلترة البيانات
    const filteredReservations = reservations.filter(res => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
            res.nomComplet.toLowerCase().includes(search) || 
            res.marque.toLowerCase().includes(search) ||
            res.cin.toLowerCase().includes(search) ||
            res.phone.includes(search);

        if (filterStatus === 'all') {
            return matchesSearch && res.statut !== 'terminee';
        }
        return matchesSearch && res.statut === filterStatus;
    });

    // --- حسابات الـ Pagination ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    return (
        <div className="admin-res-container">
            {/* زر الرجوع */}
            <button onClick={() => navigate(-1)} className="btn-back-admin">
                ← Retour
            </button>

            <div className="admin-res-header">
                <h2>Gestion des <span className="blue-text">Réservations</span></h2>
                <div className="controls">
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Nom, CIN, Voiture..." 
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // العودة للصفحة 1 عند البحث
                            }}
                            className="search-input"
                        />
                    </div>
                    <select 
                        value={filterStatus} 
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="filter-select"
                    >
                        <option value="all">En cours (Actifs)</option>
                        <option value="en_attente">En attente ⏳</option>
                        <option value="confirmee">Confirmées ✅</option>
                        <option value="terminee">Terminées (Archive) 📁</option>
                    </select>
                </div>
            </div>

            <div className="table-wrapper shadow-sm">
                <table className="res-table">
                    <thead>
                        <tr>
                            <th>Information Client</th>
                            <th>Véhicule</th>
                            <th>Période</th>
                            <th>Prix</th>
                            <th>État</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(res => (
                            <tr key={res.id} className={res.statut === 'terminee' ? 'row-archived' : ''}>
                                <td data-label="Client">
                                    <div className="client-info-card">
                                        <div className="client-avatar">{res.nomComplet.charAt(0)}</div>
                                        <div className="client-text">
                                            <span className="client-name">{res.nomComplet}</span>
                                            <span className="client-phone">📞 {res.phone}</span>
                                            <span className="client-cin-badge">ID: {res.cin}</span>
                                        </div>
                                    </div>
                                </td>
                                <td data-label="Véhicule">{res.marque} {res.modele}</td>
                                <td data-label="Période">
                                    <div className="small-date">
                                        {formatDate(res.dateDebut)} <br/> 
                                        {formatDate(res.dateFin)}
                                    </div>
                                </td>
                                <td data-label="Total" className="price-cell">{res.prixTotal} DH</td>
                                <td data-label="Statut">
                                    <span className={`status-pill ${res.statut}`}>
                                        {res.statut === 'en_attente' && 'En Attente'}
                                        {res.statut === 'confirmee' && 'Confirmée'}
                                        {res.statut === 'terminee' && 'Terminée'}
                                    </span>
                                </td>
                                <td data-label="Actions">
                                    <div className="action-btns">
                                        {res.statut === 'en_attente' && (
                                            <button onClick={() => handleUpdateStatus(res.id, 'confirmee')} className="btn-action btn-confirm" title="Confirmer">✔</button>
                                        )}
                                        {res.statut === 'confirmee' && (
                                            <button onClick={() => handleUpdateStatus(res.id, 'terminee')} className="btn-action btn-archive" title="Terminer & Archiver">📁</button>
                                        )}
                                        <button onClick={() => handleDelete(res.id)} className="btn-action btn-delete" title="Supprimer">🗑</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredReservations.length === 0 && <div className="no-data">Aucune donnée correspondante.</div>}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination-container">
                    <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>Précédent</button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                            {i + 1}
                        </button>
                    ))}
                    <button disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)}>Suivant</button>
                </div>
            )}
        </div>
    );
};

export default ManageReservations;