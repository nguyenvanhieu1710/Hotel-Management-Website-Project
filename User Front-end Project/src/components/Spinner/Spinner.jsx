import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function Spinner() {
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
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
          "show",
          "bg-white",
          "position-fixed",
          "translate-middle",
          "w-100",
          "vh-100",
          "top-50",
          "start-50",
          "d-flex",
          "align-items-center",
          "justify-content-center"
        )}
      >
        <div
          className={cx("spinner-border", "text-primary")}
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className={cx("sr-only")}>Loading...</span>
        </div>
      </div>
      {/* <!-- Spinner End --> */}
    </div>
  );
}
