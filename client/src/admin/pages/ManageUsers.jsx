import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManageUsers.css'; 
import toast from 'react-hot-toast'; 

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // --- نظام Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5; // عدد المستخدمين في كل صفحة

    const currentUser = JSON.parse(localStorage.getItem('user')); 

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/users/all');
            setUsers(res.data);
        } catch (err) {
            console.error("Erreur lors du chargement", err);
            toast.error("Impossible de charger les utilisateurs");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            try {
                await axios.delete(`http://localhost:5000/api/auth/users/delete/${id}`);
                toast.success("Utilisateur supprimé");
                fetchUsers();
            } catch (err) {
                toast.error("Erreur lors de la suppression");
            }
        }
    };

    // فلترة البحث واستثناء الأدمن الحالي
    const filteredUsers = users.filter(user => {
        const isNotMe = user.id !== currentUser?.id;
        const matchesSearch = 
            user.nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.cin.toLowerCase().includes(searchTerm.toLowerCase());
        
        return isNotMe && matchesSearch;
    });

    // --- حسابات Pagination ---
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="admin-container">
            {/* زر الرجوع */}
            <button onClick={() => navigate(-1)} className="btn-retour-admin">
                ← Retour au Tableau de bord
            </button>

            <div className="admin-header">
                <h1 className="page-title">Gestion des <span className="blue-text">Utilisateurs</span></h1>
                
                <div className="header-actions">
                    <input 
                        type="text" 
                        placeholder="Rechercher par Nom, Email ou CIN..." 
                        className="search-input"
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // إعادة الترقيم للصفحة 1 عند البحث
                        }}
                    />
                </div>
            </div>

            <div className="table-responsive shadow-sm">
                <table className="cars-table">
                    <thead>
                        <tr>
                            <th>CIN</th>
                            <th>Nom Complet</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td data-label="CIN"><strong>{user.cin}</strong></td>
                                    <td data-label="Nom">{user.nomComplet}</td>
                                    <td data-label="Email">{user.email}</td>
                                    <td data-label="Tél">{user.phone}</td>
                                    <td data-label="Rôle">
                                        <span className={`status-badge ${user.role === 'admin' ? 'available' : 'badge-fuel'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td data-label="Actions" className="table-actions">
                                        <button 
                                            className="btn-edit" 
                                            onClick={() => navigate(`/admin/edit-user/${user.id}`)}
                                        >
                                            Modifier
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(user.id)} 
                                            className="btn-delete"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-results">Aucun utilisateur trouvé.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* أزرار الترقيم Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    {[...Array(totalPages)].map((_, index) => (
                        <button 
                            key={index + 1} 
                            onClick={() => paginate(index + 1)}
                            className={currentPage === index + 1 ? "active" : ""}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageUsers;