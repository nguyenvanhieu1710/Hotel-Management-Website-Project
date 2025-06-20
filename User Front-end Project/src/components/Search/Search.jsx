import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaList, FaThLarge } from "react-icons/fa";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "./Search.module.css";
import Room from "../Room/Room";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

const roomStatuses = ["Available", "Occupied", "Maintenance"];
const amenitiesOptions = [
  "3 bed",
  "2 bath",
  "wifi",
  "no wifi",
  "pool",
  "gym",
  "no gym",
  "parking",
  "no parking",
  "elevator",
  "no elevator",
];

const priceRanges = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "$200+", min: 200, max: Infinity },
];

export default function Search() {
  const [filters, setFilters] = useState({
    Price: "",
    RoomTypeId: "",
    MaximumNumberOfGuests: "",
    Status: "",
    RoomArea: "",
    Amenities: "",
    NumberOfFloor: "",
    Description: "",
    checkIn: null,
    checkOut: null,
    adults: null,
    children: null,
  });

  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // Set default to list view

  const location = useLocation();

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

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenity)) {
        return prev.filter((a) => a !== amenity);
      }
      return [...prev, amenity];
    });
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(range);
    setFilters((prev) => ({
      ...prev,
      Price: range.max === Infinity ? range.min : range.max,
    }));
  };

  const fetchRoomTypes = () => {
    axios
      .get("http://localhost:3000/api/room-type/get-all")
      .then((response) => {
        setRoomTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching room types:", error);
      });
  };

  return (
    <div className={cx("container-xxl")}>
      <div className={cx("container")}>
        <div className={cx("searchContainer")}>
          <div className={cx("filtersSidebar")}>
            <div className={cx("filterGroup")}>
              <div className={cx("filterGroupTitle")}>Price Range</div>
              <div className={cx("checkboxGroup")}>
                {priceRanges.map((range) => (
                  <label key={range.label} className={cx("checkboxLabel")}>
                    <input
                      type="checkbox"
                      checked={selectedPriceRange === range}
                      onChange={() => handlePriceRangeChange(range)}
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>

            <div className={cx("divider")} />

            <div className={cx("filterGroup")}>
              <div className={cx("filterGroupTitle")}>Room Type</div>
              <div className={cx("checkboxGroup")}>
                {roomTypes.map((type) => (
                  <label key={type.RoomTypeId} className={cx("checkboxLabel")}>
                    <input
                      type="checkbox"
                      name="RoomTypeId"
                      checked={filters.RoomTypeId === type.RoomTypeId}
                      onChange={() =>
                        handleFilterChange({
                          target: {
                            name: "RoomTypeId",
                            value: type.RoomTypeId,
                            type: "checkbox",
                            checked: filters.RoomTypeId !== type.RoomTypeId,
                          },
                        })
                      }
                    />
                    {type.RoomTypeName}
                  </label>
                ))}
              </div>
            </div>

            <div className={cx("divider")} />

            <div className={cx("filterGroup")}>
              <div className={cx("filterGroupTitle")}>Amenities</div>
              <div className={cx("checkboxGroup")}>
                {amenitiesOptions.map((amenity) => (
                  <label key={amenity} className={cx("checkboxLabel")}>
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <div className={cx("divider")} />

            <div className={cx("filterGroup")}>
              <div className={cx("filterGroupTitle")}>Room Status</div>
              <div className={cx("checkboxGroup")}>
                {roomStatuses.map((status) => (
                  <label key={status} className={cx("checkboxLabel")}>
                    <input
                      type="checkbox"
                      name="Status"
                      checked={filters.Status === status}
                      onChange={() =>
                        handleFilterChange({
                          target: {
                            name: "Status",
                            value: status,
                            type: "checkbox",
                            checked: filters.Status !== status,
                          },
                        })
                      }
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className={cx("roomsContainer")}>
            <div className={cx("viewToggle")}>
              <button
                className={cx("viewToggleButton", {
                  active: viewMode === "grid",
                })}
                onClick={() => setViewMode("list")} // Always set to list view
                disabled={true} // Disable grid view button
              >
                <FaThLarge /> Grid View
              </button>
              <button
                className={cx("viewToggleButton", {
                  active: viewMode === "list",
                })}
                onClick={() => setViewMode("list")}
              >
                <FaList /> List View
              </button>
            </div>

            <div className={cx("roomsList")}>
              <Room filters={filters} viewMode="list" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
