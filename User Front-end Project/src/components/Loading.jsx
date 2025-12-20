import "react";
import PropTypes from "prop-types";

export const LoadingSpinner = ({ size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "spinner-border-sm",
    medium: "",
    large: "spinner-border-lg",
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center ${className}`}
    >
      <div
        className={`spinner-border text-primary ${sizeClasses[size]}`}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export const LoadingButton = ({
  loading,
  children,
  disabled,
  className = "",
  ...props
}) => (
  <button
    {...props}
    disabled={loading || disabled}
    className={`btn ${loading ? "loading" : ""} ${className}`}
  >
    {loading ? (
      <>
        <LoadingSpinner size="small" />
        <span className="ms-2">Loading...</span>
      </>
    ) : (
      children
    )}
  </button>
);

export const LoadingPage = ({ message = "Loading..." }) => (
  <div
    className="d-flex flex-column justify-content-center align-items-center"
    style={{ minHeight: "50vh" }}
  >
    <LoadingSpinner size="large" />
    <p className="mt-3 text-muted">{message}</p>
  </div>
);

// PropTypes validation
LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.string,
};

LoadingButton.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

LoadingPage.propTypes = {
  message: PropTypes.string,
};

export default LoadingSpinner;
