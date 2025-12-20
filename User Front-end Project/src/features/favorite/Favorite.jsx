import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faStar,
  faMapMarkerAlt,
  faUsers,
  faWifi,
  faCoffee,
  faDumbbell,
  faTrash,
  faEye,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFavorites } from "../../hooks/useFavorites";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "./Favorite.module.scss";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function Favorite() {
  const { favorites, removeFavorite } = useFavorites();
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("addedAt");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const navigate = useNavigate();

  useEffect(() => {
    filterAndSortFavorites();
  }, [favorites, sortBy, priceRange]);

  const filterAndSortFavorites = () => {
    let filtered = favorites.filter(
      (room) => room.Price >= priceRange.min && room.Price <= priceRange.max
    );

    // Sort favorites
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priceLow":
          return a.Price - b.Price;
        case "priceHigh":
          return b.Price - a.Price;
        case "name":
          return a.RoomId.localeCompare(b.RoomId);
        case "addedAt":
        default:
          return new Date(b.addedAt) - new Date(a.addedAt);
      }
    });

    setFilteredFavorites(filtered);
  };

  const handleRemoveFavorite = (roomId) => {
    removeFavorite(roomId);
    toast.success("Removed from favorites");
  };

  const viewRoomDetail = (roomId) => {
    navigate(`/room-detail/${roomId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (favorites.length === 0) {
    return (
      <div className={cx("container-xxl", "py-5")}>
        <ToastContainer />
        <div className={cx("empty-state")}>
          <FontAwesomeIcon icon={faHeart} className={cx("empty-icon")} />
          <h2>No Favorite Rooms Yet</h2>
          <p>Start exploring our rooms and add them to your favorites!</p>
          <button
            className={cx("btn", "btn-primary")}
            onClick={() => navigate("/room")}
          >
            Explore Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cx("container-xxl", "py-5")}>
      <ToastContainer />

      {/* Header Section */}
      <div className={cx("favorites-header", "mb-4")}>
        <div className={cx("row", "align-items-center")}>
          <div className={cx("col-md-6")}>
            <h1 className={cx("page-title")}>
              <FontAwesomeIcon icon={faHeart} className={cx("title-icon")} />
              My Favorite Rooms
            </h1>
            <p className={cx("page-subtitle")}>
              {favorites.length} room{favorites.length !== 1 ? "s" : ""} in your
              favorites
            </p>
          </div>
          <div className={cx("col-md-6", "text-end")}>
            <button
              className={cx("btn", "btn-outline-primary")}
              onClick={() => navigate("/room")}
            >
              <FontAwesomeIcon icon={faEye} className={cx("me-2")} />
              Browse More Rooms
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className={cx("filters-section", "mb-4")}>
        <div className={cx("row", "g-3")}>
          <div className={cx("col-md-4")}>
            <label className={cx("form-label")}>Sort by:</label>
            <select
              className={cx("form-select")}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="addedAt">Recently Added</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="name">Room Name</option>
            </select>
          </div>
          <div className={cx("col-md-4")}>
            <label className={cx("form-label")}>Price Range:</label>
            <div className={cx("d-flex", "gap-2")}>
              <input
                type="number"
                className={cx("form-control")}
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange((prev) => ({
                    ...prev,
                    min: Number(e.target.value),
                  }))
                }
              />
              <span className={cx("align-self-center")}>-</span>
              <input
                type="number"
                className={cx("form-control")}
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({
                    ...prev,
                    max: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <div className={cx("col-md-4", "d-flex", "align-items-end")}>
            <button
              className={cx("btn", "btn-outline-secondary")}
              onClick={() => setPriceRange({ min: 0, max: 1000 })}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className={cx("results-info", "mb-3")}>
        <p className={cx("mb-0")}>
          Showing {filteredFavorites.length} of {favorites.length} favorite room
          {filteredFavorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Favorites Grid */}
      <div className={cx("row", "g-4")}>
        {filteredFavorites.map((room) => (
          <div key={room.RoomId} className={cx("col-lg-6", "col-xl-4")}>
            <div className={cx("favorite-card")}>
              {/* Room Image */}
              <div className={cx("room-image-container")}>
                <img
                  src={room.RoomImage}
                  alt={`Room ${room.RoomId}`}
                  className={cx("room-image")}
                />
                <div className={cx("image-overlay")}>
                  <button
                    className={cx("btn", "btn-sm", "btn-danger", "remove-btn")}
                    onClick={() => handleRemoveFavorite(room.RoomId)}
                    title="Remove from favorites"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className={cx("btn", "btn-sm", "btn-primary", "view-btn")}
                    onClick={() => viewRoomDetail(room.RoomId)}
                    title="View details"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </div>
                <div className={cx("price-badge")}>
                  <span className={cx("currency")}>USD</span>
                  <span className={cx("amount")}>{room.Price}</span>
                  <span className={cx("per-night")}>/night</span>
                </div>
              </div>

              {/* Room Info */}
              <div className={cx("room-info")}>
                <div className={cx("room-header")}>
                  <h5 className={cx("room-title")}>
                    Room {room.RoomId} - Floor {room.NumberOfFloor}
                  </h5>
                  <div className={cx("rating")}>
                    <FontAwesomeIcon
                      icon={faStar}
                      className={cx("star-icon")}
                    />
                    <span>4.5</span>
                  </div>
                </div>

                <p className={cx("room-description")}>{room.Description}</p>

                <div className={cx("room-details")}>
                  <div className={cx("detail-item")}>
                    <FontAwesomeIcon
                      icon={faUsers}
                      className={cx("detail-icon")}
                    />
                    <span>2-5 Persons</span>
                  </div>
                  <div className={cx("detail-item")}>
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className={cx("detail-icon")}
                    />
                    <span>{room.RoomArea} m²</span>
                  </div>
                </div>

                <div className={cx("amenities")}>
                  <span className={cx("amenity-tag")}>
                    <FontAwesomeIcon icon={faWifi} />
                  </span>
                  <span className={cx("amenity-tag")}>
                    <FontAwesomeIcon icon={faCoffee} />
                  </span>
                  <span className={cx("amenity-tag")}>
                    <FontAwesomeIcon icon={faDumbbell} />
                  </span>
                </div>

                <div className={cx("added-date")}>
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className={cx("me-2")}
                  />
                  Added on {formatDate(room.addedAt)}
                </div>

                <div className={cx("card-actions")}>
                  <button
                    className={cx(
                      "btn",
                      "btn-primary",
                      "btn-sm",
                      "flex-grow-1"
                    )}
                    onClick={() => viewRoomDetail(room.RoomId)}
                  >
                    View Details
                  </button>
                  <button
                    className={cx("btn", "btn-outline-danger", "btn-sm")}
                    onClick={() => handleRemoveFavorite(room.RoomId)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty Filter Results */}
      {filteredFavorites.length === 0 && favorites.length > 0 && (
        <div className={cx("empty-filter-results", "text-center", "py-5")}>
          <FontAwesomeIcon icon={faHeart} className={cx("empty-icon")} />
          <h3>No rooms match your filters</h3>
          <p>Try adjusting your price range or sorting options</p>
          <button
            className={cx("btn", "btn-primary")}
            onClick={() => setPriceRange({ min: 0, max: 1000 })}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
