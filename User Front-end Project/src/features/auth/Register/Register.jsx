import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { showSuccess, showError } from "../../../utils/toast";
import { useAuth } from "../../../providers/AuthProvider";
import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import "react-toastify/dist/ReactToastify.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

const cx = classNames.bind(styles);

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await register({
        email: formData.email,
        password: formData.password,
      });

      showSuccess("Registration successful! Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);

      // Handle field-specific errors
      if (error.message.includes(":")) {
        const fieldErrors = {};
        error.message.split(", ").forEach((err) => {
          const [field, message] = err.split(": ");
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: error.message });
      }

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
          <h3>Register Here</h3>

          {errors.general && (
            <div
              className={cx("error-message")}
              style={{
                color: "red",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              {errors.general}
            </div>
          )}

          <label htmlFor="email" className={cx("label")}>
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            className={cx("input", { error: errors.email })}
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            className={cx("input", { error: errors.password })}
            value={formData.password}
            onChange={handleChange}
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

          <label htmlFor="confirmPassword" className={cx("label")}>
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            className={cx("input", { error: errors.confirmPassword })}
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.confirmPassword && (
            <span
              className={cx("field-error")}
              style={{ color: "red", fontSize: "12px" }}
            >
              {errors.confirmPassword}
            </span>
          )}

          <button type="submit" className={cx("btn-login")} disabled={loading}>
            {loading ? "Registering..." : "Register"}
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
