import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import Swal from "sweetalert2";

import { roomService } from "../../../services/roomService";
import { bookingService } from "../../../services/bookingService";
import { emailService } from "../../../services/emailService";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import {
  cleanLocalStorage,
  debugLocalStorage,
} from "../../../utils/localStorage";
import bootstrapStyles from "../../../assets/css/bootstrap.module.css";
import styles from "../../../assets/css/style.module.css";
import AboutOneImage from "../../../assets/img/about-1.jpg";
import AboutTwoImage from "../../../assets/img/about-2.jpg";
import AboutThreeImage from "../../../assets/img/about-3.jpg";
import AboutFourImage from "../../../assets/img/about-4.jpg";

const cx = classNames.bind({ ...bootstrapStyles, ...styles });

export default function BookingForm() {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adultCount, setAdultCount] = useState("1");
  const [childCount, setChildCount] = useState("1");
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [specialRequest, setSpecialRequest] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInError, setCheckInError] = useState(false);
  const [checkOutError, setCheckOutError] = useState(false);
  const [roomError, setRoomError] = useState(false);

  // Use useLocalStorage hook for user data
  const [user] = useLocalStorage("user", null);

  useEffect(() => {
    AOS.init({ duration: 3000 });

    // Clean localStorage on component mount
    cleanLocalStorage();

    // Debug localStorage
    debugLocalStorage();

    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { rooms } = await roomService.getPublicRooms();
      const availableRooms = rooms.filter(
        (room) => room.Status === "Available"
      );
      setRooms(availableRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRooms([]);
    }
  };

  const handleAdultChange = (event) => {
    setAdultCount(event.target.value);
  };

  const handleChildChange = (event) => {
    setChildCount(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clean localStorage before processing
    cleanLocalStorage();

    setCheckInError(false);
    setCheckOutError(false);
    setRoomError(false);

    if (!user || !user.AccountId) {
      console.error("User not found or invalid user data.");
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You must login to make a booking. Redirecting to login page...",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      return;
    }

    let hasError = false;

    if (!checkIn) {
      setCheckInError(true);
      hasError = true;
    }

    if (!checkOut) {
      setCheckOutError(true);
      hasError = true;
    }

    if (!selectedRoomId) {
      setRoomError(true);
      hasError = true;
    }

    if (hasError) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields!",
      });
      return;
    }

    try {
      const formatDateToISO = (date) => {
        if (!date) return null;
        return new Date(date).toISOString(); // Full ISO format for backend
      };

      const requestData = {
        UserId: user.AccountId,
        BookingDate: new Date().toISOString(),
        CheckinDate: formatDateToISO(checkIn),
        CheckoutDate: formatDateToISO(checkOut),
        Note: specialRequest || "",
        TotalAmount: selectedRoom?.Price || 0,
        Status: "Unpaid",
        listBookingVotesDetails: [
          {
            RoomId: selectedRoomId,
            RoomPrice: selectedRoom?.Price || 0,
            Note: specialRequest || "",
          },
        ],
      };

      const result = await bookingService.createBooking(requestData);
      console.log("Booking result:", result);

      // Send booking confirmation email
      try {
        // Get room details for email
        const { rooms } = await roomService.getPublicRooms();
        const roomDetails = rooms.find(
          (room) => room.RoomId === selectedRoomId
        );

        if (roomDetails && user?.Email) {
          const emailData = {
            customerEmail: user.Email,
            customerName: user.AccountName || user.Email,
            booking: {
              ...requestData,
              BookingVotesId: result.BookingVotesId || result.id,
            },
            room: roomDetails,
          };

          console.log("Sending booking email with data:", emailData);
          await emailService.sendBookingConfirmationEmail(emailData);
          console.log("Booking confirmation email sent successfully");
        } else {
          console.log("Skipping email: missing room details or user email");
        }
      } catch (emailError) {
        console.error("Failed to send booking confirmation email:", emailError);
        // Don't fail the booking if email fails - just log the error
      }

      Swal.fire({
        icon: "success",
        title: "Booking successful!",
        text: "Your booking has been created successfully. We'll send a confirmation email shortly.",
      });
    } catch (error) {
      console.error("Booking failed", error);

      // Extract meaningful error message
      let errorMessage = "Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: "error",
        title: "Booking failed!",
        text: errorMessage,
      });
    }
  };

  return (
    <div>
      {/* Booking Start */}
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container")}>
          <div
            data-aos="fade-up"
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
              Room Booking
            </h6>
            <h1 className={cx("mb-3")}>
              Book A{" "}
              <span className={cx("text-primary", "text-uppercase")}>
                Luxury Room
              </span>
            </h1>
            {/* Login Status Indicator */}
            <div className={cx("mb-4")}>
              {user && user.AccountId ? (
                <div className="alert alert-success" role="alert">
                  <strong>
                    Welcome back, {user.AccountName || user.Email}!
                  </strong>
                  <br />
                  Your information has been pre-filled.
                </div>
              ) : (
                <div className="alert alert-warning" role="alert">
                  <strong>Login Required</strong> - You must{" "}
                  <a href="/login" className="alert-link">
                    login here
                  </a>{" "}
                  to make a booking.
                </div>
              )}
            </div>
          </div>
          <div className={cx("row", "g-5")}>
            <div className={cx("col-lg-6")}>
              <div className={cx("row", "g-3")}>
                <div className={cx("col-6", "text-end")}>
                  <img
                    data-aos="zoom-in"
                    className={cx(
                      "img-fluid",
                      "rounded",
                      "w-75",
                      "wow",
                      "zoomIn"
                    )}
                    data-wow-delay="0.1s"
                    src={AboutOneImage}
                    style={{ marginTop: "25%" }}
                    alt="About 1"
                  />
                </div>
                <div className={cx("col-6", "text-start")}>
                  <img
                    data-aos="zoom-in"
                    className={cx(
                      "img-fluid",
                      "rounded",
                      "w-100",
                      "wow",
                      "zoomIn"
                    )}
                    data-wow-delay="0.3s"
                    src={AboutTwoImage}
                    alt="About 2"
                  />
                </div>
                <div className={cx("col-6", "text-end")}>
                  <img
                    data-aos="zoom-in"
                    className={cx(
                      "img-fluid",
                      "rounded",
                      "w-50",
                      "wow",
                      "zoomIn"
                    )}
                    data-wow-delay="0.5s"
                    src={AboutThreeImage}
                    alt="About 3"
                  />
                </div>
                <div className={cx("col-6", "text-start")}>
                  <img
                    data-aos="zoom-in"
                    className={cx(
                      "img-fluid",
                      "rounded",
                      "w-75",
                      "wow",
                      "zoomIn"
                    )}
                    data-wow-delay="0.7s"
                    src={AboutFourImage}
                    alt="About 4"
                  />
                </div>
              </div>
            </div>
            <div className={cx("col-lg-6")} data-aos="fade-up">
              <div className={cx("wow", "fadeInUp")} data-wow-delay="0.2s">
                <form>
                  <div className={cx("row", "g-3")}>
                    <div className={cx("col-md-6")}>
                      <div className={cx("form-floating")}>
                        <input
                          type="text"
                          className={cx("form-control")}
                          id="name"
                          placeholder="Your Name"
                          value={user?.AccountName || user?.Email || ""}
                          disabled={true}
                        />
                        <label htmlFor="name">Your Name</label>
                        {!user && (
                          <small className="text-muted">
                            Please login to see your name
                          </small>
                        )}
                      </div>
                    </div>
                    <div className={cx("col-md-6")}>
                      <div className={cx("form-floating")}>
                        <input
                          type="email"
                          className={cx("form-control")}
                          id="email"
                          placeholder="Your Email"
                          value={user?.Email || ""}
                          disabled={true}
                        />
                        <label htmlFor="email">Your Email</label>
                        {!user && (
                          <small className="text-muted">
                            Please login to see your email
                          </small>
                        )}
                      </div>
                    </div>
                    <div className={cx("col-md-6")}>
                      <div
                        className={cx("form-floating", "date")}
                        id="date3"
                        data-target-input="nearest"
                      >
                        <Datetime
                          id="checkin"
                          value={checkIn}
                          onChange={(date) => {
                            setCheckIn(date);
                            setCheckInError(false);
                          }}
                          inputProps={{
                            placeholder: "Check in",
                            className: cx(
                              "form-control",
                              "datetimepicker-input",
                              { "is-invalid": checkInError }
                            ),
                          }}
                        />
                        {checkInError && (
                          <div className="invalid-feedback">
                            Please select Check In date.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={cx("col-md-6")}>
                      <div
                        className={cx("form-floating", "date")}
                        id="date4"
                        data-target-input="nearest"
                      >
                        <Datetime
                          value={checkOut}
                          onChange={(date) => {
                            setCheckOut(date);
                            setCheckOutError(false);
                          }}
                          inputProps={{
                            placeholder: "Check out",
                            className: cx(
                              "form-control",
                              "datetimepicker-input",
                              {
                                "is-invalid": checkOutError,
                              }
                            ),
                          }}
                        />
                        {checkOutError && (
                          <div className="invalid-feedback">
                            Please select Check Out date.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={cx("col-md-6")}>
                      <div className={cx("form-floating")}>
                        <select
                          className={cx("form-select")}
                          id="select1"
                          value={adultCount}
                          onChange={handleAdultChange}
                        >
                          <option value="1">1 Adult</option>
                          <option value="2">2 Adult</option>
                          <option value="3">3 Adult</option>
                        </select>
                        <label htmlFor="select1">Select Adult</label>
                      </div>
                    </div>
                    <div className={cx("col-md-6")}>
                      <div className={cx("form-floating")}>
                        <select
                          className={cx("form-select")}
                          id="select2"
                          value={childCount}
                          onChange={handleChildChange}
                        >
                          <option value="1">1 Child</option>
                          <option value="2">2 Child</option>
                          <option value="3">3 Child</option>
                        </select>
                        <label htmlFor="select2">Select Child</label>
                      </div>
                    </div>
                    <div className={cx("col-12")}>
                      <div className={cx("form-floating")}>
                        <select
                          className={cx("form-select")}
                          id="select3"
                          onChange={(event) => {
                            const roomId = parseInt(event.target.value);
                            setSelectedRoomId(roomId);
                            const foundRoom = rooms.find(
                              (room) => room.RoomId === roomId
                            );
                            setSelectedRoom(foundRoom);
                            setRoomError(false);
                          }}
                        >
                          <option value="">Select A Room</option>
                          {rooms.map((room) => (
                            <option key={room.RoomId} value={room.RoomId}>
                              Room {room.RoomId} - Price: {parseInt(room.Price)}
                              $
                            </option>
                          ))}
                        </select>
                        <label htmlFor="select3">Select A Room</label>
                        {roomError && (
                          <div className="invalid-feedback">
                            Please select a room.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={cx("col-12")}>
                      <div className={cx("form-floating")}>
                        <textarea
                          className={cx("form-control")}
                          placeholder="Special Request"
                          id="message"
                          style={{ height: "100px" }}
                          onChange={(event) =>
                            setSpecialRequest(event.target.value)
                          }
                        ></textarea>
                        <label htmlFor="message">Special Request</label>
                      </div>
                    </div>
                    <div className={cx("col-12")}>
                      <button
                        className={cx("btn", "btn-primary", "w-100", "py-3")}
                        type="submit"
                        onClick={handleSubmit}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Booking End */}
    </div>
  );
}
