import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../Popups/ConfirmModal"

export default function AdminProductUpload() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category_id: "",
        image_url: "",
        stock: "",
    });

    const [categories, setCategories] = useState([]);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState(null); // This will hold a function to run when confirmed


    // For add category inputs and messages
    const [newCategoryName, setNewCategoryName] = useState("");
    const [catMsg, setCatMsg] = useState("");
    const [catError, setCatError] = useState("");
    const [catLoading, setCatLoading] = useState(false);
    const [newCategoryState, setNewCategoryState] = useState("");


    const [deleteMode, setDeleteMode] = useState(false);

    // Redirect non-admin users
    if (!user?.is_admin) {
        navigate("/");
        return null;
    }

    // Fetch categories on mount or when refreshed
    const fetchCategories = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
            const data = await res.json();
            if (res.ok) {
                setCategories(data.categories);
            } else {
                console.error("Failed to fetch categories:", data.error);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Product form handlers
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setConfirmMessage("Are you sure you want to add this product?");
        // Save the actual submit function in confirmAction without calling it now
        setConfirmAction(() => submitProduct);
        setShowConfirmModal(true);
    };

    const submitProduct = async () => {
        setShowConfirmModal(false);
        setMsg("");
        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    price: parseFloat(form.price),
                    category_id: parseInt(form.category_id),
                    image_url: form.image_url,
                    stock: parseInt(form.stock),
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setMsg("Product added successfully!");
                setForm({
                    name: "",
                    description: "",
                    price: "",
                    category_id: "",
                    image_url: "",
                    stock: "",
                });
            } else {
                setError(data.error || "Failed to add product.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };



    // Add new category handler
    const handleAddCategory = (e) => {
        e.preventDefault();
        setCatMsg("");
        setCatError("");

        if (!newCategoryName.trim()) {
            setCatError("Category name cannot be empty.");
            return;
        }
        if (!newCategoryState.trim()) {
            setCatError("State name cannot be empty.");
            return;
        }

        setConfirmMessage(
            `Are you sure you want to add the category "${newCategoryName.trim()}" for state "${newCategoryState.trim()}"?`
        );
        setConfirmAction(() => submitCategory);
        setShowConfirmModal(true);
    };


    const submitCategory = async () => {
        setShowConfirmModal(false);
        setCatMsg("");
        setCatError("");
        setCatLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    name: newCategoryName.trim(),
                    state: newCategoryState.trim()
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setCatMsg("Category added!");
                setNewCategoryName("");
                setNewCategoryState("");
                fetchCategories();
            } else {
                setCatError(data.error || "Failed to add category.");
            }
        } catch {
            setCatError("Network error. Please try again.");
        } finally {
            setCatLoading(false);
        }
    };


    // Delete category handler
    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        setCatMsg("");
        setCatError("");
        setCatLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setCatMsg("Category deleted!");
                fetchCategories();
            } else {
                setCatError(data.error || "Failed to delete category.");
            }
        } catch (err) {
            setCatError("Network error. Please try again.");
        }
        setCatLoading(false);
    };

    return (
        <div className="pt-20 px-4 md:px-0 max-w-4xl mx-auto">
            {/* Product Upload Form */}
            <div className="p-8 bg-white rounded-lg shadow-lg ring-1 ring-amber-200 mt-10 border-t-4 border-amber-600 relative">
                <h2 className="text-2xl font-bold mb-6 mt-5 text-amber-700">Admin: Add New Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="name"
                        placeholder="Product Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <input
                        name="image_url"
                        type="text"
                        placeholder="Image URL"
                        value={form.image_url}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                        name="stock"
                        type="number"
                        placeholder="Stock Quantity"
                        value={form.stock}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition"
                    >
                        {loading ? "Adding..." : "Add Product"}
                    </button>
                </form>
                {msg && <p className="mt-4 text-green-600">{msg}</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </div>

            {/* Categories Management */}
            <div className="p-8 bg-white rounded-lg shadow-lg ring-1 ring-amber-200 mt-10 border-t-4 border-amber-600 relative">
                <h2 className="text-2xl font-bold mb-6 mt-5 text-amber-700 flex justify-between items-center">
                    Manage Categories

                    {/* Delete Mode Toggle Button */}
                    <button
                        onClick={() => setDeleteMode(prev => !prev)}
                        className={`text-sm font-semibold px-4 py-1 rounded focus:outline-none transition ${deleteMode
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        title="Toggle Delete Mode"
                    >
                        {deleteMode ? "Exit Delete Mode" : "Delete Mode"}
                    </button>
                </h2>

                {/* Add category form */}
                <form onSubmit={handleAddCategory} className="flex gap-4 mb-6 flex-wrap">
                    <input
                        type="text"
                        placeholder="New Category Name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-grow min-w-[180px] border border-gray-300 rounded px-3 py-2"
                        disabled={catLoading}
                        required
                    />
                    <input
                        type="text"
                        placeholder="State"
                        value={newCategoryState}
                        onChange={(e) => setNewCategoryState(e.target.value)}
                        className="min-w-[150px] border border-gray-300 rounded px-3 py-2"
                        disabled={catLoading}
                        required
                    />
                    <button
                        type="submit"
                        disabled={catLoading}
                        className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
                    >
                        {catLoading ? "Adding..." : "Add"}
                    </button>
                </form>


                {/* Messages */}
                {catMsg && <p className="mb-4 text-green-600">{catMsg}</p>}
                {catError && <p className="mb-4 text-red-600">{catError}</p>}

                {/* Categories List with Delete buttons, shown conditionally */}
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {categories.length === 0 && (
                        <li className="text-gray-500">No categories found.</li>
                    )}
                    {categories.map((cat) => (
                        <li
                            key={cat.id}
                            className="flex justify-between items-center bg-amber-50 px-4 py-2 rounded shadow-sm"
                        >
                            <span>{cat.name}</span>
                            {deleteMode && (
                                <button
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    disabled={catLoading}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                                    title="Delete category"
                                >
                                    Delete
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            {showConfirmModal && (
                <ConfirmModal
                    message={confirmMessage}
                    onConfirm={() => {
                        if (confirmAction) confirmAction();
                    }}
                    onCancel={() => {
                        setShowConfirmModal(false);
                        setConfirmAction(null);
                    }}
                />
            )}

        </div>
    );
}
