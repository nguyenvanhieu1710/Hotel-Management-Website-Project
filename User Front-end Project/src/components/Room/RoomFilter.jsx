import { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import filterStyles from "./RoomFilter.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles, ...filterStyles };
const cx = classNames.bind(mergedStyles);

export default function RoomFilter({ onFilterChange, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    Price: "",
    RoomTypeId: "",
    MaximumNumberOfGuests: "",
    RoomArea: "",
    Amenities: "",
    NumberOfFloor: "",
    Description: "",
    ...initialFilters,
  });

  const [showFilters, setShowFilters] = useState(false);

  // Room types for dropdown
  const roomTypes = [
    { id: 1, name: "Standard Room" },
    { id: 2, name: "Deluxe Room" },
    { id: 3, name: "Suite" },
    { id: 4, name: "Presidential Suite" },
  ];

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Remove empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined
      )
    );

    onFilterChange(Object.keys(cleanFilters).length > 0 ? cleanFilters : null);
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters = {
      Price: "",
      RoomTypeId: "",
      MaximumNumberOfGuests: "",
      RoomArea: "",
      Amenities: "",
      NumberOfFloor: "",
      Description: "",
    };
    setFilters(emptyFilters);
    onFilterChange(null);
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== null && value !== undefined
  );

  return (
    <div className={cx("mb-4")}>
      {/* Filter Toggle Button */}
      <div
        className={cx(
          "d-flex",
          "justify-content-between",
          "align-items-center",
          "mb-3"
        )}
      >
        <button
          className={cx("btn", "btn-outline-primary")}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FontAwesomeIcon icon={faFilter} className={cx("me-2")} />
          {showFilters ? "Hide Filters" : "Show Filters"}
          {hasActiveFilters && (
            <span className={cx("badge", "bg-primary", "ms-2")}>
              {
                Object.values(filters).filter(
                  (v) => v !== "" && v !== null && v !== undefined
                ).length
              }
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            className={cx("btn", "btn-outline-secondary", "btn-sm")}
            onClick={clearFilters}
          >
            <FontAwesomeIcon icon={faTimes} className={cx("me-1")} />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className={cx("card", "shadow-sm")}>
          <div className={cx("card-body")}>
            <div className={cx("row", "g-3")}>
              {/* Price Filter */}
              <div className={cx("col-md-6", "col-lg-4")}>
                <label className={cx("form-label")}>Max Price per Night</label>
                <div className={cx("input-group")}>
                  <span className={cx("input-group-text")}>$</span>
                  <input
                    type="number"
                    className={cx("form-control")}
                    placeholder="Enter max price"
                    value={filters.Price}
                    onChange={(e) =>
                      handleFilterChange("Price", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Room Type Filter */}
              <div className={cx("col-md-6", "col-lg-4")}>
                <label className={cx("form-label")}>Room Type</label>
                <select
                  className={cx("form-select")}
                  value={filters.RoomTypeId}
                  onChange={(e) =>
                    handleFilterChange("RoomTypeId", e.target.value)
                  }
                >
                  <option value="">All Room Types</option>
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guests Filter */}
              <div className={cx("col-md-6", "col-lg-4")}>
                <label className={cx("form-label")}>Min Guests</label>
                <select
                  className={cx("form-select")}
                  value={filters.MaximumNumberOfGuests}
                  onChange={(e) =>
                    handleFilterChange("MaximumNumberOfGuests", e.target.value)
                  }
                >
                  <option value="">Any</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>

              {/* Room Area Filter */}
              <div className={cx("col-md-6", "col-lg-4")}>
                <label className={cx("form-label")}>Min Room Area (m²)</label>
                <input
                  type="number"
                  className={cx("form-control")}
                  placeholder="Enter min area"
                  value={filters.RoomArea}
                  onChange={(e) =>
                    handleFilterChange("RoomArea", e.target.value)
                  }
                />
              </div>

              {/* Floor Filter */}
              <div className={cx("col-md-6", "col-lg-4")}>
                <label className={cx("form-label")}>Floor</label>
                <select
                  className={cx("form-select")}
                  value={filters.NumberOfFloor}
                  onChange={(e) =>
                    handleFilterChange("NumberOfFloor", e.target.value)
                  }
                >
                  <option value="">Any Floor</option>
                  <option value="1">1st Floor</option>
                  <option value="2">2nd Floor</option>
                  <option value="3">3rd Floor</option>
                  <option value="4">4th Floor</option>
                  <option value="5">5th Floor</option>
                </select>
              </div>

              {/* Amenities Filter */}
              <div className={cx("col-md-6", "col-lg-4")}>
                <label className={cx("form-label")}>Amenities</label>
                <input
                  type="text"
                  className={cx("form-control")}
                  placeholder="e.g., WiFi, TV, AC"
                  value={filters.Amenities}
                  onChange={(e) =>
                    handleFilterChange("Amenities", e.target.value)
                  }
                />
              </div>

              {/* Description Search */}
              <div className={cx("col-12")}>
                <label className={cx("form-label")}>
                  Search in Description
                </label>
                <div className={cx("input-group")}>
                  <span className={cx("input-group-text")}>
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  <input
                    type="text"
                    className={cx("form-control")}
                    placeholder="Search room descriptions..."
                    value={filters.Description}
                    onChange={(e) =>
                      handleFilterChange("Description", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div
              className={cx(
                "d-flex",
                "justify-content-end",
                "mt-3",
                "pt-3",
                "border-top"
              )}
            >
              <button
                className={cx("btn", "btn-outline-secondary", "me-2")}
                onClick={clearFilters}
              >
                Clear All
              </button>
              <button
                className={cx("btn", "btn-primary")}
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !showFilters && (
        <div className={cx("d-flex", "flex-wrap", "gap-2", "mt-2")}>
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;

            let displayValue = value;
            if (key === "RoomTypeId") {
              const roomType = roomTypes.find(
                (type) => type.id === parseInt(value)
              );
              displayValue = roomType ? roomType.name : value;
            }

            return (
              <span
                key={key}
                className={cx(
                  "badge",
                  "bg-primary",
                  "d-flex",
                  "align-items-center"
                )}
              >
                {key === "Price" && "$"}
                {displayValue}
                <button
                  className={cx("btn-close", "btn-close-white", "ms-2")}
                  style={{ fontSize: "0.7em" }}
                  onClick={() => handleFilterChange(key, "")}
                  aria-label="Remove filter"
                />
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

RoomFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  initialFilters: PropTypes.object,
};
