import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../providers/AuthProvider";
import { LoadingPage } from "./Loading";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, error } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingPage message="Checking authentication..." />;
  }

  if (error) {
    console.error("Auth error in ProtectedRoute:", error);
    // If there's an auth error, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
