import { useState, useEffect, useMemo, useCallback } from "react";
import classNames from "classnames/bind";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faSort,
  faCalendarAlt,
  faTimes,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useApi } from "../../hooks/useApi";
import { useDebounce } from "../../hooks/useDebounce";
import { roomService } from "../../services/roomService";
import { LoadingSpinner } from "../../components/Loading";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import searchStyles from "./Search.module.css";
import RoomList from "./components/RoomList";

const mergedStyles = { ...bootstrapStyles, ...styles, ...searchStyles };
const cx = classNames.bind(mergedStyles);

const roomStatuses = ["Available", "Occupied", "Maintenance"];
const amenitiesOptions = [
  "3 bed",
  "2 bath",
  "wifi",
  "pool",
  "gym",
  "parking",
  "elevator",
  "air conditioning",
  "balcony",
  "kitchen",
];

const priceRanges = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "$200 - $500", min: 200, max: 500 },
  { label: "$500+", min: 500, max: Infinity },
];

const sortOptions = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "newest", label: "Newest First" },
];

// Static function to prevent infinite loops
const getRoomTypesStatic = () => roomService.getRoomTypes();

export default function Search() {
  const [filters, setFilters] = useState({
    Price: "",
    RoomTypeId: [], // Changed to array for multiple selection
    MaximumNumberOfGuests: "",
    Status: "Available", // Default to Available
    RoomArea: "",
    Amenities: "",
    NumberOfFloor: "",
    Description: "",
    checkIn: null,
    checkOut: null,
    adults: 1,
    children: 0,
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);

  const location = useLocation();

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Use static function to prevent infinite loops
  const {
    data: roomTypes,
    loading: roomTypesLoading,
    error: roomTypesError,
  } = useApi(getRoomTypesStatic);

  // Memoize filters to prevent infinite loops - only update when actual values change
  const memoizedFilters = useMemo(() => {
    const cleanFilters = {
      ...filters,
      Amenities: selectedAmenities.join(","),
      Description: debouncedSearchQuery,
      sortBy: sortBy,
    };

    // Remove empty values
    Object.keys(cleanFilters).forEach((key) => {
      if (
        cleanFilters[key] === undefined ||
        cleanFilters[key] === null ||
        cleanFilters[key] === "" ||
        (Array.isArray(cleanFilters[key]) && cleanFilters[key].length === 0)
      ) {
        delete cleanFilters[key];
      }
    });

    return cleanFilters;
  }, [filters, selectedAmenities, debouncedSearchQuery, sortBy]);

  useEffect(() => {
    if (location.state) {
      const { checkIn, checkOut, adults, children } = location.state;
      setFilters((prevFilters) => ({
        ...prevFilters,
        checkIn: checkIn,
        checkOut: checkOut,
        adults: adults,
        children: children,
      }));
    }
  }, [location.state]);

  // Improved handler functions
  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleRoomTypeChange = useCallback((roomTypeId) => {
    setFilters((prev) => ({
      ...prev,
      RoomTypeId: prev.RoomTypeId.includes(roomTypeId)
        ? prev.RoomTypeId.filter((id) => id !== roomTypeId)
        : [...prev.RoomTypeId, roomTypeId],
    }));
  }, []);

  const handleAmenityChange = useCallback((amenity) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenity)) {
        return prev.filter((a) => a !== amenity);
      }
      return [...prev, amenity];
    });
  }, []);

  const handlePriceRangeChange = useCallback((range) => {
    setSelectedPriceRange((prev) => (prev === range ? null : range));
    setFilters((prev) => ({
      ...prev,
      Price: range.max === Infinity ? range.min : range.max,
    }));
  }, []);

  const handleStatusChange = useCallback((status) => {
    setFilters((prev) => ({
      ...prev,
      Status: prev.Status === status ? "" : status,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      Price: "",
      RoomTypeId: [],
      MaximumNumberOfGuests: "",
      Status: "Available",
      RoomArea: "",
      Amenities: "",
      NumberOfFloor: "",
      Description: "",
      checkIn: null,
      checkOut: null,
      adults: 1,
      children: 0,
    });
    setSelectedAmenities([]);
    setSelectedPriceRange(null);
    setSearchQuery("");
    setSortBy("newest");
    toast.success("Filters reset successfully!");
  }, []);

  // Advanced filter handlers
  const handleDateChange = useCallback((field, date) => {
    setFilters((prev) => ({
      ...prev,
      [field]: date ? date.format("YYYY-MM-DD") : null,
    }));
  }, []);

  const handleAdvancedFilterToggle = useCallback(() => {
    setShowAdvancedFilters((prev) => !prev);
  }, []);

  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy);
    toast.info(
      `Sorted by: ${sortOptions.find((opt) => opt.value === newSortBy)?.label}`
    );
  }, []);

  // Results count handler
  const handleResultsUpdate = useCallback((count) => {
    setResultsCount(count);
  }, []);

  if (roomTypesLoading) return <LoadingSpinner />;
  if (roomTypesError) {
    return (
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container")}>
          <div className={cx("alert", "alert-danger")} role="alert">
            <h4>Error loading room types</h4>
            <p>{roomTypesError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cx("container-xxl")}>
      <div className={cx("container")}>
        {/* Search Header */}
        <div className={cx("search-header", "mb-4")}>
          <div className={cx("row", "align-items-center", "mb-3")}>
            <div className={cx("col-md-6")}>
              <h2 className={cx("search-title", "mb-1")}>
                <FontAwesomeIcon
                  icon={faSearch}
                  className={cx("me-2", "text-warning")}
                />
                Search Rooms
              </h2>
              <p className={cx("search-subtitle", "text-muted", "mb-0")}>
                {resultsCount > 0
                  ? `${resultsCount} rooms found`
                  : "Find your perfect room"}
              </p>
            </div>
            <div className={cx("col-md-12", "text-md-end")}>
              <div
                className={cx(
                  "search-actions",
                  "d-flex",
                  "gap-2",
                  "justify-content-md-end"
                )}
              >
                <button
                  className={cx(
                    "btn",
                    "btn-outline-warning",
                    "btn-sm",
                    "search-action-btn"
                  )}
                  onClick={handleAdvancedFilterToggle}
                >
                  <FontAwesomeIcon icon={faSliders} className={cx("me-2")} />
                  {showAdvancedFilters ? "Hide" : "Show"} Advanced
                </button>
                <button
                  className={cx(
                    "btn",
                    "btn-outline-dark",
                    "btn-sm",
                    "search-action-btn"
                  )}
                  onClick={resetFilters}
                >
                  <FontAwesomeIcon icon={faTimes} className={cx("me-2")} />
                  Reset All
                </button>
              </div>
            </div>
          </div>

          {/* Search Controls */}
          <div className={cx("search-controls")}>
            <div className={cx("row", "g-3", "d-flex")}>
              <div className={cx("col-lg-10", "col-md-7")}>
                <div className={cx("search-input-wrapper")}>
                  <div className={cx("input-group", "search-input-group")}>
                    <span className={cx("input-group-text", "search-icon")}>
                      <FontAwesomeIcon icon={faSearch} />
                    </span>
                    <input
                      type="text"
                      className={cx("form-control", "search-input")}
                      placeholder="Search rooms by description, amenities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        className={cx(
                          "btn",
                          "btn-outline-secondary",
                          "clear-search"
                        )}
                        type="button"
                        onClick={() => setSearchQuery("")}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className={cx("col-lg-2", "col-md-12")}>
                <div className={cx("sort-wrapper")}>
                  <div className={cx("input-group", "sort-input-group")}>
                    <span className={cx("input-group-text", "sort-icon")}>
                      <FontAwesomeIcon icon={faSort} />
                    </span>
                    <select
                      className={cx("form-select", "sort-select")}
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className={cx("advanced-filters", "mt-3")}>
              <div
                className={cx(
                  "advanced-filters-content",
                  "p-4",
                  "bg-light",
                  "rounded"
                )}
              >
                <div
                  className={cx(
                    "row",
                    "g-3",
                    "d-flex",
                    "align-items-center",
                    "justify-content-center"
                  )}
                >
                  <div className={cx("col-lg-3", "col-md-6")}>
                    <label className={cx("form-label", "filter-label")}>
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className={cx("me-2", "text-warning")}
                      />
                      Check-in Date
                    </label>
                    <div className={cx("date-input-wrapper")}>
                      <Datetime
                        inputProps={{
                          className: cx("form-control", "date-input"),
                          placeholder: "Select check-in date",
                        }}
                        timeFormat={false}
                        value={filters.checkIn}
                        onChange={(date) => handleDateChange("checkIn", date)}
                        isValidDate={(current) =>
                          current.isAfter(new Date().setHours(0, 0, 0, 0) - 1)
                        }
                      />
                    </div>
                  </div>
                  <div className={cx("col-lg-3", "col-md-6")}>
                    <label className={cx("form-label", "filter-label")}>
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className={cx("me-2", "text-warning")}
                      />
                      Check-out Date
                    </label>
                    <div className={cx("date-input-wrapper")}>
                      <Datetime
                        inputProps={{
                          className: cx("form-control", "date-input"),
                          placeholder: "Select check-out date",
                        }}
                        timeFormat={false}
                        value={filters.checkOut}
                        onChange={(date) => handleDateChange("checkOut", date)}
                        isValidDate={(current) => {
                          const checkIn = filters.checkIn
                            ? new Date(filters.checkIn)
                            : new Date();
                          return current.isAfter(checkIn);
                        }}
                      />
                    </div>
                  </div>
                  <div className={cx("col-lg-3", "col-md-6")}>
                    <label className={cx("form-label", "filter-label")}>
                      Max Price ($)
                    </label>
                    <input
                      type="number"
                      className={cx("form-control", "price-input")}
                      placeholder="Enter max price"
                      value={filters.Price}
                      onChange={(e) =>
                        handleFilterChange("Price", e.target.value)
                      }
                      min="0"
                    />
                  </div>
                  <div className={cx("col-lg-3", "col-md-6")}>
                    <label className={cx("form-label", "filter-label")}>
                      Room Area (m²)
                    </label>
                    <input
                      type="number"
                      className={cx("form-control", "area-input")}
                      placeholder="Min area"
                      value={filters.RoomArea}
                      onChange={(e) =>
                        handleFilterChange("RoomArea", e.target.value)
                      }
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={cx("row", "g-4")}
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {/* Filters Sidebar */}
          <div
            className={cx("col-lg-3", "col-md-12", "mb-4")}
            style={{ flex: "0 0 25%", maxWidth: "25%" }}
          >
            <div className={cx("card", "h-100")}>
              <div className={cx("card-header")}>
                <h5 className={cx("mb-0")}>Filters</h5>
              </div>
              <div className={cx("card-body")}>
                {/* Price Range Filter */}
                <div className={cx("filter-group", "mb-4")}>
                  <h6 className={cx("filter-title")}>Price Range</h6>
                  {priceRanges.map((range) => (
                    <div key={range.label} className={cx("form-check")}>
                      <input
                        className={cx("form-check-input")}
                        type="radio"
                        name="priceRange"
                        id={`price-${range.label}`}
                        checked={selectedPriceRange === range}
                        onChange={() => handlePriceRangeChange(range)}
                      />
                      <label
                        className={cx("form-check-label")}
                        htmlFor={`price-${range.label}`}
                      >
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Room Type Filter */}
                <div className={cx("filter-group", "mb-4")}>
                  <h6 className={cx("filter-title")}>Room Type</h6>
                  {roomTypes?.map((type) => (
                    <div key={type.RoomTypeId} className={cx("form-check")}>
                      <input
                        className={cx("form-check-input")}
                        type="checkbox"
                        id={`roomtype-${type.RoomTypeId}`}
                        checked={filters.RoomTypeId.includes(type.RoomTypeId)}
                        onChange={() => handleRoomTypeChange(type.RoomTypeId)}
                      />
                      <label
                        className={cx("form-check-label")}
                        htmlFor={`roomtype-${type.RoomTypeId}`}
                      >
                        {type.RoomTypeName}
                      </label>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Amenities Filter */}
                <div className={cx("filter-group", "mb-4")}>
                  <h6 className={cx("filter-title")}>Amenities</h6>
                  <div className={cx("amenities-grid")}>
                    {amenitiesOptions.map((amenity) => (
                      <div key={amenity} className={cx("form-check")}>
                        <input
                          className={cx("form-check-input")}
                          type="checkbox"
                          id={`amenity-${amenity}`}
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                        />
                        <label
                          className={cx("form-check-label")}
                          htmlFor={`amenity-${amenity}`}
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <hr />

                {/* Room Status Filter */}
                <div className={cx("filter-group", "mb-4")}>
                  <h6 className={cx("filter-title")}>Room Status</h6>
                  {roomStatuses.map((status) => (
                    <div key={status} className={cx("form-check")}>
                      <input
                        className={cx("form-check-input")}
                        type="radio"
                        name="roomStatus"
                        id={`status-${status}`}
                        checked={filters.Status === status}
                        onChange={() => handleStatusChange(status)}
                      />
                      <label
                        className={cx("form-check-label")}
                        htmlFor={`status-${status}`}
                      >
                        {status}
                      </label>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Guest Count */}
                <div className={cx("filter-group", "mb-4")}>
                  <h6 className={cx("filter-title")}>Guests</h6>
                  <div className={cx("guest-controls")}>
                    <div className={cx("guest-item")}>
                      <span className={cx("guest-label")}>Adults</span>
                      <div className={cx("guest-counter")}>
                        <button
                          type="button"
                          className={cx("btn", "btn-sm", "btn-outline-warning")}
                          onClick={() =>
                            handleFilterChange(
                              "adults",
                              Math.max(1, filters.adults - 1)
                            )
                          }
                          disabled={filters.adults <= 1}
                        >
                          −
                        </button>
                        <span className={cx("guest-value")}>
                          {filters.adults}
                        </span>
                        <button
                          type="button"
                          className={cx("btn", "btn-sm", "btn-outline-warning")}
                          onClick={() =>
                            handleFilterChange(
                              "adults",
                              Math.min(6, filters.adults + 1)
                            )
                          }
                          disabled={filters.adults >= 6}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className={cx("guest-item")}>
                      <span className={cx("guest-label")}>Children</span>
                      <div className={cx("guest-counter")}>
                        <button
                          type="button"
                          className={cx("btn", "btn-sm", "btn-outline-warning")}
                          onClick={() =>
                            handleFilterChange(
                              "children",
                              Math.max(0, filters.children - 1)
                            )
                          }
                          disabled={filters.children <= 0}
                        >
                          −
                        </button>
                        <span className={cx("guest-value")}>
                          {filters.children}
                        </span>
                        <button
                          type="button"
                          className={cx("btn", "btn-sm", "btn-outline-warning")}
                          onClick={() =>
                            handleFilterChange(
                              "children",
                              Math.min(4, filters.children + 1)
                            )
                          }
                          disabled={filters.children >= 4}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div
            className={cx("col-lg-9", "col-md-12")}
            style={{ flex: "0 0 75%", maxWidth: "75%" }}
          >
            {/* View Toggle & Results Info */}
            <div className={cx("results-header", "mb-3")}>
              <div className={cx("results-info")}>
                <div className={cx("d-flex", "align-items-center", "gap-2")}>
                  <span className={cx("results-count")}>
                    {resultsCount > 0
                      ? `Found ${resultsCount} room${
                          resultsCount !== 1 ? "s" : ""
                        }`
                      : "No rooms found"}
                  </span>
                  {(searchQuery ||
                    selectedAmenities.length > 0 ||
                    selectedPriceRange) && (
                    <span
                      className={cx(
                        "badge",
                        "bg-warning",
                        "text-dark",
                        "filtered-badge"
                      )}
                    >
                      <FontAwesomeIcon icon={faFilter} className={cx("me-1")} />
                      Filtered
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Room Results */}
            <div className={cx("rooms-results")}>
              <RoomList
                filters={memoizedFilters}
                onResultsUpdate={handleResultsUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
