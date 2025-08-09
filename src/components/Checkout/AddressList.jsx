import React from "react";

export default function AddressList({ addresses, selectedId, onSelect, onAddNew }) {
    return (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-xl font-bold text-amber-700 mb-4">Select Delivery Address</h3>
            {addresses.length === 0 ? (
                <div className="text-gray-600 mb-4">No saved addresses. Please add one.</div>
            ) : (
                <div className="space-y-4">
                    {addresses.map(addr => (
                        <label
                            key={addr.id}
                            className={`block border rounded-lg p-4 cursor-pointer transition ${selectedId === addr.id
                                ? "border-amber-600 bg-amber-50"
                                : "border-gray-200 hover:border-amber-400"
                                }`}
                        >
                            <input
                                type="radio"
                                name="address"
                                checked={selectedId === addr.id}
                                onChange={() => onSelect(addr.id)}
                                className="mr-3"
                            />
                            <span className="font-semibold">{addr.recipient_name}</span>
                            <div className="text-gray-700 text-sm">
                                {addr.address_line1}
                                {addr.address_line2 && `, ${addr.address_line2}`}<br />
                                {addr.city}, {addr.state}, {addr.postal_code}, {addr.country}<br />
                                Phone: {addr.phone}
                            </div>
                            {addr.is_default && (
                                <span className="inline-block mt-2 px-2 py-1 bg-amber-200 text-xs text-amber-800 rounded">
                                    Default
                                </span>
                            )}
                        </label>
                    ))}
                </div>
            )}
            <button
                className="mt-6 bg-pink-100 text-pink-700 px-5 py-2 rounded-full font-medium hover:bg-pink-200 transition"
                onClick={onAddNew}
            >
                + Add New Address
            </button>
        </div>
    );
}
