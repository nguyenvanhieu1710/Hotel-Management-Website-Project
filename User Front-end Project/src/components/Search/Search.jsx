import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { useLocation } from "react-router-dom";
import axios from "axios";

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
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
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
          <input
            type="number"
            name="Price"
            placeholder="Max Price"
            value={filters.Price}
            onChange={handleFilterChange}
            className={cx("filterInput")}
          />
          <select
            name="RoomTypeId"
            value={filters.RoomTypeId}
            onChange={handleFilterChange}
            className={cx("filterInput")}
          >
            <option value="">Select Room Type</option>
            {roomTypes.map((type) => (
              <option key={type.RoomTypeId} value={type.RoomTypeId}>
                {type.RoomTypeName}
              </option>
            ))}
          </select>
          <select
            name="Status"
            value={filters.Status}
            onChange={handleFilterChange}
            className={cx("filterInput")}
          >
            <option value="">Select Status</option>
            {roomStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="RoomArea"
            placeholder="Max Area"
            value={filters.RoomArea}
            onChange={handleFilterChange}
            className={cx("filterInput")}
          />

          <select
            name="Amenities"
            value={filters.Amenities}
            onChange={handleFilterChange}
            className={cx("filterInput")}
          >
            <option value="">Select Amenities</option>
            {amenitiesOptions.map((amenity) => (
              <option key={amenity} value={amenity}>
                {amenity}
              </option>
            ))}
          </select>

          {/* <input
            type="number"
            name="MaximumNumberOfGuests"
            placeholder="Max Guests"
            value={filters.MaximumNumberOfGuests}
            onChange={handleFilterChange}
            className={cx("filterInput")}
          />
          <input
            type="number"
            name="NumberOfFloor"
            placeholder="Floor Number"
            value={filters.NumberOfFloor}
            onChange={handleFilterChange}
            className={cx("filterInput")}
          />
          <input
            type="text"
            name="Description"
            placeholder="Detailed Description"
            value={filters.Description}
            onChange={handleFilterChange}
            className={cx("filterInput")}
          /> */}
        </div>

        <div>
          <Room filters={filters} />
        </div>
      </div>
    </div>
  );
}
