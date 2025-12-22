import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";

import bootstrapStyles from "../../../assets/css/bootstrap.module.css";
import styles from "../../../assets/css/style.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

const RoomFilters = ({ filters, onFilterChange, loading }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleReset = () => {
    onFilterChange({
      status: "Available",
      minPrice: "",
      maxPrice: "",
      roomTypeId: "",
      search: "",
    });
  };

  return (
    <div className={cx("row", "mb-4")}>
      <div className={cx("col-12")}>
        <div className={cx("card")}>
          <div className={cx("card-header")}>
            <h6 className={cx("mb-0")}>
              <FontAwesomeIcon icon={faFilter} className={cx("me-2")} />
              Filter Rooms
            </h6>
          </div>
          <div className={cx("card-body")}>
            <div className={cx("row", "g-3")}>
              {/* Search */}
              <div className={cx("col-md-3")}>
                <label className={cx("form-label")}>Search</label>
                <div className={cx("input-group")}>
                  <span className={cx("input-group-text")}>
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  <input
                    type="text"
                    className={cx("form-control")}
                    placeholder="Search rooms..."
                    value={filters.search}
                    onChange={(e) =>
                      handleInputChange("search", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Status */}
              <div className={cx("col-md-2")}>
                <label className={cx("form-label")}>Status</label>
                <select
                  className={cx("form-select")}
                  value={filters.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>

              {/* Min Price */}
              <div className={cx("col-md-2")}>
                <label className={cx("form-label")}>Min Price</label>
                <input
                  type="number"
                  className={cx("form-control")}
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleInputChange("minPrice", e.target.value)
                  }
                  min="0"
                />
              </div>

              {/* Max Price */}
              <div className={cx("col-md-2")}>
                <label className={cx("form-label")}>Max Price</label>
                <input
                  type="number"
                  className={cx("form-control")}
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleInputChange("maxPrice", e.target.value)
                  }
                  min="0"
                />
              </div>

              {/* Room Type */}
              <div className={cx("col-md-2")}>
                <label className={cx("form-label")}>Room Type</label>
                <select
                  className={cx("form-select")}
                  value={filters.roomTypeId}
                  onChange={(e) =>
                    handleInputChange("roomTypeId", e.target.value)
                  }
                >
                  <option value="">All Types</option>
                  <option value="1">Standard</option>
                  <option value="2">Deluxe</option>
                  <option value="3">Suite</option>
                  <option value="4">Presidential</option>
                </select>
              </div>

              {/* Actions */}
              <div className={cx("col-md-1")}>
                <label className={cx("form-label")}>&nbsp;</label>
                <div className={cx("d-flex", "gap-2")}>
                  <button
                    className={cx("btn", "btn-outline-secondary", "btn-sm")}
                    onClick={handleReset}
                    disabled={loading}
                    title="Reset filters"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

RoomFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    minPrice: PropTypes.string,
    maxPrice: PropTypes.string,
    roomTypeId: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default RoomFilters;
