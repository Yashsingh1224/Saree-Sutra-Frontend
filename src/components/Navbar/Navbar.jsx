import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// Make sure this path is correct for your project structure
import { useAuth } from "../../hooks/useAuth";

// --- SVG Icons for a cleaner UI ---
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);


export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Body scroll lock when mobile menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // Cleanup function
        return () => document.body.style.overflow = 'unset';
    }, [menuOpen]);

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
        setMenuOpen(false);
        navigate("/login");
    };

    const closeAllMenus = () => {
        setMenuOpen(false);
        setDropdownOpen(false);
    }

    // Extracted NavLinks to keep the return statement cleaner
    const navLinks = (
        <>
            <li><NavLink to="/" onClick={closeAllMenus} className={({ isActive }) => `block px-4 py-2 rounded-lg transition ${isActive ? "text-amber-700 bg-amber-100 font-bold" : "hover:text-amber-700"}`}>Home</NavLink></li>
            <li><NavLink to="/shop" onClick={closeAllMenus} className={({ isActive }) => `block px-4 py-2 rounded-lg transition ${isActive ? "text-amber-700 bg-amber-100 font-bold" : "hover:text-amber-700"}`}>Shop</NavLink></li>
            {!user?.is_admin && <li><NavLink to="/about" onClick={closeAllMenus} className={({ isActive }) => `block px-4 py-2 rounded-lg transition ${isActive ? "text-amber-700 bg-amber-100 font-bold" : "hover:text-amber-700"}`}>About</NavLink></li>}
            {!user?.is_admin && <li><NavLink to="/contact" onClick={closeAllMenus} className={({ isActive }) => `block px-4 py-2 rounded-lg transition ${isActive ? "text-amber-700 bg-amber-100 font-bold" : "hover:text-amber-700"}`}>Contact</NavLink></li>}

            {/* Admin specific links */}
            {user?.is_admin && <li><NavLink to="/admin" onClick={closeAllMenus} className={({ isActive }) => `block px-4 py-2 rounded-lg transition ${isActive ? "text-amber-700 bg-amber-100 font-bold" : "hover:text-amber-700"}`}>Admin</NavLink></li>}
            {user?.is_admin && <li><NavLink to="/product-upload" onClick={closeAllMenus} className={({ isActive }) => `block px-4 py-2 rounded-lg transition ${isActive ? "text-amber-700 bg-amber-100 font-bold" : "hover:text-amber-700"}`}>Upload</NavLink></li>}
        </>
    );

    return (
        <header>
            <nav className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white/80 shadow-md fixed w-full z-50 backdrop-blur-md font-['Poppins']">
                {/* Logo and Brand */}
                <NavLink to="/" className="flex items-center gap-2" onClick={closeAllMenus}>
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/052/945/491/non_2x/elegant-modern-saree-silhouette-logo-design-in-golden-gradient-for-fashion-branding-vector.jpg"
                        alt="Logo"
                        className="h-10 w-10 rounded-full border-2 border-amber-600"
                    />
                    <span className="text-2xl font-bold text-amber-700 tracking-wider font-['Yatra One']">
                        Fabrix
                    </span>
                </NavLink>

                {/* Desktop Nav */}
                <ul className="hidden lg:flex items-center gap-6 text-base font-medium text-gray-700">
                    {navLinks}
                </ul>

                {/* User/Sign In & Cart Section */}
                <div className="flex items-center gap-4">
                    {!user?.is_admin && (
                        <NavLink to="/cart" className="p-2 rounded-full hover:bg-amber-100 text-gray-600 hover:text-amber-700 transition-colors" aria-label="Cart">
                            <CartIcon />
                        </NavLink>
                    )}

                    {/* User Profile / Login Button */}
                    <div className="hidden lg:flex">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full shadow-sm hover:bg-amber-200 transition font-medium text-amber-800"
                                    onClick={() => setDropdownOpen(open => !open)}
                                >
                                    <UserIcon />
                                    <span className="font-semibold">{user.name}</span>
                                    <svg className={`w-5 h-5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-amber-200 rounded-lg shadow-lg z-50 py-1">
                                        {!user.is_admin && (
                                            <NavLink to="/my-orders" onClick={() => setDropdownOpen(false)} className="block w-full text-left px-4 py-2 hover:bg-amber-100 text-gray-700 transition">
                                                My Orders
                                            </NavLink>
                                        )}
                                        <button className="w-full text-left px-4 py-2 hover:bg-amber-100 text-red-600 transition" onClick={handleLogout}>
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink to="/login" className="px-5 py-2 bg-amber-600 text-white rounded-full shadow hover:bg-amber-700 transition font-semibold">
                                Login
                            </NavLink>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="lg:hidden p-2 rounded-full hover:bg-amber-100 transition" onClick={() => setMenuOpen(open => !open)} aria-label="Toggle menu">
                        {menuOpen ? (
                            <svg className="h-7 w-7 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="h-7 w-7 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* --- New Mobile Menu Panel --- */}
            <div className={`lg:hidden fixed top-20 left-0 w-full h-[calc(100vh-5rem)] bg-white/95 backdrop-blur-md z-40 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8">
                    <ul className="flex flex-col gap-6 text-xl font-medium text-gray-700 text-center">
                        {navLinks}
                    </ul>
                    <div className="mt-8 pt-6 border-t border-amber-200">
                        {user ? (
                            <div className="space-y-4 text-center">
                                {!user.is_admin && (
                                    <NavLink to="/my-orders" onClick={closeAllMenus} className="block w-full px-4 py-3 bg-amber-100 text-amber-800 rounded-full font-semibold">
                                        My Orders
                                    </NavLink>
                                )}
                                <button className="w-full px-4 py-3 bg-red-500 text-white rounded-full font-semibold" onClick={handleLogout}>
                                    Sign Out
                                </button>
                                <p className="pt-2 text-gray-600">Logged in as <span className="font-bold">{user.name}</span></p>
                            </div>
                        ) : (
                            <NavLink to="/login" onClick={closeAllMenus} className="block w-full px-5 py-3 bg-amber-600 text-white rounded-full shadow hover:bg-amber-700 transition font-semibold text-center">
                                Login
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}