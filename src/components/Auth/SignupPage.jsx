import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function SignupPage() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const res = await signup(form.name, form.email, form.password);
        setLoading(false);
        if (res?.token) {
            navigate("/login"); // Redirect to login page
        } else {
            setError(res?.error || "Signup failed. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-extrabold text-center text-gray-900">Create an Account</h2>
                <p className="text-center text-gray-600">Join us and start your journey!</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-amber-500"
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-amber-500"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-amber-500"
                    />
                    <button
                        type="submit"
                        className="w-full py-3 mt-4 font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                    {error && <p className="mt-4 text-xs text-center text-red-600">{error}</p>}
                    <p className="mt-4 text-sm text-center text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-amber-600 hover:text-amber-500">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
