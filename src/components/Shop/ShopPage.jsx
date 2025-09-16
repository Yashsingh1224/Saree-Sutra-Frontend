import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../Popups/ConfirmModal";

// --- SVG Icons for a cleaner UI ---
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l.218-.219.219-.219.209-.209L7.854 10H15a1 1 0 00.95-.684l2.667-5.333a1 1 0 00-.95-1.316H5.414L4.854 1H3z" />
        <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

const ViewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);


export default function ShopPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [productsByState, setProductsByState] = useState({});
    const [loading, setLoading] = useState(false);
    const [cartMsg, setCartMsg] = useState("");
    const [cartError, setCartError] = useState("");

    const [deleteMsg, setDeleteMsg] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const [showProductModal, setShowProductModal] = useState(false);
    const [modalProduct, setModalProduct] = useState(null);

    const SHOW_LIMIT = 8;
    const [displayCountByState, setDisplayCountByState] = useState({});

    useEffect(() => {
        async function fetchProductsWithCategoryState() {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products-with-category`);
                const data = await res.json();
                if (res.ok) {
                    const grouped = data.products.reduce((acc, product) => {
                        const state = product.state || "Unknown";
                        if (!acc[state]) acc[state] = [];
                        acc[state].push(product);
                        return acc;
                    }, {});
                    setProductsByState(grouped);

                    const initialCounts = {};
                    Object.keys(grouped).forEach(state => {
                        initialCounts[state] = Math.min(SHOW_LIMIT, grouped[state].length);
                    });
                    setDisplayCountByState(initialCounts);
                } else {
                    console.error("Failed to fetch products with category state:", data.error);
                }
            } catch (err) {
                console.error("Error fetching products with category state:", err);
            }
            setLoading(false);
        }
        fetchProductsWithCategoryState();
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
                headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
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

    const openProductModal = (product) => {
        setModalProduct(product);
        setShowProductModal(true);
    };

    const closeProductModal = () => {
        setShowProductModal(false);
        setModalProduct(null);
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
                setProductsByState(prev => {
                    const newState = { ...prev };
                    Object.keys(newState).forEach(state => {
                        newState[state] = newState[state].filter(p => p.id !== productToDelete);
                    });
                    return newState;
                });
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

    const handleViewMore = (state) => {
        const currentCount = displayCountByState[state] || 0;
        const totalProducts = productsByState[state]?.length || 0;
        const newCount = Math.min(currentCount + SHOW_LIMIT, totalProducts);
        setDisplayCountByState({ ...displayCountByState, [state]: newCount });
    };

    return (
        <div className="bg-gradient-to-br from-amber-50 via-white to-pink-50 min-h-screen font-['Poppins']">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-amber-800 font-['Yatra One']">
                        Shop by State
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover unique products from artisans across the nation.
                    </p>
                </div>

                {loading && <p className="text-center text-gray-500 text-xl">Loading products...</p>}

                {!loading && Object.keys(productsByState).length === 0 && (
                    <p className="text-center text-gray-500 text-xl">No products available at the moment.</p>
                )}

                {Object.entries(productsByState).map(([state, products]) => (
                    <section key={state} className="mb-20">
                        <div className="mb-8">
                            <h2 className="inline-block text-3xl sm:text-4xl font-bold text-amber-700 font-['Yatra One']">
                                {state}
                            </h2>
                            <div className="mt-2 h-1.5 w-24 bg-gradient-to-r from-pink-400 to-amber-400 rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                            {products.slice(0, displayCountByState[state]).map((product) => (
                                <div
                                    key={product.id}
                                    className="group relative bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100 overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2"
                                >
                                    <div className="overflow-hidden rounded-t-2xl">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-64 object-cover cursor-pointer transition-transform duration-500 ease-in-out group-hover:scale-105"
                                            onClick={() => openProductModal(product)}
                                        />
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-pink-800 mb-2 truncate">{product.name}</h3>
                                        <p className="text-amber-800 font-black mb-4 text-2xl">₹{product.price}</p>
                                        <div className="mt-auto grid grid-cols-2 gap-3">
                                            {!user?.is_admin ? (
                                                <button
                                                    className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors font-semibold select-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                                    onClick={() => handleAddToCart(product.id)}
                                                >
                                                    <CartIcon />
                                                    <span className="text-sm">Add to Cart</span>
                                                </button>
                                            ) : (
                                                <button
                                                    className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-semibold select-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                    onClick={() => { setProductToDelete(product.id); setShowConfirm(true); }}
                                                >
                                                    <DeleteIcon />
                                                    <span className="text-sm">Delete</span>
                                                </button>
                                            )}
                                            <button
                                                className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 border border-pink-600 text-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition-colors font-semibold select-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                                                onClick={() => openProductModal(product)}
                                            >
                                                <ViewIcon />
                                                <span className="text-sm">View Details</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {displayCountByState[state] < products.length && (
                            <div className="text-center mt-12">
                                <button
                                    onClick={() => handleViewMore(state)}
                                    className="inline-block bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700 transition-transform hover:scale-105 duration-300 font-semibold select-none shadow-md hover:shadow-lg"
                                >
                                    View More
                                </button>
                            </div>
                        )}
                    </section>
                ))}

                {showProductModal && modalProduct && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                        onClick={closeProductModal}
                    >
                        <div
                            className="bg-white rounded-3xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors text-2xl font-bold select-none z-10"
                                onClick={closeProductModal}
                                aria-label="Close"
                            >
                                &times;
                            </button>
                            <div className="flex flex-col md:flex-row gap-8">
                                <img
                                    src={modalProduct.image_url}
                                    alt={modalProduct.name}
                                    className="w-full md:w-1/2 object-cover rounded-2xl"
                                />
                                <div className="flex flex-col">
                                    <h3 className="text-4xl font-bold text-pink-800 mb-4">{modalProduct.name}</h3>
                                    <p className="text-amber-800 font-black text-3xl mb-6">₹{modalProduct.price}</p>
                                    <p className="text-gray-600 mb-8 whitespace-pre-line leading-relaxed flex-grow">
                                        {modalProduct.description || "No description available."}
                                    </p>
                                    <button
                                        className="w-full mt-auto px-8 py-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold select-none text-lg"
                                        onClick={() => { handleAddToCart(modalProduct.id); closeProductModal(); }}
                                        disabled={modalProduct.stock <= 0}
                                        title={modalProduct.stock <= 0 ? "Out of Stock" : "Add to your cart"}
                                    >
                                        {modalProduct.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showConfirm && (
                    <ConfirmModal
                        message="Are you sure you want to delete this product?"
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    />
                )}
            </div>
        </div>
    );
}