import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedTestimonialsDemo from "../components/ui/AnimatedTestimonialsDemo";

// --- START: Placeholders for your existing components ---
// As before, please replace these with your actual imports.

const useAuth = () => ({ user: null }); // Mock hook. Replace with: import { useAuth } from "../hooks/useAuth";
const ConfirmModal = ({ message, onConfirm, onCancel }) => ( // Mock Component. Replace with: import ConfirmModal from "../components/Popups/ConfirmModal";
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 shadow-xl text-center">
            <p className="mb-4">{message}</p>
            <div className="flex justify-center gap-4">
                <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Confirm</button>
                <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            </div>
        </div>
    </div>
);


// --- END: Placeholders ---

// Custom hook for on-scroll animations
const useInView = (options) => {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(entry.target);
            }
        }, options);
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, [ref, options]);
    return [ref, isInView];
};

// --- Data and SVG Icons ---
const categories = [{ name: "Banarasi", img: "https://www.meenabazaar.shop/cdn/shop/products/MBS1003TUSSAR-10.jpg?v=1650831039" }, { name: "Kanjivaram", img: "https://assets.panashindia.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/2/3/2351sr07-407.jpg" }, { name: "Chiffon", img: "https://www.karagiri.com/cdn/shop/products/banarasi-saree-mahogany-maroon-banarasi-saree-silk-saree-online-31828994162881.jpg?v=1648552948" }, { name: "Silk", img: "https://media.samyakk.com/pub/media/tagalys/product_images/s/r/sr27355.jpg" }];
const designers = [{ name: "Radhika Sharma", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80", description: "Bringing traditional handloom with a modern twist to every saree." }, { name: "Anil Kumar", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80", description: "Expert in silk sarees with exclusive, limited edition collections." }, { name: "Meena Joshi", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80", description: "Crafting exquisite sarees with intricate embroidery work." }];
const HandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 2.18a14.98 14.98 0 00-5.84 7.38m5.84 2.58a6 6 0 01-5.84-7.38m5.84 7.38a6 6 0 015.84 7.38m-5.84-7.38L15.59 14.37" /></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4-4 6.293-6.293a1 1 0 011.414 0z" /></svg>;
const WashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const HangerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const IronIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const careTips = [{ icon: <WashIcon />, title: "Gentle Wash", desc: "Hand wash with mild detergents." }, { icon: <SunIcon />, title: "Avoid Sunlight", desc: "Dry in shade to preserve color." }, { icon: <HangerIcon />, title: "Proper Storage", desc: "Store in a cool, dry place." }, { icon: <IronIcon />, title: "Low Heat Iron", desc: "Iron on low heat or use a cloth." }];

export default function Home() {
    // --- State and Hooks ---
    const [bestSellers, setBestSellers] = useState([]);
    const [cartMsg, setCartMsg] = useState("");
    const [cartError, setCartError] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();
    const [deleteMsg, setDeleteMsg] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // --- Animation Refs ---
    const [heroRef, heroInView] = useInView({ threshold: 0.2 });
    const [categoriesRef, categoriesInView] = useInView({ threshold: 0.1 });
    const [bestsellersRef, bestsellersInView] = useInView({ threshold: 0.05 });
    const [whyChooseUsRef, whyChooseUsInView] = useInView({ threshold: 0.1 });
    const [designersRef, designersInView] = useInView({ threshold: 0.1 });
    const [careTipsRef, careTipsInView] = useInView({ threshold: 0.1 });

    // --- Restored Original Data Fetching ---
    useEffect(() => {
        async function fetchBestSellers() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
                const data = await response.json();
                if (response.ok) {
                    setBestSellers(data.products);
                } else {
                    console.error("Failed to fetch products:", data.error);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }
        fetchBestSellers();
    }, []);

    // --- Restored Original Functionalities ---
    const handleAddToCart = async (productId) => {
        setCartMsg("");
        setCartError("");
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
                body: JSON.stringify({ product_id: productId, quantity: 1 }),
            });
            const data = await res.json();
            if (res.ok) {
                setCartMsg("Added to cart!");
                setTimeout(() => setCartMsg(""), 2000);
            } else {
                setCartError(data.error || "Could not add to cart.");
                setTimeout(() => setCartError(""), 2500);
            }
        } catch {
            setCartError("Network error.");
            setTimeout(() => setCartError(""), 2500);
        }
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        setDeleteMsg("");
        setDeleteError("");
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productToDelete}`, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + token },
            });
            if (res.ok) {
                setBestSellers((prev) => prev.filter((item) => item.id !== productToDelete));
                setDeleteMsg("Product deleted!");
                setTimeout(() => setDeleteMsg(""), 2000);
            } else {
                const data = await res.json();
                setDeleteError(data.error || "Could not delete product.");
                setTimeout(() => setDeleteError(""), 2500);
            }
        } catch {
            setDeleteError("Network error.");
            setTimeout(() => setDeleteError(""), 2500);
        } finally {
            setShowConfirm(false);
            setProductToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setProductToDelete(null);
    };

    return (
        <div className="bg-gradient-to-br from-amber-50 via-white to-pink-50 min-h-screen font-['Poppins'] select-none">
            {/* --- Immersive Hero Section --- */}
            <section ref={heroRef} className="relative h-screen flex items-center justify-center text-center text-white px-4">
                <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://www.sacredweaves.com/cdn/shop/articles/Main_Banner_1600x.jpg?v=1614664566')" }}></div>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className={`relative transition-all duration-1000 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h1 className="text-5xl md:text-7xl font-extrabold font-['Yatra One'] tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        Draped in Dreams
                    </h1>
                    <p className={`mt-6 text-lg md:text-xl max-w-2xl mx-auto transition-opacity duration-1000 delay-300 ${heroInView ? 'opacity-100' : 'opacity-0'}`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        Discover handcrafted sarees that blend timeless elegance with contemporary style.
                    </p>
                    <a href="/shop" className={`mt-10 inline-block px-12 py-4 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-700 hover:scale-105 transition-all duration-500 delay-500 ${heroInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} font-semibold text-lg`}>
                        Shop The Collection
                    </a>
                </div>
            </section>

            {/* --- Interactive Category Cards --- */}
            <section ref={categoriesRef} className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
                <h2 className={`transition-all duration-1000 ${categoriesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} text-4xl font-bold text-center text-pink-700 mb-14 font-['Yatra One'] tracking-wide`}>Explore Our Weaves</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((cat, idx) => (
                        <div key={cat.name} className={`relative rounded-2xl shadow-lg overflow-hidden group cursor-pointer transition-all duration-1000 ${categoriesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${idx * 150}ms` }}>
                            <img src={cat.img} alt={cat.name} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center p-4">
                                <h3 className="text-2xl font-bold text-white text-center font-['Yatra One'] tracking-wider" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>{cat.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- Best Sellers --- */}
            <section ref={bestsellersRef} className="py-20 px-6 md:px-20 bg-white/50">
                <div className={`transition-all duration-1000 ${bestsellersInView ? 'opacity-100' : 'opacity-0'} max-w-7xl mx-auto`}>
                    <h2 className="text-4xl font-bold text-center text-amber-700 mb-4 font-['Yatra One'] tracking-wide">Our Best Sellers</h2>
                    <div className="max-w-3xl mx-auto text-center mb-10 min-h-[1.5rem]">
                        {cartMsg && <div className="text-green-700 font-semibold">{cartMsg}</div>}
                        {cartError && <div className="text-red-600 font-semibold">{cartError}</div>}
                        {deleteMsg && <div className="text-green-700 font-semibold">{deleteMsg}</div>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {bestSellers.slice(0, 6).map((item, idx) => (
                            <div key={item.id} className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-1000 hover:shadow-2xl hover:-translate-y-2 ${bestsellersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${idx * 150}ms` }}>
                                <img src={item.image_url} alt={item.name} className="w-full h-72 object-cover" />
                                <div className="p-6 text-center flex flex-col flex-grow">
                                    <h3 className="text-xl font-semibold text-pink-700 mb-2">{item.name}</h3>
                                    <p className="text-amber-700 font-bold mb-4 text-lg mt-auto">₹{item.price}</p>
                                    {!user?.is_admin && <button onClick={() => handleAddToCart(item.id)} className="w-full mt-2 px-7 py-2.5 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition font-semibold">Add to Cart</button>}
                                    {user?.is_admin && <button onClick={() => { setProductToDelete(item.id); setShowConfirm(true); }} className="w-full mt-2 px-7 py-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-semibold">Delete</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- "Why Choose Us?" Section --- */}
            <section ref={whyChooseUsRef} className={`transition-all duration-1000 ${whyChooseUsInView ? 'opacity-100' : 'opacity-0'} py-20 px-6 md:px-20`}>
                <div className="text-center max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-amber-800 font-['Yatra One'] tracking-wide">Why Choose Fabrix?</h2>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                        <div className="p-8">
                            <div className="flex justify-center mb-4"><HandIcon /></div>
                            <h3 className="text-2xl font-bold text-pink-800">Authentic Craftsmanship</h3>
                            <p className="mt-2 text-gray-600">Sourced directly from master artisans, ensuring genuine quality and supporting traditional art forms.</p>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-center mb-4"><HeartIcon /></div>
                            <h3 className="text-2xl font-bold text-pink-800">Ethical & Sustainable</h3>
                            <p className="mt-2 text-gray-600">Committed to fair trade practices that empower our weavers and respect our planet.</p>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-center mb-4"><SparklesIcon /></div>
                            <h3 className="text-2xl font-bold text-pink-800">Curated with Love</h3>
                            <p className="mt-2 text-gray-600">Each saree is handpicked, blending timeless designs with a touch of contemporary style.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Designers Section --- */}
            <section ref={designersRef} className="py-20 px-6 md:px-20 bg-white/50">
                <div className={`transition-all duration-1000 ${designersInView ? 'opacity-100' : 'opacity-0'} max-w-5xl mx-auto text-center`}>
                    <h2 className="text-4xl font-bold text-pink-700 mb-14 font-['Yatra One'] tracking-wide">Meet Our Curators</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {designers.map((designer, idx) => (
                            <div key={designer.name} className={`transition-all duration-1000 ${designersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${idx * 150}ms` }}>
                                <img src={designer.img} alt={designer.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-lg border-4 border-white" />
                                <h3 className="text-xl font-semibold text-amber-700">{designer.name}</h3>
                                <p className="text-gray-600 mt-2">{designer.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Saree Care Tips --- */}
            <section ref={careTipsRef} className="py-20 px-6 md:px-20">
                <div className={`transition-all duration-1000 ${careTipsInView ? 'opacity-100' : 'opacity-0'} max-w-7xl mx-auto`}>
                    <h2 className="text-4xl font-bold text-center text-amber-700 mb-14 font-['Yatra One'] tracking-wide">Cherish Your Saree</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto text-center text-amber-800">
                        {careTips.map((tip, idx) => (
                            <div key={tip.title} className={`bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-100 transition-all duration-1000 hover:shadow-2xl hover:-translate-y-2 ${careTipsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${idx * 150}ms` }}>
                                <div className="flex justify-center mb-4 text-pink-400">{tip.icon}</div>
                                <h3 className="text-xl font-bold text-pink-800">{tip.title}</h3>
                                <p className="mt-2 text-gray-600">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Your Actual Imported Components --- */}
            <AnimatedTestimonialsDemo />

            {/* --- Modals --- */}
            {showConfirm && <ConfirmModal message="Are you sure you want to delete this product?" onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />}
        </div>
    );
}