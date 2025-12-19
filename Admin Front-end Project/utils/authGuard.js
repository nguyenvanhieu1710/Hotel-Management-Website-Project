import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * Authentication Guard Hook
 * Redirects to login if user is not authenticated
 */
export const useAuthGuard = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("admin");

      if (!token) {
        // Not authenticated, redirect to login
        router.push("/auth/login");
        setIsAuthenticated(false);
      } else {
        // Authenticated
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage changes (logout in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedOut", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedOut", handleStorageChange);
    };
  }, [router]);

  return { isAuthenticated, isLoading };
};

/**
 * Higher Order Component for protecting routes
 */
export const withAuthGuard = (WrappedComponent) => {
  return function AuthGuardedComponent(props) {
    const { isAuthenticated, isLoading } = useAuthGuard();

    // Show loading while checking authentication
    if (isLoading) {
      return (
        <div
          className="flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <i className="pi pi-spinner pi-spin" style={{ fontSize: "2rem" }}></i>
          <span className="ml-2">Loading...</span>
        </div>
      );
    }

    // Only render component if authenticated
    if (isAuthenticated) {
      return <WrappedComponent {...props} />;
    }

    // Return null while redirecting
    return null;
  };
};
