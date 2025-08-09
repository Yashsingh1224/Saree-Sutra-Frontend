import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../Popups/ConfirmModal";


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

    // Modal related states
    const [showProductModal, setShowProductModal] = useState(false);
    const [modalProduct, setModalProduct] = useState(null);

    // Track how many products shown per state (for "View more")
    const SHOW_LIMIT = 6;
    const [displayCountByState, setDisplayCountByState] = useState({}); // { stateName: count }


    useEffect(() => {
        async function fetchProductsWithCategoryState() {
            setLoading(true);
            try {
                // Fetch all active products along with their category state
                // Assumes your backend provides an endpoint that returns products joined with their category info including 'state'
                // Example response format: [{id, name, description, price, category_id, image_url, stock, is_active, category: {state, name, id}}, ...]
                //
                // If you don't have this endpoint, you need to create a backend API like:
                // SELECT p.*, c.state FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_active = TRUE;

                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products-with-category`);
                const data = await res.json();
                if (res.ok) {
                    // Group products by their state field (top-level key)
                    const grouped = data.products.reduce((acc, product) => {
                        const state = product.state || "Unknown";  // Use product.state directly
                        if (!acc[state]) acc[state] = [];
                        acc[state].push(product);
                        return acc;
                    }, {});
                    setProductsByState(grouped);

                    // Initialize display counts with SHOW_LIMIT or fewer if less products
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

    // Add to Cart handler
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

    // Show modal with product details
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
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            if (res.ok) {
                // Remove deleted product from productsByState
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


    // Handle View More products for a state section
    const handleViewMore = (state) => {
        const currentCount = displayCountByState[state] || 0;
        const totalProducts = productsByState[state]?.length || 0;
        const newCount = Math.min(currentCount + SHOW_LIMIT, totalProducts);
        setDisplayCountByState({
            ...displayCountByState,
            [state]: newCount,
        });
    };

    return (
        <div className="bg-gradient-to-br from-amber-50 via-white to-pink-50 min-h-screen py-16 px-4 md:px-16 font-['Poppins'] pt-24">
            <h1 className="text-4xl font-extrabold text-amber-700 mb-12 text-center font-['Yatra One']">
                Shop by State
            </h1>

            {loading && <p className="text-center text-gray-500">Loading products...</p>}

            {!loading && Object.keys(productsByState).length === 0 && (
                <p className="text-center text-gray-500">No products available.</p>
            )}

            {Object.entries(productsByState).map(([state, products]) => (
                <section key={state} className="mb-16">
                    <h2 className="text-3xl font-bold mb-6 text-amber-700 border-b-2 border-amber-400 pb-2 font-['Yatra One']">
                        {state}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.slice(0, displayCountByState[state]).map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col"
                            >
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-56 object-cover cursor-pointer"
                                    onClick={() => openProductModal(product)}
                                />
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-lg font-semibold text-pink-700 mb-2">{product.name}</h3>
                                    <p className="text-amber-700 font-bold mb-4 text-lg">₹{product.price}</p>
                                    <div className="mt-auto flex gap-4">
                                        {!user?.is_admin && (
                                            <button
                                                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition font-semibold select-none"
                                                onClick={() => handleAddToCart(product.id)}
                                            >
                                                Add to Cart
                                            </button>
                                        )}
                                        {user?.is_admin && (
                                            <button
                                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-semibold select-none"
                                                onClick={() => {
                                                    setProductToDelete(product.id);
                                                    setShowConfirm(true);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                        <button
                                            className="flex-1 px-4 py-2 border border-pink-600 text-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition font-semibold select-none"
                                            onClick={() => openProductModal(product)}
                                        >
                                            View
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                    {/* View More Button */}
                    {displayCountByState[state] < products.length && (
                        <div className="text-center mt-6">
                            <button
                                onClick={() => handleViewMore(state)}
                                className="inline-block bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition font-semibold select-none"
                            >
                                View More
                            </button>
                        </div>
                    )}
                </section>
            ))}

            {/* Product Modal Popup */}
            {showProductModal && modalProduct && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-10"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.15)',   // very light black overlay (15%)
                        backdropFilter: 'blur(6px)',               // blur behind
                        WebkitBackdropFilter: 'blur(6px)',         // Safari support
                    }}
                    onClick={closeProductModal}
                >
                    <div
                        className="bg-white rounded-3xl shadow-xl max-w-4xl w-full max-h-full overflow-y-auto p-8 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-5 right-6 text-gray-700 hover:text-gray-900 text-3xl font-bold select-none"
                            onClick={closeProductModal}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <div className="flex flex-col md:flex-row gap-8">
                            <img
                                src={modalProduct.image_url}
                                alt={modalProduct.name}
                                className="w-full md:w-1/2 object-cover rounded-xl max-h-[500px]"
                            />
                            <div className="flex flex-col flex-grow">
                                <h3 className="text-3xl font-bold text-pink-700 mb-6">{modalProduct.name}</h3>
                                <p className="text-gray-700 mb-6 whitespace-pre-line">
                                    {modalProduct.description || "No description available."}
                                </p>
                                <p className="text-amber-700 font-bold text-2xl mb-8">₹{modalProduct.price}</p>
                                <button
                                    className="w-full md:w-auto px-8 py-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition font-semibold select-none"
                                    onClick={() => {
                                        handleAddToCart(modalProduct.id);
                                        closeProductModal();
                                    }}
                                    disabled={modalProduct.stock <= 0}
                                    title={modalProduct.stock <= 0 ? "Out of Stock" : ""}
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
    );
}
