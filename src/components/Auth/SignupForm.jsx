import { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function SignupForm() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const { signup } = useAuth();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await signup(form.name, form.email, form.password);
        if (!res?.token) setError(res?.error || "Signup failed");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange} required />
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
            <button type="submit">Sign Up</button>
            {error && <div>{error}</div>}
        </form>
    );
}
