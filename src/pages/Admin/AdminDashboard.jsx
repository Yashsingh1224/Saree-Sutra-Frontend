import React, { useEffect, useState } from "react";
// import your chart components (from Recharts, Chart.js, etc.)
import PieChartComponent from '../../components/Charts/PieChart';
import BarChartComponent from '../../components/Charts/BarChartComponent';
import LineChartComponent from '../../components/Charts/LineChartComponent';


const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const [salesByDay, setSalesByDay] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [signups, setSignups] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/sales`, { headers: { Authorization: "Bearer " + localStorage.token } })
            .then(res => res.json()).then(setStats);

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/sales-by-category`, {
            headers: { Authorization: "Bearer " + localStorage.token }
        })
            .then(res => res.json())
            .then(data => {
                const categoriesNum = data.categories.map(d => ({
                    category: d.category,
                    sales: Number(d.sales) // 🔹 convert to number
                }));
                setCategoryData(categoriesNum);
            });

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/sales-per-day`, { headers: { Authorization: "Bearer " + localStorage.token } })
            .then(res => res.json()).then(data => setSalesByDay(data.salesByDay));

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/top-products`, { headers: { Authorization: "Bearer " + localStorage.token } })
            .then(res => res.json()).then(data => setTopProducts(data.topProducts));

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/user-signups`, {
            headers: { Authorization: "Bearer " + localStorage.token }
        })
            .then(res => res.json())
            .then(data => {
                const signupsNum = data.signups.map(d => ({
                    day: d.day,
                    signups: Number(d.signups)  // convert string to number
                }));
                setSignups(signupsNum);
            });
    }, []);

    return (
        <div className="bg-gradient-to-br from-amber-50 via-white to-pink-50 p-8 min-h-screen py-16 px-4 md:px-16 font-['Poppins'] pt-24">
            <h2 className="text-2xl font-bold mb-5">Admin Dashboard</h2>
            {/* Main KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white rounded shadow p-4">
                    <div className="text-gray-600">Total Sales</div>
                    <div className="text-xl font-bold">₹{stats?.totalSales ?? 0}</div>
                </div>
                <div className="bg-white rounded shadow p-4">
                    <div className="text-gray-600">Orders</div>
                    <div className="text-xl font-bold">{stats?.totalOrders ?? 0}</div>
                </div>
                <div className="bg-white rounded shadow p-4">
                    <div className="text-gray-600">Sales This Month</div>
                    <div className="text-xl font-bold">₹{stats?.monthSales ?? 0}</div>
                </div>
                <div className="bg-white rounded shadow p-4">
                    <div className="text-gray-600">Last Month</div>
                    <div className="text-xl font-bold">₹{stats?.lastMonthSales ?? 0}</div>
                </div>
            </div>

            {/* Sales by Category Pie */}
            <div className="mb-12">
                <h3 className="font-semibold mb-2">Sales by Category</h3>
                <PieChartComponent data={categoryData} className="mt-10" />
            </div>

            {/* Sales Trends Line Chart */}
            <div className="mb-12">
                <h3 className="font-semibold mb-2">Sales Trend (Daily)</h3>
                <LineChartComponent data={salesByDay} label="Sales per day" />
            </div>

            {/* Top Products Bar Chart */}
            <div className="mb-12">
                <h3 className="font-semibold mb-2">Top Selling Products</h3>
                <BarChartComponent data={topProducts} />
            </div>

            {/* User Signups Area Chart */}
            <div className="mb-12">
                <h3 className="font-semibold mb-2">User Signups Over Time</h3>
                <LineChartComponent data={signups} label="Signups per day" />
            </div>
        </div>
    );
};

export default AdminDashboard;
