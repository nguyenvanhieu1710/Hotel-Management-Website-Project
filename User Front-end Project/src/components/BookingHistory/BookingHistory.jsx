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
      const bookingsWithIsSelected = response.data
        .filter((booking) => booking.Status === "Unpaid")
        .map((booking) => ({
          ...booking,
          isSelected: false,
        }));
      setBookings(bookingsWithIsSelected);
    } catch (err) {
      setError("Failed to fetch booking history.", err);
    }
  };

  const formatDateToMySQL = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0]; // 'yyyy-mm-dd'
  };

  const handleCheckboxChange = (BookingVotesId) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.BookingVotesId === BookingVotesId
          ? { ...booking, isSelected: !booking.isSelected }
          : booking
      )
    );
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const fetchBookingDetail = async (bookingVotesId) => {
    const res = await axios.get(
      `http://localhost:3000/api/booking-votes-detail/get-data-by-id/${bookingVotesId}`
    );
    return res.data[0];
  };

  const fetchTransactionData = async (selectedBookings) => {
    setLoading(true);
    // console.log("Selected bookings: ", selectedBookings);

    let totalAmountUSD = selectedBookings.reduce(
      (sum, b) => sum + Number(b.TotalAmount),
      0
    );
    let totalAmount = Math.round(totalAmountUSD * 26000);

    const bookingDetail = await fetchBookingDetail(
      selectedBookings[0].BookingVotesId
    );
    try {
      const requestData = {
        UserId: selectedBookings[0].UserId,
        listBookingVotesDetails: [
          {
            BookingVotesDetailId: bookingDetail.BookingVotesDetailId,
            BookingVotesId: selectedBookings[0].BookingVotesId,
            RoomId: bookingDetail.RoomId,
            RoomPrice: parseInt(bookingDetail.RoomPrice),
            Note: bookingDetail.Note,
            Deleted: false,
          },
        ],
        TotalAmount: parseInt(totalAmount),
        BookingDate: selectedBookings[0].BookingDate,
        CheckinDate: selectedBookings[0].CheckinDate,
        CheckoutDate: selectedBookings[0].CheckoutDate,
        Note: selectedBookings[0].Note,
        Status: selectedBookings[0].Status,
        Deleted: selectedBookings[0].Deleted,
        BookingVotesId: selectedBookings[0].BookingVotesId,
      };
      // console.log("Request data: ", requestData);
      // update booking-votes (change status)
      requestData.BookingDate = formatDateToMySQL(requestData.BookingDate);
      requestData.CheckinDate = formatDateToMySQL(requestData.CheckinDate);
      requestData.CheckoutDate = formatDateToMySQL(requestData.CheckoutDate);
      requestData.Deleted = false;
      requestData.Status = "Paid";

      var modifyData = {
        ...requestData,
        TotalAmount: selectedBookings[0].TotalAmount,
      };
      console.log("Check data update: ", modifyData);
      await axios.put(
        "http://localhost:3000/api/booking-votes/update",
        modifyData
      );

      const response = await axios.post(
        "http://localhost:3000/api/payment",
        requestData
      );
      // console.log("Transaction data: ", response.data);
      setTransactionData(response.data);
      if (response.data?.order_url) {
        window.location.href = response.data.order_url;
        // window.open(response.data.order_url, "_blank");
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
                    key={booking.BookingVotesId}
                    className={cx("booking-card", {
                      "selected-booking": booking.isSelected,
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
                              handleCheckboxChange(booking.BookingVotesId)
                            }
                            id={`select-${booking.BookingVotesId}`}
                          />
                          <label
                            className={cx("form-check-label")}
                            htmlFor={`select-${booking.BookingVotesId}`}
                          >
                            Select
                          </label>
                        </div>
                        <h5 className={cx("card-title")}>{booking.roomName}</h5>
                        <p className={cx("card-text")}>
                          <strong>Booking ID:</strong> {booking.BookingVotesId}
                        </p>
                        <p className={cx("card-text")}>
                          <strong>Check-in:</strong>{" "}
                          {booking.CheckinDate.split("T")[0]}
                        </p>
                        <p className={cx("card-text")}>
                          <strong>Check-out:</strong>{" "}
                          {booking.CheckoutDate.split("T")[0]}
                        </p>
                        <p className={cx("card-text")}>
                          <strong>Total:</strong> $
                          {parseInt(booking.TotalAmount)}
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
