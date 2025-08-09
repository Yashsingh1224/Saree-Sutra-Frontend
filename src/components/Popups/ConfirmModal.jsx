export default function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <>
            {/* Overlay with dim and blur */}
            <div
                className="fixed inset-0 flex items-center justify-center z-50"
                onClick={onCancel}
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.15)',   // very light black overlay (15%)
                    backdropFilter: 'blur(6px)',               // blur behind
                    WebkitBackdropFilter: 'blur(6px)',         // Safari support
                }}
            >
                {/* Modal box */}
                <div
                    className="bg-white rounded-lg shadow-lg max-w-sm p-6 text-center relative"
                    onClick={e => e.stopPropagation()} // don't close if clicking inside modal
                >
                    <p className="mb-6 text-lg font-semibold">{message}</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onConfirm}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded transition"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={onCancel}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-5 rounded transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
