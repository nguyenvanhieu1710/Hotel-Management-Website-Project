import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";

const cx = classNames.bind({ ...bootstrapStyles, ...styles });

export default function Newsletter() {
  const [email, setEmail] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  // Use useLocalStorage hook for user data
  const [user] = useLocalStorage("user", null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter your email address.",
      });
      return;
    }

    const requestData = {
      name: user?.account?.AccountName || "Guest",
      email: email,
      message: "I would like to subscribe to the Newsletter.",
    };
    // console.log("Request Data:", requestData);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/account/send-email",
        requestData
      );
      if (response.data.success) {
        setSubscriptionStatus("success");
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
        });
        setEmail("");
      } else {
        setSubscriptionStatus("error");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to subscribe.",
        });
      }
    } catch (error) {
      setSubscriptionStatus("error");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to connect to the server.",
      });
      console.error("Error subscribing to newsletter:", error);
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div>
      {/* Newsletter Start */}
      <div
        className={cx("container", "newsletter", "mt-5", "wow", "fadeIn")}
        data-wow-delay="0.1s"
        data-aos="zoom-in-up"
      >
        <div className={cx("row", "justify-content-center")}>
          <div className={cx("col-lg-10", "border", "rounded", "p-1")}>
            <div className={cx("border", "rounded", "text-center", "p-1")}>
              <div className={cx("bg-white", "rounded", "text-center", "p-5")}>
                <h4 className={cx("mb-4")}>
                  Subscribe Our{" "}
                  <span className={cx("text-primary", "text-uppercase")}>
                    Newsletter
                  </span>
                </h4>
                <div
                  className={cx("position-relative", "mx-auto")}
                  style={{ maxWidth: "400px" }}
                >
                  <input
                    className={cx(
                      "form-control",
                      "w-100",
                      "py-3",
                      "ps-4",
                      "pe-5"
                    )}
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className={cx(
                      "btn",
                      "btn-primary",
                      "py-2",
                      "px-3",
                      "position-absolute",
                      "top-0",
                      "end-0",
                      "mt-2",
                      "me-2"
                    )}
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Newsletter End */}
    </div>
  );
}
