import { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function LoginForm() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await login(form.email, form.password);
        if (!res?.token) setError(res?.error || "Login failed");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
            <button type="submit">Log In</button>
            {error && <div>{error}</div>}
        </form>
    );
}
