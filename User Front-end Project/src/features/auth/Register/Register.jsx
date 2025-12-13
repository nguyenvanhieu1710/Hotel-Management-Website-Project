import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

const cx = classNames.bind(styles);

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          email,
          password,
        }
      );
      if (response.status === 200) {
        console.log("Registration successful:", response.data);
        toast.success("Registration successful!", {
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response ? error.response.data : error.message
      );
      toast.error(`Registration failed. Please try again.`, {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("background")}>
          <div className={cx("shape")}></div>
          <div className={cx("shape")}></div>
        </div>
        <form className={cx("form")}>
          <h3>Register Here</h3>

          <label htmlFor="username" className={cx("label")}>
            Email
          </label>
          <input
            type="text"
            placeholder="Email"
            id="username"
            className={cx("input")}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password" className={cx("label")}>
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            id="password"
            className={cx("input")}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className={cx("btn-login")} onClick={handleSubmit}>
            Register
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
