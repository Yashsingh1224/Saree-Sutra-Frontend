import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const { user } = useAuth();
    if (!user) {
        // Not logged in
        return <Navigate to="/" replace />;
    }
    if (!user.is_admin) {
        // Logged in but not admin
        return <div className="text-center mt-10 text-red-600 font-bold">Access Denied</div>;
    }
    return children;
}
