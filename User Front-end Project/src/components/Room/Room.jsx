import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import roomStyles from "./Room.module.css";
import {
  faStar,
  faBed,
  faBath,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";

const mergedStyles = { ...bootstrapStyles, ...styles, ...roomStyles };
const cx = classNames.bind(mergedStyles);

export default function Room({ filters }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 3000 });
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/rooms/get-all"
      );
      const availableRooms = response.data.filter(
        (room) => room.Status === "Available"
      );
      let data = filterRooms(availableRooms, filters);
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const filterRooms = (rooms, filters) => {
    if (!filters) {
      return rooms;
    }

    return rooms.filter((room) => {
      let match = true;

      if (filters.Price && room.Price > Number(filters.Price)) {
        match = false;
      }

      if (
        filters.RoomTypeId &&
        room.RoomTypeId !== Number(filters.RoomTypeId)
      ) {
        match = false;
      }

      if (
        filters.MaximumNumberOfGuests &&
        room.MaximumNumberOfGuests > Number(filters.MaximumNumberOfGuests)
      ) {
        match = false;
      }

      if (filters.Status && room.Status !== filters.Status) {
        match = false;
      }

      if (filters.RoomArea && room.RoomArea > Number(filters.RoomArea)) {
        match = false;
      }

      if (
        filters.Amenities &&
        !room.Amenities.toLowerCase().includes(filters.Amenities.toLowerCase())
      ) {
        match = false;
      }

      if (
        filters.NumberOfFloor &&
        room.NumberOfFloor !== Number(filters.NumberOfFloor)
      ) {
        match = false;
      }

      if (
        filters.Description &&
        !room.Description.toLowerCase().includes(
          filters.Description.toLowerCase()
        )
      ) {
        match = false;
      }

      if (filters.checkIn) {
        //
      }

      if (filters.checkOut) {
        //
      }

      if (filters.adults) {
        //
      }

      if (filters.children) {
        //
      }

      return match;
    });
  };

  const BookNowButton = ({ roomProps }) => {
    BookNowButton.propTypes = {
      roomProps: PropTypes.object.isRequired,
    };
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log("Account Id: ", user.account.AccountId);

    if (!user) {
      console.error("User not found in localStorage.");
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please login",
      });
      return;
    }

    const handleBookNow = async () => {
      try {
        const result = await axios.post(
          "http://localhost:3000/api/booking-votes/create",
          {
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
          }
        );
        // console.log("Booking successful", result);
        if (result.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Booking successful!",
            text: "Please go to the checkout page to pay.",
          });
        }
        // console.log("Room: ", roomProps);
        roomProps.Status = "Occupied";
        roomProps.Deleted = false;
        await axios.put(`http://localhost:3000/api/rooms/update`, roomProps);
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

  return (
    <div data-aos="fade-up">
      {/* Room Start */}
      <div className={cx("container-xxl", "py-5")}>
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
          <div className={cx("row", "g-4")}>
            {rooms.map((room) => (
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
                      alt="Room 1"
                      referrerPolicy="no-referrer"
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
                        <FontAwesomeIcon
                          icon={faStar}
                          className={cx("text-primary", "me-1")}
                        />
                        <FontAwesomeIcon
                          icon={faStar}
                          className={cx("text-primary", "me-1")}
                        />
                        <FontAwesomeIcon
                          icon={faStar}
                          className={cx("text-primary", "me-1")}
                        />
                        <FontAwesomeIcon
                          icon={faStar}
                          className={cx("text-primary", "me-1")}
                        />
                        <FontAwesomeIcon
                          icon={faStar}
                          className={cx("text-primary", "me-1")}
                        />
                      </div>
                    </div>
                    <div className={cx("d-flex", "mb-3")}>
                      <small className={cx("border-end", "me-3", "pe-3")}>
                        <FontAwesomeIcon
                          icon={faBed}
                          className={cx("text-primary", "me-2")}
                        />
                        3 Bed
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
                      {room.Description}
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
            ))}
            {/* Room Item 1 */}
            {/* <div
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
                    className={cx("img-fluid")}
                    src={OneRoomImage}
                    alt="Room 1"
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
                    $100/Night
                  </small>
                </div>
                <div className={cx("p-4", "mt-2")}>
                  <div
                    className={cx("d-flex", "justify-content-between", "mb-3")}
                  >
                    <h5 className={cx("mb-0")}>Junior Suite</h5>
                    <div className={cx("ps-2")}>
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                    </div>
                  </div>
                  <div className={cx("d-flex", "mb-3")}>
                    <small className={cx("border-end", "me-3", "pe-3")}>
                      <FontAwesomeIcon
                        icon={faBed}
                        className={cx("text-primary", "me-2")}
                      />
                      3 Bed
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
                    Erat ipsum justo amet duo et elitr dolor, est duo duo eos
                    lorem sed diam stet diam sed stet lorem.
                  </p>
                  <div className={cx("d-flex", "justify-content-between")}>
                    <Link
                      to="/room-detail/1"
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
                    <a
                      className={cx(
                        "btn",
                        "btn-sm",
                        "btn-dark",
                        "rounded",
                        "py-2",
                        "px-4"
                      )}
                      href=""
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            </div> */}
            {/* Room Item 2 */}
            {/* <div
              className={cx("col-lg-4", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.3s"
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
                    className={cx("img-fluid")}
                    src={TwoRoomImage}
                    alt="Room 2"
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
                    $100/Night
                  </small>
                </div>
                <div className={cx("p-4", "mt-2")}>
                  <div
                    className={cx("d-flex", "justify-content-between", "mb-3")}
                  >
                    <h5 className={cx("mb-0")}>Executive Suite</h5>
                    <div className={cx("ps-2")}>
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                    </div>
                  </div>
                  <div className={cx("d-flex", "mb-3")}>
                    <small className={cx("border-end", "me-3", "pe-3")}>
                      <FontAwesomeIcon
                        icon={faBed}
                        className={cx("text-primary", "me-2")}
                      />
                      3 Bed
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
                    Erat ipsum justo amet duo et elitr dolor, est duo duo eos
                    lorem sed diam stet diam sed stet lorem.
                  </p>
                  <div className={cx("d-flex", "justify-content-between")}>
                    <a
                      className={cx(
                        "btn",
                        "btn-sm",
                        "btn-primary",
                        "rounded",
                        "py-2",
                        "px-4"
                      )}
                      href=""
                    >
                      View Detail
                    </a>
                    <a
                      className={cx(
                        "btn",
                        "btn-sm",
                        "btn-dark",
                        "rounded",
                        "py-2",
                        "px-4"
                      )}
                      href=""
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            </div> */}
            {/* Room Item 3 */}
            {/* <div
              className={cx("col-lg-4", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.6s"
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
                    className={cx("img-fluid")}
                    src={ThreeRoomImage}
                    alt="Room 3"
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
                    $100/Night
                  </small>
                </div>
                <div className={cx("p-4", "mt-2")}>
                  <div
                    className={cx("d-flex", "justify-content-between", "mb-3")}
                  >
                    <h5 className={cx("mb-0")}>Super Deluxe</h5>
                    <div className={cx("ps-2")}>
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                    </div>
                  </div>
                  <div className={cx("d-flex", "mb-3")}>
                    <small className={cx("border-end", "me-3", "pe-3")}>
                      <FontAwesomeIcon
                        icon={faBed}
                        className={cx("text-primary", "me-2")}
                      />
                      3 Bed
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
                    Erat ipsum justo amet duo et elitr dolor, est duo duo eos
                    lorem sed diam stet diam sed stet lorem.
                  </p>
                  <div className={cx("d-flex", "justify-content-between")}>
                    <a
                      className={cx(
                        "btn",
                        "btn-sm",
                        "btn-primary",
                        "rounded",
                        "py-2",
                        "px-4"
                      )}
                      href=""
                    >
                      View Detail
                    </a>
                    <a
                      className={cx(
                        "btn",
                        "btn-sm",
                        "btn-dark",
                        "rounded",
                        "py-2",
                        "px-4"
                      )}
                      href=""
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* Room End */}
    </div>
  );
}

Room.propTypes = {
  filters: PropTypes.object,
};
