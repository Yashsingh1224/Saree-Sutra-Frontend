import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cartError, setCartError] = useState("");
    const [cartMsg, setCartMsg] = useState("");

    useEffect(() => {
        async function fetchCart() {
            setLoading(true);
            setError("");
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, {
                    headers: { Authorization: "Bearer " + token },
                });
                const data = await res.json();
                if (res.ok) setCartItems(data.cartItems);
                else setError(data.error || "Failed to load cart.");
            } catch {
                setError("Network error.");
            }
            setLoading(false);
        }
        if (user) fetchCart();
    }, [user]);



    const handleQuantity = async (itemId, delta) => {
        setCartError("");
        setCartMsg("");
        try {
            const token = localStorage.getItem("token");
            // Find current quantity:
            const currentItem = cartItems.find(item => item.id === itemId);
            if (!currentItem) return;

            const newQuantity = Math.max(1, currentItem.quantity + delta);

            // Call backend to update quantity
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/${itemId}`, {
                method: 'PUT',    // or PATCH depending on your API
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            const data = await res.json();

            if (res.ok) {
                // Update local state with new quantity from server or assumed value
                setCartItems(items =>
                    items.map(item =>
                        item.id === itemId ? { ...item, quantity: newQuantity } : item
                    )
                );
            } else {
                setCartError(data.error || 'Failed to update quantity');
            }
        } catch (error) {
            setCartError("Network error updating quantity");
        }
    };


    const handleRemove = async (itemId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/${itemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            if (res.ok) {
                // Remove from local state only if backend deletion succeeds
                setCartItems(items => items.filter(item => item.id !== itemId));
            } else {
                const data = await res.json();
                alert(data.error || "Failed to remove item from cart.");
            }
        } catch (error) {
            alert("Network error. Please try again.");
        }
    };


    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleCheckout = async () => {
        navigate("/checkout");
    };


    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <p className="mb-4 text-lg text-amber-700 font-semibold">
                        Please log in to view your cart.
                    </p>
                    <button
                        className="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50 py-16 px-4 md:px-16 font-['Poppins'] pt-24">
            <h2 className="text-3xl font-bold text-center text-amber-700 mb-10 font-['Yatra One']">
                Your Cart
            </h2>
            {loading ? (
                <div className="text-center text-lg text-gray-600">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-600">{error}</div>
            ) : cartItems.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">Your cart is empty.</div>
            ) : (
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="md:col-span-2 space-y-6">
                        {cartItems.map(item => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 bg-white rounded-xl shadow p-4"
                            >
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-lg border-2 border-amber-100"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-pink-700">{item.name}</h3>
                                    <p className="text-amber-700 font-bold">₹{item.price}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            className="px-2 py-1 bg-amber-200 rounded hover:bg-amber-300"
                                            onClick={() => handleQuantity(item.id, -1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <span className="px-3">{item.quantity}</span>
                                        <button
                                            className="px-2 py-1 bg-amber-200 rounded hover:bg-amber-300"
                                            onClick={() => handleQuantity(item.id, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    className="text-red-600 hover:text-red-800 px-3 py-1 rounded transition"
                                    onClick={() => handleRemove(item.id)}
                                    title="Remove"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Cart Summary */}
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
                        <div>
                            <h4 className="text-xl font-bold text-amber-700 mb-4">Summary</h4>
                            <div className="flex justify-between mb-2">
                                <span>Subtotal</span>
                                <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Shipping</span>
                                <span className="font-semibold text-green-700">Free</span>
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                        </div>
                        <button
                            className="mt-8 w-full bg-amber-600 text-white py-3 rounded-full hover:bg-amber-700 transition text-lg font-semibold"
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                        >
                            Proceed to Buy
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}
