import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setShowDropdown(false);
        setIsMobileMenuOpen(false);
        navigate('/login');
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <div className="navbar-logo">
                    <Link to="/">Two Go <span className="logo-accent">Car Rental</span></Link>
                </div>

                {/* Hamburger Icon for Mobile */}
                <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
                    <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
                    <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
                    <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
                </div>

                {/* Navigation Links */}
                <div className={`navbar-wrapper ${isMobileMenuOpen ? "active" : ""}`}>
                    <div className="navbar-menu">
                        <Link to="/" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>Accueil</Link>
                        <Link to="/about" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>À propos de nous</Link>
                        <Link to="/contact" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>Contactez-nous</Link>
                    </div>

                    <div className="navbar-auth">
                        {user ? (
                            <div className="user-section">
                                <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
                                    <div className="user-avatar">
                                        {user.nom?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="welcome-msg">Hi, {user.nom}</span>
                                    <span className={`arrow ${showDropdown ? 'up' : ''}`}>▼</span>
                                </div>
                                
                                {showDropdown && (
                                    <div className="dropdown-menu">
                                        <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                            <i className="fas fa-user-circle"></i> Edit Profile
                                        </Link>

                                        {user.role === 'client' && (
                                            <>
                                                <Link to="/my-reservations" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                                    <i className="fas fa-history"></i> Booking History
                                                </Link>
                                                <Link to="/my-reviews" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                                    <i className="fas fa-star"></i> My Reviews
                                                </Link>
                                            </>
                                        )}

                                        {user.role === 'admin' && (
                                            <Link to="/admin/dashboard" className="dropdown-item admin-link" onClick={() => setShowDropdown(false)}>
                                                <i className="fas fa-tachometer-alt"></i> Dashboard
                                            </Link>
                                        )}

                                        <hr />
                                        <button onClick={handleLogout} className="dropdown-item logout-btn">
                                            <i className="fas fa-sign-out-alt"></i> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="nav-item login-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                                <Link to="/register" className="btn-register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;