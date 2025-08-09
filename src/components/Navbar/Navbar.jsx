import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate("/login");
    };

    const navLinks = (
        <>
            <li><NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-center transition ${isActive
                    ? "text-amber-700 bg-amber-100 font-semibold"
                    : "hover:bg-amber-100 hover:text-amber-700"
                }`
            }>Home</NavLink></li>

            {(
                <li><NavLink to="/shop" onClick={() => setMenuOpen(false)} className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg text-center transition ${isActive
                        ? "text-amber-700 bg-amber-100 font-semibold"
                        : "hover:bg-amber-100 hover:text-amber-700"
                    }`
                }>Shop</NavLink></li>)}

            {!user?.is_admin && (
                <li><NavLink to="/about" onClick={() => setMenuOpen(false)} className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg text-center transition ${isActive
                        ? "text-amber-700 bg-amber-100 font-semibold"
                        : "hover:bg-amber-100 hover:text-amber-700"
                    }`
                }>About</NavLink></li>)}

            {user?.is_admin && (
                <li><NavLink to="/admin" onClick={() => setMenuOpen(false)} className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg text-center transition ${isActive
                        ? "text-amber-700 bg-amber-100 font-semibold"
                        : "hover:bg-amber-100 hover:text-amber-700"
                    }`
                }>Admin</NavLink></li>)}

            {!user?.is_admin && (
                <li><NavLink to="/contact" onClick={() => setMenuOpen(false)} className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg text-center transition ${isActive
                        ? "text-amber-700 bg-amber-100 font-semibold"
                        : "hover:bg-amber-100 hover:text-amber-700"
                    }`
                }>Contact</NavLink></li>)}

            {!user?.is_admin && (
                <li><NavLink to="/cart" onClick={() => setMenuOpen(false)} className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg text-center transition ${isActive
                        ? "text-amber-700 bg-amber-100 font-semibold"
                        : "hover:bg-amber-100 hover:text-amber-700"
                    }`
                }>Cart</NavLink></li>)}
            {user?.is_admin && (
                <li><NavLink to="/product-upload" onClick={() => setMenuOpen(false)} className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg text-center transition ${isActive
                        ? "text-amber-700 bg-amber-100 font-semibold"
                        : "hover:bg-amber-100 hover:text-amber-700"
                    }`
                }>Product Upload</NavLink></li>)}
        </>
    );

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white/80 shadow-md fixed w-full z-10 backdrop-blur-md">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2">
                <img
                    src="https://static.vecteezy.com/system/resources/previews/052/945/491/non_2x/elegant-modern-saree-silhouette-logo-design-in-golden-gradient-for-fashion-branding-vector.jpg"
                    alt="Logo"
                    className="h-10 w-10 rounded-full border-2 border-amber-600"
                />
                <span className="text-2xl font-bold text-amber-700 tracking-wider font-['Yatra One']">
                    SareeSutra
                </span>
            </div>
            {/* Desktop Nav */}
            <ul className="hidden [@media(min-width:865px)]:flex gap-8 text-lg font-medium text-gray-700">
                {navLinks}
            </ul>
            {/* User/Sign In Section */}
            <div className="hidden [@media(min-width:865px)]:flex items-center">
                {user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full shadow hover:bg-amber-200 transition font-medium text-amber-800"
                            onClick={() => setDropdownOpen((open) => !open)}
                        >
                            <span className="font-semibold">{user.name}</span>
                            <svg className={`w-5 h-5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-amber-200 rounded-lg shadow-lg z-50">
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-amber-100 text-red-600 rounded-b-lg transition"
                                    onClick={handleLogout}
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <NavLink
                        to="/login"
                        className="px-5 py-2 bg-amber-600 text-white rounded-full shadow hover:bg-amber-700 transition font-medium"
                    >
                        Login
                    </NavLink>
                )}
            </div>
            {/* Mobile Menu Button */}
            <div className="hidden [@media(max-width:864px)]:block">
                <button
                    className="p-2 rounded hover:bg-amber-100 transition"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? (
                        <svg className="h-7 w-7 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-7 w-7 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                    )}
                </button>
            </div>
            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <>
                    <div className="fixed inset-0 bg-black/30 z-20" onClick={() => setMenuOpen(false)}></div>
                    <div className="fixed inset-0 top-20 z-30 flex flex-col items-center md:hidden">
                        <div className="w-11/12 max-w-sm mt-4 bg-white rounded-2xl shadow-2xl border-2 border-amber-100 p-6 animate-fade-in">
                            <ul className="flex flex-col gap-6 text-lg font-medium text-gray-700">
                                {navLinks}
                            </ul>
                            <div className="mt-6 flex justify-center">
                                {user ? (
                                    <div className="relative w-full" ref={dropdownRef}>
                                        <button
                                            className="flex items-center gap-2 w-full px-4 py-2 bg-amber-100 rounded-full shadow hover:bg-amber-200 transition font-medium text-amber-800 justify-center"
                                            onClick={() => setDropdownOpen((open) => !open)}
                                        >
                                            <span className="font-semibold">{user.name}</span>
                                            <svg className={`w-5 h-5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {dropdownOpen && (
                                            <div className="absolute left-0 mt-2 w-full bg-white border border-amber-200 rounded-lg shadow-lg z-50">
                                                <button
                                                    className="w-full text-left px-4 py-2 hover:bg-amber-100 text-red-600 rounded-b-lg transition"
                                                    onClick={handleLogout}
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <NavLink
                                        to="/login"
                                        className="px-5 py-2 bg-amber-600 text-white rounded-full shadow hover:bg-amber-700 transition font-medium w-full text-center"
                                    >
                                        Login
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}
