import { createContext, useContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import { authService } from "../services/authService";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Try to get user from API first
          const userData = await authService.getCurrentUser();
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: userData, token },
          });
        } catch (error) {
          console.error("Auth init error:", error);
          // If API fails, try to get user from localStorage as fallback
          try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              const user = JSON.parse(storedUser);
              dispatch({
                type: "LOGIN_SUCCESS",
                payload: { user, token },
              });
            } else {
              throw new Error("No stored user data");
            }
          } catch (fallbackError) {
            console.error("Fallback auth error:", fallbackError);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            dispatch({ type: "LOGOUT" });
          }
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await authService.login(credentials);

      // Ensure user data is saved to localStorage
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("AuthProvider - User saved to localStorage");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("AuthProvider - Token saved to localStorage");
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: data.user, token: data.token },
      });
      return data;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await authService.register(userData);
      dispatch({ type: "SET_LOADING", payload: false });
      return data;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
