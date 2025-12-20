import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { showSuccess, showError } from "../../../utils/toast";
import { useAuth } from "../../../providers/AuthProvider";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import "react-toastify/dist/ReactToastify.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

const cx = classNames.bind(styles);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get return URL from location state
  const from = location.state?.from?.pathname || "/";

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await login({ email, password });

      showSuccess("Login successful!");

      // Redirect to return URL or home
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ general: error.message });
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("background")}>
          <div className={cx("shape")}></div>
          <div className={cx("shape")}></div>
        </div>
        <form className={cx("form")} onSubmit={handleSubmit}>
          <h3>Login Here</h3>

          <label htmlFor="email" className={cx("label")}>
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            id="email"
            className={cx("input", { error: errors.email })}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          {errors.email && (
            <span
              className={cx("field-error")}
              style={{ color: "red", fontSize: "12px" }}
            >
              {errors.email}
            </span>
          )}

          <label htmlFor="password" className={cx("label")}>
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            id="password"
            className={cx("input", { error: errors.password })}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {errors.password && (
            <span
              className={cx("field-error")}
              style={{ color: "red", fontSize: "12px" }}
            >
              {errors.password}
            </span>
          )}

          <button type="submit" className={cx("btn-login")} disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>

          <div className={cx("social")}>
            <div className={cx("go")}>
              <FontAwesomeIcon icon={faGoogle} /> Google
            </div>
            <div className={cx("fb")}>
              <FontAwesomeIcon icon={faFacebook} /> Facebook
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
