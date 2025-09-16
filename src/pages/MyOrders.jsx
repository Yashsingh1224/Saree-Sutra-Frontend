import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Placeholders & Hooks (no changes) ---
const useAuth = () => ({ user: { id: 1, name: "Test User" } });
const useInView = (options) => {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setIsInView(true); observer.unobserve(entry.target); }
        }, options);
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, [ref, options]);
    return [ref, isInView];
};

// --- Helper Components (no changes) ---
const StatusBadge = ({ status }) => {
    const baseStyle = "px-3 py-1 text-xs font-bold rounded-full text-white uppercase tracking-wider";
    let colorStyle = "";
    switch (status?.toLowerCase()) {
        case 'delivered': colorStyle = 'bg-green-500'; break;
        case 'shipped': colorStyle = 'bg-blue-500'; break;
        case 'pending': colorStyle = 'bg-yellow-500'; break;
        case 'cancelled': colorStyle = 'bg-red-500'; break;
        default: colorStyle = 'bg-gray-500';
    }
    return <span className={`${baseStyle} ${colorStyle}`}>{status}</span>;
};

export default function MyOrders() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // --- State Management ---
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // --- Date Filters ---
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filterMessage, setFilterMessage] = useState("Showing the 10 most recent orders.");

    // --- Animation Refs ---
    const [headerRef, headerInView] = useInView({ threshold: 0.1 });
    const [filterRef, filterInView] = useInView({ threshold: 0.1 });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/my-orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch orders. Please try again.');
                const data = await response.json();

                setAllOrders(data.orders);
                // Set filteredOrders & message only on first load (no filter applied)
                if (!startDate && !endDate) {
                    setFilteredOrders(data.orders.slice(0, 10));
                    setFilterMessage("Showing the 10 most recent orders.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
        // Only fetch on mount or user change - don't watch filter dates here
    }, [navigate]);

    // --- Filter logic remains the same ---
    const handleFilterApply = () => {
        if (!startDate || !endDate) {
            alert("Please select both a start and end date.");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const results = allOrders.filter(order => {
            const orderDate = new Date(order.order_date);
            return orderDate >= start && orderDate <= end;
        });

        setFilteredOrders(results);
        setFilterMessage(`Showing ${results.length} orders from ${formatDate(startDate)} to ${formatDate(endDate)}.`);
    };

    const handleFilterClear = () => {
        setStartDate('');
        setEndDate('');
        setFilteredOrders(allOrders.slice(0, 10));
        setFilterMessage("Showing the 10 most recent orders.");
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-500 text-lg">Loading your orders...</p>;
        if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;
        if (allOrders.length === 0) {
            return (
                <div className="text-center py-16">
                    <h3 className="text-2xl font-semibold text-gray-700">You haven't placed any orders yet.</h3>
                    <p className="mt-4 text-gray-500">Explore our collection and find a saree you'll love!</p>
                    <button onClick={() => navigate('/shop')} className="mt-8 inline-block bg-pink-600 text-white px-8 py-3 rounded-full text-lg hover:bg-pink-700 transition-transform hover:scale-105 duration-300 font-semibold">Shop Now</button>
                </div>
            );
        }
        return (
            <>
                <p className="text-center text-gray-600 mb-8 -mt-4">{filterMessage}</p>
                {filteredOrders.length > 0 ? (
                    <div className="space-y-6">
                        {filteredOrders.map((order, index) => (
                            <OrderCard key={order.id} order={order} isExpanded={expandedOrderId === order.id} onToggle={() => toggleOrderDetails(order.id)} formatDate={formatDate} index={index} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-10">No orders found in the selected date range.</p>
                )}
            </>
        );
    };

    return (
        <div className="bg-gradient-to-br from-amber-50 via-white to-pink-50 min-h-screen font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div ref={headerRef} className={`transition-all duration-1000 ${headerInView ? 'opacity-100' : 'opacity-0'} text-center mb-12`}>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide text-amber-800">My Orders</h1>
                    <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">Track your current orders and view your purchase history.</p>
                </div>

                {allOrders.length > 0 && (
                    <div ref={filterRef} className={`transition-all duration-1000 ${filterInView ? 'opacity-100' : 'opacity-0'} max-w-4xl mx-auto mb-12 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-amber-100`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                            <div className="md:col-span-1">
                                <label htmlFor="start-date" className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                                <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                            </div>
                            <div className="md:col-span-1">
                                <label htmlFor="end-date" className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                                <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                            </div>
                            <div className="flex gap-2 col-span-1 sm:col-span-2 md:col-span-2">
                                <button onClick={handleFilterApply} className="flex-1 w-full bg-amber-600 text-white px-4 py-2.5 rounded-full hover:bg-amber-700 transition font-semibold">Apply Filter</button>
                                <button onClick={handleFilterClear} className="flex-1 w-full bg-gray-200 text-gray-700 px-4 py-2.5 rounded-full hover:bg-gray-300 transition font-semibold">Clear</button>
                            </div>
                        </div>
                    </div>
                )}

                {renderContent()}
            </div>
        </div>
    );
}

const OrderCard = ({ order, isExpanded, onToggle, formatDate, index }) => {
    const [cardRef, cardInView] = useInView({ threshold: 0.1 });

    return (
        <div
            ref={cardRef}
            className={`transition-all duration-1000 ${cardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                } bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100 overflow-hidden`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            {/* Header row: proper structure and alignment */}
            <div
                className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-4 gap-x-6 cursor-pointer hover:bg-amber-50/50 transition-colors"
                onClick={onToggle}
            >
                {/* Order Info (stacked on mobile, row on desktop) */}
                <div className="flex flex-col sm:flex-row gap-x-12 gap-y-1 flex-grow">
                    <div>
                        <p className="text-xs text-gray-500">Order ID</p>
                        <p className="font-bold text-pink-800">#{order.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Order Date</p>
                        <p className="font-semibold text-gray-700">{formatDate(order.order_date)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-bold text-amber-700">₹{parseFloat(order.total_amount || 0).toFixed(2)}</p>
                    </div>
                </div>
                {/* Status badge & arrow */}
                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 justify-end">
                    <StatusBadge status={order.status} />
                    <button className="text-pink-600 hover:text-pink-800 transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="bg-white p-5 md:p-8 border-t border-amber-200">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-lg font-bold text-pink-800 mb-4">Items in this Order</h4>
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.product_id} className="flex items-center gap-4">
                                        <img src={item.image_url} alt={item.name} className="w-16 h-20 object-cover rounded-md shadow-sm" />
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            <p className="text-sm text-gray-500">Price: ₹{parseFloat(item.price || 0).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-pink-800 mb-4">Shipping Address</h4>
                            {order.address ? (
                                <div className="text-gray-700 leading-relaxed">
                                    <p>{order.address.street}</p>
                                    <p>
                                        {order.address.city}, {order.address.state} {order.address.zip_code}
                                    </p>
                                    <p>{order.address.country}</p>
                                </div>
                            ) : (
                                <p className="text-gray-500">No address information available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

