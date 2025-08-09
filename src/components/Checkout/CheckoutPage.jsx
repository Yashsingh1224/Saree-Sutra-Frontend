import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AddressList from "./AddressList";
import AddressForm from "./AddressForm";

export default function CheckoutPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [paying, setPaying] = useState(false);

    // Fetch addresses
    useEffect(() => {
        async function fetchAddresses() {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/addresses`, {
                headers: { Authorization: "Bearer " + token },
            });
            const data = await res.json();
            if (res.ok) {
                setAddresses(data.addresses);
                // Auto-select default or first address
                if (data.addresses.length > 0) {
                    const defaultAddr = data.addresses.find(a => a.is_default);
                    setSelectedId(defaultAddr ? defaultAddr.id : data.addresses[0].id);
                }
            }
            setLoading(false);
        }
        fetchAddresses();
    }, []);

    // Fetch cart items for summary
    useEffect(() => {
        async function fetchCart() {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, {
                headers: { Authorization: "Bearer " + token },
            });
            const data = await res.json();
            if (res.ok) setCartItems(data.cartItems);
        }
        fetchCart();
    }, []);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Add new address handler
    const handleAddAddress = addr => {
        setAddresses(addrs => [addr, ...addrs]);
        setShowForm(false);
        setSelectedId(addr.id);
    };

    // Payment and order placement
    const handlePayment = async () => {
        if (!selectedId) {
            alert("Please select a delivery address.");
            return;
        }
        setPaying(true);
        try {
            const token = localStorage.getItem("token");
            // 1. Create Razorpay order on backend
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({ amount: subtotal }), // subtotal in INR
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || "Failed to initiate payment.");
                setPaying(false);
                return;
            }
            // 2. Open Razorpay checkout
            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "SareeSutra",
                description: "Order Payment",
                image: "https://static.vecteezy.com/system/resources/previews/052/945/491/non_2x/elegant-modern-saree-silhouette-logo-design-in-golden-gradient-for-fashion-branding-vector.jpg",
                order_id: data.orderId,
                handler: async function (response) {
                    // 3. After payment, place order with address_id
                    try {
                        const orderRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/place-order`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + token,
                            },
                            body: JSON.stringify({
                                address_id: selectedId,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });
                        const orderData = await orderRes.json();
                        if (orderRes.ok) {
                            alert("Order placed successfully!");
                            navigate("/orders");
                        } else {
                            alert(orderData.error || "Order placement failed.");
                        }
                    } catch (err) {
                        alert("Order placement failed. Please contact support.");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: {
                    color: "#f59e42",
                },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            alert("Network error. Please try again.");
        }
        setPaying(false);
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <p className="mb-4 text-lg text-amber-700 font-semibold">
                        Please log in to continue.
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
                Checkout
            </h2>
            {loading ? (
                <div className="text-center text-lg text-gray-600">Loading addresses...</div>
            ) : (
                <>
                    {!showForm ? (
                        <AddressList
                            addresses={addresses}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                            onAddNew={() => setShowForm(true)}
                        />
                    ) : (
                        <AddressForm
                            onAdd={handleAddAddress}
                            onCancel={() => setShowForm(false)}
                        />
                    )}
                </>
            )}

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow p-6 mt-8 max-w-xl mx-auto">
                <h4 className="text-xl font-bold text-pink-700 mb-4">Order Summary</h4>
                {cartItems.length === 0 ? (
                    <div className="text-gray-500">Your cart is empty.</div>
                ) : (
                    <ul className="mb-4">
                        {cartItems.map(item => (
                            <li key={item.id} className="flex justify-between mb-2">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <button
                    className="mt-8 w-full bg-amber-600 text-white py-3 rounded-full hover:bg-amber-700 transition text-lg font-semibold"
                    onClick={handlePayment}
                    disabled={paying || cartItems.length === 0}
                >
                    {paying ? "Processing..." : "Continue to Payment"}
                </button>
            </div>
        </div>
    );
}
