import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/Popups/ConfirmModal";

const categories = [
    {
        name: "Banarasi",
        img:
            "https://www.meenabazaar.shop/cdn/shop/products/MBS1003TUSSAR-10.jpg?v=1650831039",
    },
    {
        name: "Kanjivaram",
        img:
            "https://assets.panashindia.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/2/3/2351sr07-407.jpg",
    },
    {
        name: "Chiffon",
        img:
            "https://www.karagiri.com/cdn/shop/products/banarasi-saree-mahogany-maroon-banarasi-saree-silk-saree-online-31828994162881.jpg?v=1648552948",
    },
    {
        name: "Silk",
        img:
            "https://media.samyakk.com/pub/media/tagalys/product_images/s/r/sr27355.jpg",
    },
];

export default function Home() {
    const [bestSellers, setBestSellers] = useState([]);
    const [cartMsg, setCartMsg] = useState("");
    const [cartError, setCartError] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();
    const [deleteMsg, setDeleteMsg] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Testimonials slider state
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const testimonialTimer = useRef(null);

    const colorClassMap = {
        "amber-700": "text-amber-700",
        "pink-700": "text-pink-700",
    };

    const testimonials = [
        {
            id: 1,
            text: "Absolutely loved the saree quality and fast delivery!",
            author: "Priya S.",
            color: "amber-700",
        },
        {
            id: 2,
            text: "The designs are so unique and elegant. Highly recommended.",
            author: "Anjali R.",
            color: "pink-700",
        },
        {
            id: 3,
            text: "Great service and beautiful packaging. Will shop again!",
            author: "Meena K.",
            color: "amber-700",
        },
    ];

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

    useEffect(() => {
        // Auto slide testimonials every 5 seconds
        testimonialTimer.current = setInterval(() => {
            setCurrentTestimonial((prev) =>
                prev === testimonials.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(testimonialTimer.current);
    }, []);

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
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({ product_id: productId, quantity: 1 }),
            });
            const data = await res.json();
            if (res.ok) {
                setCartMsg("Added to cart!");
                setTimeout(() => setCartMsg(""), 1500);
            } else {
                setCartError(data.error || "Could not add to cart.");
                setTimeout(() => setCartError(""), 2000);
            }
        } catch {
            setCartError("Network error.");
            setTimeout(() => setCartError(""), 2000);
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
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            if (res.ok) {
                setBestSellers((prev) => prev.filter((item) => item.id !== productToDelete));
                setDeleteMsg("Product deleted!");
                setTimeout(() => setDeleteMsg(""), 1500);
            } else {
                const data = await res.json();
                setDeleteError(data.error || "Could not delete product.");
                setTimeout(() => setDeleteError(""), 2000);
            }
        } catch {
            setDeleteError("Network error.");
            setTimeout(() => setDeleteError(""), 2000);
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
        <div className="bg-gradient-to-br from-amber-50 via-white to-pink-50 min-h-screen font-['Poppins']">
            {/* Hero Section */}
            <section className="pt-48 pb-24 px-6 md:px-20 flex flex-col md:flex-row items-center gap-12 bg-gradient-to-tr from-pink-100 via-white to-amber-50">
                <div className="flex-1 text-center md:text-left animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-amber-700 mb-6 leading-tight font-['Yatra One'] drop-shadow-lg relative">
                        Embrace Tradition.
                        <br />
                        Celebrate Modernity.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg font-medium">
                        Discover handpicked sarees that blend timeless elegance with contemporary style.
                    </p>
                    <a
                        href="/shop"
                        className="inline-block px-10 py-4 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-700 hover:scale-105 transition-transform duration-300 font-semibold text-lg select-none"
                    >
                        Shop Now
                    </a>
                </div>
                <div className="flex-1 flex justify-center relative z-0">
                    <img
                        src="https://www.sacredweaves.com/cdn/shop/articles/Main_Banner_1600x.jpg?v=1614664566"
                        alt="Beautiful Saree"
                        className="rounded-xl shadow-2xl w-full max-w-lg object-cover border-8 border-amber-200 animate-zoom-in"
                    />
                </div>
            </section>

            {/* Featured Categories */}
            <section className="pt-16 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-pink-700 mb-12 font-['Yatra One'] animate-fade-in-up">
                    Featured Categories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                    {categories.map((cat, idx) => (
                        <div
                            key={cat.name}
                            className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:-translate-y-2 animate-fade-in-up"
                            style={{ animationDelay: `${idx * 300}ms` }}
                        >
                            <img
                                src={cat.img}
                                alt={cat.name}
                                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-bold text-amber-700 mb-3">{cat.name}</h3>
                                <a
                                    href={`/categories/${cat.name.toLowerCase()}`}
                                    className="inline-block px-5 py-2 mt-3 bg-pink-200 text-pink-700 rounded-full font-semibold hover:bg-pink-300 transition"
                                >
                                    Explore
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Best Sellers */}
            <section className="pt-16 pb-24 px-6 md:px-20 max-w-7xl mx-auto bg-gradient-to-r from-amber-50 via-pink-50 to-white rounded-2xl">
                <h2 className="text-3xl font-bold text-center text-amber-700 mb-12 font-['Yatra One'] animate-fade-in-up">
                    Best Sellers
                </h2>
                {/* Messages */}
                <div className="max-w-2xl mx-auto text-center mb-6">
                    {cartMsg && (
                        <div className="text-green-700 font-semibold mb-3 animate-fade-in">{cartMsg}</div>
                    )}
                    {cartError && (
                        <div className="text-red-600 font-semibold mb-3 animate-fade-in">{cartError}</div>
                    )}
                    {deleteMsg && (
                        <div className="text-green-700 font-semibold mb-3 animate-fade-in">{deleteMsg}</div>
                    )}
                    {deleteError && (
                        <div className="text-red-600 font-semibold mb-3 animate-fade-in">{deleteError}</div>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mx-auto max-w-6xl">
                    {bestSellers.length === 0 ? (
                        <p className="col-span-full text-center text-gray-400 font-semibold text-lg">
                            No products found.
                        </p>
                    ) : (
                        bestSellers.map((item, idx) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                                style={{ animationDelay: `${idx * 240}ms` }}
                            >
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-semibold text-pink-700 mb-2">{item.name}</h3>
                                    <p className="text-amber-700 font-bold mb-4 text-lg">₹{item.price}</p>
                                    <div className="flex justify-center gap-4">
                                        {!user?.is_admin && (
                                            <button
                                                className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition font-semibold select-none"
                                                onClick={() => handleAddToCart(item.id)}
                                            >
                                                Add to Cart
                                            </button>
                                        )}
                                        {user?.is_admin && (
                                            <button
                                                className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-semibold select-none"
                                                onClick={() => {
                                                    setProductToDelete(item.id);
                                                    setShowConfirm(true);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 px-6 md:px-20 max-w-7xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-pink-700 mb-12 font-['Yatra One'] animate-fade-in-up">
                    Why Choose Us?
                </h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-14">
                    <div className="flex flex-col items-center text-center max-w-xs animate-fade-in-up">
                        <span className="text-5xl text-amber-600 mb-3">🧵</span>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Authentic Fabrics</h3>
                        <p className="text-gray-600 px-4">
                            We ensure the best quality and authentic fabric for all our sarees.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center max-w-xs animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <span className="text-5xl text-amber-600 mb-3">💳</span>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Secure Payments</h3>
                        <p className="text-gray-600 px-4">
                            Safe and multiple payment options to choose from.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center max-w-xs animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <span className="text-5xl text-amber-600 mb-3">🚚</span>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Fast Delivery</h3>
                        <p className="text-gray-600 px-4">
                            Quick and reliable delivery to your doorstep.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center max-w-xs animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <span className="text-5xl text-amber-600 mb-3">🔄</span>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Easy Returns</h3>
                        <p className="text-gray-600 px-4">
                            Hassle-free returns within stipulated time for your satisfaction.
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="relative max-w-4xl mx-auto overflow-hidden rounded-2xl bg-white p-10 shadow-lg">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        width: `${testimonials.length * 100}%`,
                        transform: `translateX(-${currentTestimonial * 100}%)`,
                    }}

                >
                    {testimonials.map(({ id, text, author, color }) => (
                        <blockquote
                            key={id}
                            className="w-full flex-shrink-0 px-6 md:px-12 text-center flex flex-col justify-center"
                        >
                            <p className="italic text-lg mb-6">"{text}"</p>
                            <footer className={`${colorClassMap[color] || "text-gray-800"} text-center font-semibold`}>
                                — {author}
                            </footer>
                        </blockquote>
                    ))}
                </div>
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            className={`w-3 h-3 rounded-full ${i === currentTestimonial ? "bg-amber-600" : "bg-gray-300"} transition`}
                            onClick={() => setCurrentTestimonial(i)}
                            aria-label={`Go to testimonial ${i + 1}`}
                        />

                    ))}
                </div>
            </section>


            {/* New Section: Latest Trends (Example Section) */}
            <section className="py-16 px-6 md:px-20 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center text-pink-700 font-['Yatra One'] animate-fade-in">
                    Latest Trends & Styles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {/* Example blog/style cards */}
                    {[
                        {
                            id: 1,
                            title: "The Timeless Elegance of Handwoven Banarasi",
                            img: "https://www.mystorybook.com/wp-content/uploads/2019/12/handwoven-banarasi-silk-saree-1024x768.jpg",
                        },
                        {
                            id: 2,
                            title: "How to Style Kanjivaram Sarees for Weddings",
                            img: "https://cdn.shopify.com/s/files/1/0142/1411/3038/articles/DSC_4399_1024x1024_crop_center.jpg?v=1659276324",
                        },
                        {
                            id: 3,
                            title: "Chiffon Saree Draping Styles You Must Try",
                            img: "https://assetscdn.paytm.com/images/catalog/product/F/FA/FASHAFAU-DESIG85C484AF26EFE67/1591247831566_0.jpg",
                        },
                    ].map(({ id, title, img }) => (
                        <article
                            key={id}
                            className="rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer group animate-fade-in-up"
                        >
                            <img
                                src={img}
                                alt={title}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <h3 className="p-4 text-lg font-semibold text-pink-700">{title}</h3>
                        </article>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-8 md:py-10 mt-16 shadow-inner text-center text-gray-600 text-sm select-none">
                <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto px-4 text-sm">
                    <div>&copy; {new Date().getFullYear()} SareeSutra. All rights reserved.</div>
                    <div className="flex gap-5 mt-3 md:mt-0">
                        <a
                            href="#"
                            className="hover:text-amber-700 transition font-medium"
                            aria-label="Instagram"
                        >
                            Instagram
                        </a>
                        <a
                            href="#"
                            className="hover:text-amber-700 transition font-medium"
                            aria-label="Facebook"
                        >
                            Facebook
                        </a>
                        <a
                            href="#"
                            className="hover:text-amber-700 transition font-medium"
                            aria-label="WhatsApp"
                        >
                            WhatsApp
                        </a>
                    </div>
                </div>
            </footer>

            {/* Confirm Delete Modal */}
            {showConfirm && (
                <ConfirmModal
                    message="Are you sure you want to delete this product?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
}
