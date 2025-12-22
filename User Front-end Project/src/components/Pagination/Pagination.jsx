import { useMemo } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import paginationStyles from "./Pagination.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles, ...paginationStyles };
const cx = classNames.bind(mergedStyles);

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  showInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  size = "md", // sm, md, lg
  variant = "primary", // primary, secondary, dark
}) {
  // Calculate visible page numbers
  const visiblePages = useMemo(() => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  // Calculate display info
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Don't render if only one page
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const sizeClass = {
    sm: "pagination-sm",
    md: "",
    lg: "pagination-lg",
  }[size];

  const variantClass = {
    primary: "pagination-primary",
    secondary: "pagination-secondary",
    dark: "pagination-dark",
  }[variant];

  return (
    <div
      className={cx(
        "pagination-wrapper",
        "d-flex",
        "flex-column",
        "align-items-center",
        "mt-4"
      )}
    >
      {/* Pagination Info */}
      {showInfo && totalItems > 0 && (
        <div className={cx("pagination-info", "mb-3", "text-muted")}>
          <small>
            Showing {startItem} to {endItem} of {totalItems} results
          </small>
        </div>
      )}

      {/* Pagination Controls */}
      <nav aria-label="Pagination Navigation">
        <ul className={cx("pagination", "mb-0", sizeClass, variantClass)}>
          {/* First Page */}
          {showFirstLast && currentPage > 2 && (
            <li className={cx("page-item")}>
              <button
                className={cx("page-link", "pagination-btn")}
                onClick={() => handlePageChange(1)}
                aria-label="First page"
                title="First page"
              >
                <FontAwesomeIcon icon={faAnglesLeft} />
              </button>
            </li>
          )}

          {/* Previous Page */}
          <li className={cx("page-item", { disabled: currentPage === 1 })}>
            <button
              className={cx("page-link", "pagination-btn")}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              title="Previous page"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
              <span className="d-none d-sm-inline ms-1">Previous</span>
            </button>
          </li>

          {/* Page Numbers */}
          {visiblePages.map((page) => (
            <li
              key={page}
              className={cx("page-item", { active: page === currentPage })}
            >
              <button
                className={cx("page-link", "pagination-btn")}
                onClick={() => handlePageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            </li>
          ))}

          {/* Next Page */}
          <li
            className={cx("page-item", {
              disabled: currentPage === totalPages,
            })}
          >
            <button
              className={cx("page-link", "pagination-btn")}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              title="Next page"
            >
              <span className="d-none d-sm-inline me-1">Next</span>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </li>

          {/* Last Page */}
          {showFirstLast && currentPage < totalPages - 1 && (
            <li className={cx("page-item")}>
              <button
                className={cx("page-link", "pagination-btn")}
                onClick={() => handlePageChange(totalPages)}
                aria-label="Last page"
                title="Last page"
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Quick Jump (for large datasets) */}
      {totalPages > 10 && (
        <div
          className={cx(
            "pagination-jump",
            "mt-2",
            "d-flex",
            "align-items-center",
            "gap-2"
          )}
        >
          <small className="text-muted">Go to page:</small>
          <input
            type="number"
            min="1"
            max={totalPages}
            className={cx(
              "form-control",
              "form-control-sm",
              "pagination-input"
            )}
            style={{ width: "80px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  handlePageChange(page);
                  e.target.value = "";
                }
              }
            }}
            placeholder={currentPage}
          />
        </div>
      )}
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  showInfo: PropTypes.bool,
  showFirstLast: PropTypes.bool,
  maxVisiblePages: PropTypes.number,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  variant: PropTypes.oneOf(["primary", "secondary", "dark"]),
};
