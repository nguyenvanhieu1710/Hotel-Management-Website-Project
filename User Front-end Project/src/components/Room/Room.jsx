import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import roomStyles from "./Room.module.css";
import {
  faStar,
  faBed,
  faBath,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { useRooms } from "../../hooks";
import { bookingService } from "../../services";
import Pagination from "../Pagination/Pagination";

const mergedStyles = { ...bootstrapStyles, ...styles, ...roomStyles };
const cx = classNames.bind(mergedStyles);

// Static params to prevent infinite loops
const EMPTY_PARAMS = {};
const PUBLIC_OPTIONS = { isPublic: true };
const ITEMS_PER_PAGE = 6; // Show 6 rooms per page

export default function Room({ filters }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Use hooks for data fetching with static params
  const { rooms, loading, error, refetch } = useRooms(
    EMPTY_PARAMS,
    PUBLIC_OPTIONS
  );

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

      // Room Type filter
      if (
        filters.RoomTypeId &&
        room.RoomTypeId !== Number(filters.RoomTypeId)
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

      // Status filter (additional check)
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

      // Floor filter
      if (
        filters.NumberOfFloor &&
        room.NumberOfFloor !== Number(filters.NumberOfFloor)
      ) {
        match = false;
      }

      // Description filter
      if (
        filters.Description &&
        room.Description &&
        !room.Description.toLowerCase().includes(
          filters.Description.toLowerCase()
        )
      ) {
        match = false;
      }

      // Date filters (placeholder for future implementation)
      if (filters.checkIn) {
        // TODO: Implement check-in date logic
      }

      if (filters.checkOut) {
        // TODO: Implement check-out date logic
      }

      return match;
    });
  }, [rooms, filters]);

  // Pagination logic
  const totalItems = filteredRooms.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRooms = filteredRooms.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of rooms section
    const roomsSection = document.querySelector(".rooms-section");
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

        // Use booking service instead of direct API call
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

        // Refresh rooms data after booking
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

  // PropTypes for BookNowButton
  BookNowButton.propTypes = {
    roomProps: PropTypes.object.isRequired,
  };

  // Show loading state
  if (loading) {
    return (
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container")}>
          <div className={cx("text-center")}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading rooms...</span>
            </div>
            <p className="mt-3">Loading available rooms...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container")}>
          <div className={cx("text-center")}>
            <div className="alert alert-danger" role="alert">
              <h4>Error loading rooms</h4>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => refetch()}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-aos="fade-up">
      {/* Room Start */}
      <div className={cx("container-xxl", "py-5", "rooms-section")}>
        <div className={cx("container")}>
          {!filters && (
            <div
              className={cx("text-center", "wow", "fadeInUp")}
              data-wow-delay="0.1s"
            >
              <h6
                className={cx(
                  "section-title",
                  "text-center",
                  "text-primary",
                  "text-uppercase"
                )}
              >
                Our Rooms
              </h6>
              <h1 className={cx("mb-5")}>
                Explore Our{" "}
                <span className={cx("text-primary", "text-uppercase")}>
                  Rooms
                </span>
              </h1>
            </div>
          )}

          {/* Filter Results Info */}
          {filters && (
            <div className={cx("mb-4")}>
              <p className={cx("text-muted")}>
                Found {totalItems} available room(s) matching your criteria
              </p>
            </div>
          )}

          {/* Rooms Grid */}
          <div className={cx("row", "g-4")}>
            {currentRooms.length > 0 ? (
              currentRooms.map((room) => (
                <div
                  key={room.RoomId}
                  className={cx("col-lg-4", "col-md-6", "wow", "fadeInUp")}
                  data-wow-delay="0.1s"
                >
                  <div
                    className={cx(
                      "room-item",
                      "shadow",
                      "rounded",
                      "overflow-hidden"
                    )}
                  >
                    <div className={cx("position-relative")}>
                      <img
                        className={cx("img-fluid", "room-image")}
                        src={room.RoomImage}
                        alt={`Room ${room.RoomId}`}
                        referrerPolicy="no-referrer"
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                      <small
                        className={cx(
                          "position-absolute",
                          "start-0",
                          "top-100",
                          "translate-middle-y",
                          "bg-primary",
                          "text-white",
                          "rounded",
                          "py-1",
                          "px-3",
                          "ms-4"
                        )}
                      >
                        ${parseInt(room.Price)}/Night
                      </small>
                    </div>
                    <div className={cx("p-4", "mt-2")}>
                      <div
                        className={cx(
                          "d-flex",
                          "justify-content-between",
                          "mb-3"
                        )}
                      >
                        <h5 className={cx("mb-0")}>Room {room.RoomId}</h5>
                        <div className={cx("ps-2")}>
                          {[...Array(5)].map((_, index) => (
                            <FontAwesomeIcon
                              key={index}
                              icon={faStar}
                              className={cx("text-primary", "me-1")}
                            />
                          ))}
                        </div>
                      </div>
                      <div className={cx("d-flex", "mb-3")}>
                        <small className={cx("border-end", "me-3", "pe-3")}>
                          <FontAwesomeIcon
                            icon={faBed}
                            className={cx("text-primary", "me-2")}
                          />
                          {room.MaximumNumberOfGuests || 3} Bed
                        </small>
                        <small className={cx("border-end", "me-3", "pe-3")}>
                          <FontAwesomeIcon
                            icon={faBath}
                            className={cx("text-primary", "me-2")}
                          />
                          2 Bath
                        </small>
                        <small>
                          <FontAwesomeIcon
                            icon={faWifi}
                            className={cx("text-primary", "me-2")}
                          />
                          Wifi
                        </small>
                      </div>
                      <p className={cx("text-body", "mb-3")}>
                        {room.Description ||
                          "Comfortable and well-equipped room with modern amenities."}
                      </p>
                      <div className={cx("d-flex", "justify-content-between")}>
                        <Link
                          to={`/room-detail/${room.RoomId}`}
                          className={cx(
                            "btn",
                            "btn-sm",
                            "btn-primary",
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
                <div className={cx("text-center", "py-5")}>
                  <h4>No rooms available</h4>
                  <p className={cx("text-muted")}>
                    {filters
                      ? "No rooms match your search criteria. Please try adjusting your filters."
                      : "There are currently no available rooms."}
                  </p>
                  {filters && (
                    <button
                      className={cx("btn", "btn-primary")}
                      onClick={() => window.location.reload()}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
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
            variant="primary"
          />
        )}
      </div>
      {/* Room End */}
    </div>
  );
}

Room.propTypes = {
  filters: PropTypes.object,
};
