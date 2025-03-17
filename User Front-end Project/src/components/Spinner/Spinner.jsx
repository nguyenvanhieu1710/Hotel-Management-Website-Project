import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import spinnerStyles from "./Spinner.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles, ...spinnerStyles };
const cx = classNames.bind(mergedStyles);

export default function Spinner() {
  const [showSpinner, setShowSpinner] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowSpinner(false);
      }, 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!showSpinner) return null;

  return (
    <div>
      {/* <!-- Spinner Start --> */}
      <div
        id="spinner"
        className={cx(
          "spinner-overlay",
          { "fade-out": fadeOut },
          "position-fixed",
          "top-0",
          "left-0",
          "w-100",
          "vh-100",
          "d-flex",
          "align-items-center",
          "justify-content-center"
        )}
      >
        <div
          className={cx("spinner-border", "text-primary", "shadow-lg")}
          style={{ width: "4rem", height: "4rem" }}
          role="status"
        >
          <span className={cx("sr-only")}>Loading...</span>
        </div>
      </div>
      {/* <!-- Spinner End --> */}
    </div>
  );
}
