import React, { useState } from "react";

export default function AddressForm({ onAdd, onCancel }) {
    const [form, setForm] = useState({
        recipient_name: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        phone: "",
        is_default: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({
            ...f,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/addresses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                onAdd(data.address);
            } else {
                setError(data.error || "Failed to add address.");
            }
        } catch {
            setError("Network error.");
        }
        setLoading(false);
    };

    return (
        <form
            className="bg-white rounded-xl shadow p-6 space-y-4"
            onSubmit={handleSubmit}
        >
            <h3 className="text-xl font-bold text-amber-700 mb-2">Add New Address</h3>
            <input
                name="recipient_name"
                placeholder="Recipient Name"
                className="w-full border px-3 py-2 rounded"
                value={form.recipient_name}
                onChange={handleChange}
                required
            />
            <input
                name="address_line1"
                placeholder="Address Line 1"
                className="w-full border px-3 py-2 rounded"
                value={form.address_line1}
                onChange={handleChange}
                required
            />
            <input
                name="address_line2"
                placeholder="Address Line 2"
                className="w-full border px-3 py-2 rounded"
                value={form.address_line2}
                onChange={handleChange}
            />
            <div className="flex gap-4">
                <input
                    name="city"
                    placeholder="City"
                    className="flex-1 border px-3 py-2 rounded"
                    value={form.city}
                    onChange={handleChange}
                    required
                />
                <input
                    name="state"
                    placeholder="State"
                    className="flex-1 border px-3 py-2 rounded"
                    value={form.state}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex gap-4">
                <input
                    name="postal_code"
                    placeholder="Postal Code"
                    className="flex-1 border px-3 py-2 rounded"
                    value={form.postal_code}
                    onChange={handleChange}
                    required
                />
                <input
                    name="country"
                    placeholder="Country"
                    className="flex-1 border px-3 py-2 rounded"
                    value={form.country}
                    onChange={handleChange}
                    required
                />
            </div>
            <input
                name="phone"
                placeholder="Phone Number"
                className="w-full border px-3 py-2 rounded"
                value={form.phone}
                onChange={handleChange}
                required
            />
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="is_default"
                    checked={form.is_default}
                    onChange={handleChange}
                />
                Set as default address
            </label>
            {error && <div className="text-red-600">{error}</div>}
            <div className="flex gap-4 mt-2">
                <button
                    type="submit"
                    className="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Address"}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
