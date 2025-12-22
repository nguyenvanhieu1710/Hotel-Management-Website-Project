import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { useLocalStorage } from "../../../hooks/useLocalStorage";
import bootstrapStyles from "../../../assets/css/bootstrap.module.css";
import styles from "../../../assets/css/style.module.css";
import roomStyles from "./RoomList.module.css";
import {
  faStar,
  faBed,
  faBath,
  faWifi,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useRooms } from "../../../hooks";
import { bookingService } from "../../../services";
import { useFavorites } from "../../../hooks/useFavorites";
import Pagination from "../../../components/Pagination/Pagination";

const mergedStyles = { ...bootstrapStyles, ...styles, ...roomStyles };
const cx = classNames.bind(mergedStyles);

// Static params to prevent infinite loops
const EMPTY_PARAMS = {};
const PUBLIC_OPTIONS = { isPublic: true };
const ITEMS_PER_PAGE = 12; // Show 12 rooms per page

export default function RoomList({ filters, onResultsUpdate }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Use hooks for data fetching with static params
  const { rooms, loading, error, refetch } = useRooms(
    EMPTY_PARAMS,
    PUBLIC_OPTIONS
  );

  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  // Filter rooms logic using useMemo for performance
  const filteredRooms = useMemo(() => {
    if (!rooms || rooms.length === 0) {
      return [];
    }

    // First filter only available rooms
    let availableRooms = rooms.filter((room) => room.Status === "Available");

    // If no filters provided, return all available rooms
    if (!filters) {
      return availableRooms;
    }

    // Apply filters
    return availableRooms.filter((room) => {
      let match = true;

      // Price filter
      if (filters.Price && room.Price > Number(filters.Price)) {
        match = false;
      }

      // Room Type filter (array)
      if (
        filters.RoomTypeId &&
        Array.isArray(filters.RoomTypeId) &&
        filters.RoomTypeId.length > 0 &&
        !filters.RoomTypeId.includes(room.RoomTypeId)
      ) {
        match = false;
      }

      // Maximum guests filter
      if (
        filters.MaximumNumberOfGuests &&
        room.MaximumNumberOfGuests < Number(filters.MaximumNumberOfGuests)
      ) {
        match = false;
      }

      // Status filter
      if (filters.Status && room.Status !== filters.Status) {
        match = false;
      }

      // Room area filter
      if (filters.RoomArea && room.RoomArea < Number(filters.RoomArea)) {
        match = false;
      }

      // Amenities filter
      if (
        filters.Amenities &&
        room.Amenities &&
        !room.Amenities.toLowerCase().includes(filters.Amenities.toLowerCase())
      ) {
        match = false;
      }

      // Description/Search filter
      if (
        filters.Description &&
        room.Description &&
        !room.Description.toLowerCase().includes(
          filters.Description.toLowerCase()
        )
      ) {
        match = false;
      }

      return match;
    });
  }, [rooms, filters]);

  // Sort rooms based on sortBy
  const sortedRooms = useMemo(() => {
    if (!filteredRooms || filteredRooms.length === 0) return [];

    const sorted = [...filteredRooms];

    switch (filters?.sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => Number(a.Price) - Number(b.Price));
      case "price-desc":
        return sorted.sort((a, b) => Number(b.Price) - Number(a.Price));
      case "name-asc":
        return sorted.sort((a, b) => a.RoomId - b.RoomId);
      case "name-desc":
        return sorted.sort((a, b) => b.RoomId - a.RoomId);
      case "newest":
      default:
        return sorted.sort((a, b) => b.RoomId - a.RoomId);
    }
  }, [filteredRooms, filters?.sortBy]);

  // Pagination logic
  const totalItems = sortedRooms.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRooms = sortedRooms.slice(startIndex, endIndex);

  // Update results count
  useEffect(() => {
    if (onResultsUpdate) {
      onResultsUpdate(totalItems);
    }
  }, [totalItems, onResultsUpdate]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of rooms section
    const roomsSection = document.querySelector(".rooms-results");
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // BookNow Button Component
  const BookNowButton = ({ roomProps }) => {
    const [user] = useLocalStorage("user", null);

    const handleBookNow = async () => {
      try {
        if (!user) {
          Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "Please login to book a room",
          });
          return;
        }

        if (!user.account) {
          Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "Please login to book a room",
          });
          return;
        }

        const bookingData = {
          BookingVotesId: 0,
          UserId: user.account.AccountId,
          BookingDate: new Date().toISOString().split("T")[0],
          CheckinDate: new Date().toISOString().split("T")[0],
          CheckoutDate: new Date().toISOString().split("T")[0],
          Note: "No note",
          TotalAmount: roomProps.Price,
          Status: "Unpaid",
          Deleted: false,
          listBookingVotesDetails: [
            {
              BookingVotesDetailId: 0,
              BookingVotesId: 0,
              RoomId: roomProps.RoomId,
              RoomPrice: roomProps.Price,
              Note: "No note",
              Deleted: false,
            },
          ],
        };

        await bookingService.createBooking(bookingData);

        Swal.fire({
          icon: "success",
          title: "Booking successful!",
          text: "Please go to the checkout page to pay.",
        });

        refetch();
      } catch (error) {
        console.error("Booking failed", error);
        Swal.fire({
          icon: "error",
          title: "Booking failed!",
          text: "Please try again.",
        });
      }
    };

    return (
      <button
        onClick={handleBookNow}
        className={cx("btn", "btn-sm", "btn-dark", "rounded", "py-2", "px-4")}
      >
        Book Now
      </button>
    );
  };

  BookNowButton.propTypes = {
    roomProps: PropTypes.object.isRequired,
  };

  const handleFavoriteToggle = (room) => {
    const favoriteItem = {
      id: room.RoomId,
      type: "room",
      name: `Room ${room.RoomId}`,
      image: room.RoomImage,
      price: room.Price,
    };

    toggleFavorite(favoriteItem);
  };

  // Show loading state
  if (loading) {
    return (
      <div className={cx("text-center", "py-5")}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading rooms...</span>
        </div>
        <p className="mt-3">Loading available rooms...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={cx("text-center", "py-5")}>
        <div className="alert alert-danger" role="alert">
          <h4>Error loading rooms</h4>
          <p>{error}</p>
          <button
            className="btn btn-warning text-dark"
            onClick={() => refetch()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-aos="fade-up" className={cx("rooms-container")}>
      {/* Rooms Grid */}
      <div className={cx("row", "g-4")}>
        {currentRooms.length > 0 ? (
          currentRooms.map((room) => (
            <div
              key={room.RoomId}
              className={cx("col-lg-6", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.1s"
            >
              <div
                className={cx(
                  "room-item",
                  "shadow",
                  "rounded",
                  "overflow-hidden",
                  "h-100"
                )}
              >
                <div className={cx("position-relative")}>
                  {/* Favorite Button - Inside image container */}
                  <button
                    className="favorite-btn"
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      zIndex: 15,
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isFavorite(room.RoomId, "room")
                        ? "#ffc107"
                        : "rgba(255,255,255,0.95)",
                      border: isFavorite(room.RoomId, "room")
                        ? "2px solid #ffc107"
                        : "2px solid rgba(255,255,255,0.8)",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => handleFavoriteToggle(room)}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                    }}
                    title={
                      isFavorite(room.RoomId, "room")
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{
                        color: isFavorite(room.RoomId, "room")
                          ? "#212529"
                          : "#dc3545",
                        fontSize: "16px",
                      }}
                    />
                  </button>

                  <img
                    className={cx("img-fluid", "room-image")}
                    src={room.RoomImage}
                    alt={`Room ${room.RoomId}`}
                    referrerPolicy="no-referrer"
                    style={{
                      height: "220px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <small
                    className={cx(
                      "bg-warning",
                      "text-dark",
                      "rounded",
                      "py-1",
                      "px-3",
                      "ms-4"
                    )}
                    style={{ fontWeight: "700" }}
                  >
                    ${parseInt(room.Price)}/Night
                  </small>
                </div>

                <div
                  style={{
                    padding: "1.5rem",
                    marginTop: "0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    height: "calc(100% - 220px)",
                  }}
                >
                  <div
                    className={cx("d-flex", "justify-content-between", "mb-3")}
                  >
                    <h5 className={cx("mb-0")}>Room {room.RoomId}</h5>
                    <div className={cx("ps-2")}>
                      {[...Array(5)].map((_, index) => (
                        <FontAwesomeIcon
                          key={index}
                          icon={faStar}
                          className={cx("text-warning", "me-1")}
                          style={{ fontSize: "0.8rem" }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className={cx("d-flex", "mb-3", "flex-wrap")}>
                    <small className={cx("border-end", "me-3", "pe-3")}>
                      <FontAwesomeIcon
                        icon={faBed}
                        className={cx("text-warning", "me-2")}
                      />
                      {room.MaximumNumberOfGuests || 3} Bed
                    </small>
                    <small className={cx("border-end", "me-3", "pe-3")}>
                      <FontAwesomeIcon
                        icon={faBath}
                        className={cx("text-warning", "me-2")}
                      />
                      2 Bath
                    </small>
                    <small>
                      <FontAwesomeIcon
                        icon={faWifi}
                        className={cx("text-warning", "me-2")}
                      />
                      Wifi
                    </small>
                  </div>

                  <p className={cx("text-body")}>
                    {room.Description ||
                      "Comfortable and well-equipped room with modern amenities."}
                  </p>

                  <div className={cx("d-flex", "justify-content-between")}>
                    <Link
                      to={`/room-detail/${room.RoomId}`}
                      className={cx(
                        "btn-view-detail",
                        "btn",
                        "btn-sm",
                        "btn-warning",
                        "text-dark",
                        "rounded",
                        "py-2",
                        "px-4"
                      )}
                    >
                      View Detail
                    </Link>
                    <BookNowButton roomProps={room} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={cx("col-12")}>
            <div className={cx("text-center", "py-5", "empty-state")}>
              <h4>No rooms available</h4>
              <p className={cx("text-muted")}>
                {filters && Object.keys(filters).length > 0
                  ? "No rooms match your search criteria. Please try adjusting your filters."
                  : "There are currently no available rooms."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
          showInfo={true}
          showFirstLast={true}
          maxVisiblePages={5}
          size="md"
          variant="warning"
        />
      )}
    </div>
  );
}

RoomList.propTypes = {
  filters: PropTypes.object,
  onResultsUpdate: PropTypes.func,
};
