import classNames from "classnames/bind";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import Swal from "sweetalert2";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "./BookingHistory.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [isGridView, setIsGridView] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [transactionData, setTransactionData] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 3000 });
    fetchBoooking();
  }, []);

  const fetchBoooking = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/booking-votes/get-all"
      );
      // console.log("Booking votes: ", response.data);
      setBookings(response.data);
    } catch (err) {
      setError("Failed to fetch booking history.", err);
    }
  };

  const handleCheckboxChange = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.bookingId === bookingId
          ? { ...booking, isSelected: !booking.isSelected }
          : booking
      )
    );
    setSelectedBookingId(bookingId);
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const fetchTransactionData = async (selectedBookings) => {
    setLoading(true);
    // console.log("Selected bookings: ", selectedBookings);

    try {
      const requestData = {
        UserId: selectedBookings[0].UserId,
        listBookingVotesDetails: selectedBookings.map(() => ({
          RoomId: 0,
          RoomPrice: 0,
          Note: "",
          Deleted: false,
        })),
        TotalAmount: parseInt(selectedBookings[0].TotalAmount),
        BookingDate: new Date().toISOString().split("T")[0],
        CheckinDate: selectedBookings[0].CheckinDate,
        CheckoutDate: selectedBookings[0].CheckoutDate,
        Note: selectedBookings[0].Note,
        Status: selectedBookings[0].Status,
        Deleted: selectedBookings[0].Deleted,
        BookingVotesId: selectedBookings[0].BookingVotesId,
      };
      // console.log("Request data: ", requestData);

      const response = await axios.post(
        "http://localhost:3000/api/payment",
        requestData
      );
      // console.log("Transaction data: ", response.data);
      setTransactionData(response.data);
      if (response.data?.order_url) {
        window.open(response.data.order_url, "_blank");
      } else {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: "Please try again.",
        });
      }
    } catch (err) {
      setError("Failed to process payment.", err);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "An error occurred during payment.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    const selectedBookings = bookings.filter((booking) => booking.isSelected);

    if (selectedBookings.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select at least one booking to pay.",
      });
      return;
    }

    if (paymentMethod === "wallet") {
      await fetchTransactionData(selectedBookings);
    } else if (paymentMethod === "cash") {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "You selected to pay with COD. Please wait for confirmation.",
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select a payment method.",
      });
    }
  };

  return (
    <div data-aos="fade-up" className={cx("container-xxl")}>
      <div className={cx("container")}>
        <div className={cx("booking-history-container", "container-xxl")}>
          <div
            className={cx(
              "d-flex",
              "justify-content-between",
              "align-items-center",
              "mb-3"
            )}
          >
            <h2>Unpaid Bookings</h2>
            <button
              className={cx("btn", "btn-outline-primary")}
              onClick={toggleView}
            >
              Switch to {isGridView ? "List" : "Grid"} View
            </button>
          </div>
          {bookings.length === 0 ? (
            <p>No unpaid bookings found.</p>
          ) : (
            <>
              <div
                className={cx(
                  isGridView ? "booking-grid-view" : "booking-list-view"
                )}
              >
                {bookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className={cx("booking-card", {
                      "selected-booking":
                        booking.bookingId === selectedBookingId &&
                        booking.isSelected,
                    })}
                  >
                    <div className={cx("card", "shadow-sm")}>
                      <div className={cx("card-body")}>
                        <div className={cx("form-check", "mb-2")}>
                          <input
                            type="checkbox"
                            className={cx("form-check-input")}
                            checked={booking.isSelected}
                            onChange={() =>
                              handleCheckboxChange(booking.bookingId)
                            }
                            id={`select-${booking.bookingId}`}
                          />
                          <label
                            className={cx("form-check-label")}
                            htmlFor={`select-${booking.bookingId}`}
                          >
                            Select
                          </label>
                        </div>
                        <h5 className={cx("card-title")}>{booking.roomName}</h5>
                        <p className={cx("card-text")}>
                          <strong>Booking ID:</strong> {booking.BookingVotesId}
                        </p>
                        <p className={cx("card-text")}>
                          <strong>Check-in:</strong> {booking.CheckinDate}
                        </p>
                        <p className={cx("card-text")}>
                          <strong>Check-out:</strong> {booking.CheckoutDate}
                        </p>
                        <p className={cx("card-text")}>
                          <strong>Total:</strong> ${booking.TotalAmount}
                        </p>
                        <p className={cx("card-text")}>
                          <strong>Status:</strong>{" "}
                          <span className={cx("status", booking.Status)}>
                            {booking.Status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={cx("payment-options", "mt-4")}>
                <h3>Payment Options</h3>
                <div className={cx("payment-option")}>
                  <input
                    type="radio"
                    id="wallet"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={handlePaymentChange}
                  />
                  <label htmlFor="wallet">ZaloPay</label>
                </div>
                <div className={cx("payment-option")}>
                  <input
                    type="radio"
                    id="cash"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={handlePaymentChange}
                  />
                  <label htmlFor="cash">COD</label>
                </div>
                <button
                  type="button"
                  className={cx("btn", "btn-primary", "mt-3")}
                  onClick={handlePaymentSubmit}
                  disabled={loading}
                >
                  {loading ? "Processing Payment..." : "Proceed to Payment"}
                </button>
                {error && (
                  <p className={cx("error-message", "mt-2")}>{error}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
