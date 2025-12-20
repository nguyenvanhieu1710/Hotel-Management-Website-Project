import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";

const EventFilters = ({ filters, onFilterChange, loading }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleReset = () => {
    onFilterChange({
      status: "Active",
      eventTypeId: "",
      minPrice: "",
      maxPrice: "",
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
              Filter Events
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
                    placeholder="Search events..."
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Event Type */}
              <div className="col-md-2">
                <label className="form-label">Event Type</label>
                <select
                  className="form-select"
                  value={filters.eventTypeId}
                  onChange={(e) =>
                    handleInputChange("eventTypeId", e.target.value)
                  }
                >
                  <option value="">All Types</option>
                  <option value="1">Conference</option>
                  <option value="2">Workshop</option>
                  <option value="3">Party</option>
                  <option value="4">Meeting</option>
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

EventFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    eventTypeId: PropTypes.string,
    minPrice: PropTypes.string,
    maxPrice: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default EventFilters;
