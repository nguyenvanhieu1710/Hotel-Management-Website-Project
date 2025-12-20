import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";

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
    <div className="row mb-4">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">
              <FontAwesomeIcon icon={faFilter} className="me-2" />
              Filter Rooms
            </h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* Search */}
              <div className="col-md-3">
                <label className="form-label">Search</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search rooms..."
                    value={filters.search}
                    onChange={(e) =>
                      handleInputChange("search", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Status */}
              <div className="col-md-2">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
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
              <div className="col-md-2">
                <label className="form-label">Min Price</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleInputChange("minPrice", e.target.value)
                  }
                  min="0"
                />
              </div>

              {/* Max Price */}
              <div className="col-md-2">
                <label className="form-label">Max Price</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleInputChange("maxPrice", e.target.value)
                  }
                  min="0"
                />
              </div>

              {/* Room Type */}
              <div className="col-md-2">
                <label className="form-label">Room Type</label>
                <select
                  className="form-select"
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
              <div className="col-md-1">
                <label className="form-label">&nbsp;</label>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
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
