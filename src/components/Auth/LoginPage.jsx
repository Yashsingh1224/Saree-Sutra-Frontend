import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const res = await login(form.email, form.password);
        setLoading(false);
        if (res?.token) {
            navigate("/"); // Redirect to home or dashboard
        } else {
            setError(res?.error || "Login failed. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-extrabold text-center text-gray-900">Welcome Back!</h2>
                <p className="text-center text-gray-600">Sign in to continue to your account.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                    {error && <p className="mt-4 text-xs text-center text-red-600">{error}</p>}
                    <p className="mt-4 text-sm text-center text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-medium text-amber-600 hover:text-amber-500">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
