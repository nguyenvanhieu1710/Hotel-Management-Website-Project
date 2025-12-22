import classNames from "classnames/bind";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faThLarge,
  faSpinner,
  faExclamationTriangle,
  faDollarSign,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { useUserBookings } from "../../../hooks/useBooking";
import { bookingService } from "../../../services";
import BookingCard from "./components/BookingCard";
import bootstrapStyles from "../../../assets/css/bootstrap.module.css";
import styles from "./BookingHistory.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function BookingHistory() {
  const [user] = useLocalStorage("user", null);
  const [isGridView, setIsGridView] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  // Use useUserBookings hook to fetch user's own bookings with details
  const {
    userBookings: allBookings,
    loading: bookingsLoading,
    error: bookingsError,
    refetch,
  } = useUserBookings(user?.AccountId, {
    autoFetch: !!user?.AccountId,
    withDetails: true, // Fetch detailed information
  });

  // Filter and add isSelected property to bookings
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  useEffect(() => {
    if (allBookings) {
      const bookingsWithSelection = allBookings
        .filter((booking) => booking.Status === "Unpaid")
        .map((booking) => ({
          ...booking,
          isSelected: false,
        }));
      setBookings(bookingsWithSelection);
    }
  }, [allBookings]);

  // Check if user is logged in
  if (!user) {
    return (
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container", "text-center")}>
          <h4>Please log in to view your booking history</h4>
          <p>You need to be logged in to access this page.</p>
          <a href="/login" className={cx("btn", "btn-primary")}>
            Go to Login
          </a>
        </div>
      </div>
    );
  }

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

  const handlePaymentSubmit = async () => {
    const selectedBookingsList = bookings.filter(
      (booking) => booking.isSelected
    );

    if (selectedBookingsList.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select at least one booking to pay.",
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    if (paymentMethod === "wallet") {
      // Simplified payment process - just update booking status
      setLoading(true);
      try {
        // Update each selected booking to "Paid" status
        for (const booking of selectedBookingsList) {
          const updateData = {
            BookingVotesId: booking.BookingVotesId,
            Status: "Paid",
          };

          await bookingService.updateBooking(updateData);
        }

        Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          text: "Your booking has been paid successfully.",
          confirmButtonColor: "#ffc107",
        });

        // Refresh the bookings list
        refetch();
      } catch (err) {
        console.error("Payment processing error:", err);
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: err.message || "An error occurred during payment.",
          confirmButtonColor: "#ffc107",
        });
      } finally {
        setLoading(false);
      }
    } else if (paymentMethod === "cash") {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "You selected to pay with COD. Please wait for confirmation.",
        confirmButtonColor: "#ffc107",
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select a payment method.",
        confirmButtonColor: "#ffc107",
      });
    }
  };

  // Show loading state
  if (bookingsLoading) {
    return (
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container", "text-center")}>
          <div
            className={cx("spinner-border", "text-primary", "mb-3")}
            role="status"
          >
            <span className={cx("visually-hidden")}>Loading...</span>
          </div>
          <h5>Loading your bookings...</h5>
        </div>
      </div>
    );
  }

  // Show error state
  if (bookingsError) {
    return (
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container", "text-center")}>
          <h4 className={cx("text-danger")}>Error Loading Bookings</h4>
          <p>{bookingsError}</p>
          <button
            className={cx("btn", "btn-primary")}
            onClick={() => refetch()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-aos="fade-up" className={cx("container-xxl", "py-5")}>
      <div className={cx("container")}>
        <div className={cx("booking-history-container")}>
          {/* Header */}
          <div className={cx("row", "mb-4")}>
            <div className={cx("col-12")}>
              <div
                className={cx(
                  "d-flex",
                  "justify-content-between",
                  "align-items-center",
                  "flex-wrap"
                )}
              >
                <div className={cx("mb-3", "mb-md-0")}>
                  <h2 className={cx("mb-1")}>
                    <FontAwesomeIcon
                      icon={faList}
                      className={cx("text-primary", "me-3")}
                    />
                    Booking History
                  </h2>
                  <p className={cx("text-muted", "mb-0")}>
                    Manage your unpaid bookings and complete payments
                  </p>
                </div>
                <div className={cx("d-flex", "gap-2")}>
                  <button
                    className={cx("btn", "btn-outline-primary")}
                    onClick={toggleView}
                  >
                    <FontAwesomeIcon
                      icon={isGridView ? faList : faThLarge}
                      className={cx("me-2")}
                    />
                    {isGridView ? "List View" : "Grid View"}
                  </button>
                  <button
                    className={cx("btn", "btn-outline-secondary")}
                    onClick={() => refetch()}
                    disabled={bookingsLoading}
                  >
                    {bookingsLoading ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        className={cx("me-2")}
                      />
                    ) : (
                      "Refresh"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <div className={cx("text-center", "py-5")}>
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                size="3x"
                className={cx("text-muted", "mb-3")}
              />
              <h4 className={cx("text-muted")}>No Unpaid Bookings</h4>
              <p className={cx("text-muted", "mb-4")}>
                You do not have any unpaid bookings at the moment.
              </p>
              <a href="/room" className={cx("btn", "btn-primary")}>
                Browse Rooms
              </a>
            </div>
          ) : (
            <>
              {/* Bookings Grid/List */}
              <div className={cx("row", isGridView ? "g-4" : "g-3")}>
                {bookings.map((booking) => (
                  <div
                    key={booking.BookingVotesId}
                    className={cx(isGridView ? "col-lg-6" : "col-12")}
                  >
                    <BookingCard
                      booking={booking}
                      isSelected={booking.isSelected}
                      onSelect={handleCheckboxChange}
                    />
                  </div>
                ))}
              </div>

              {/* Payment Section */}
              <div className={cx("row", "mt-5")}>
                <div className={cx("col-lg-8", "mx-auto")}>
                  <div className={cx("card", "shadow", "border-0")}>
                    <div
                      className={cx("card-header", "bg-primary", "text-white")}
                    >
                      <h5 className={cx("mb-0")}>
                        <FontAwesomeIcon
                          icon={faDollarSign}
                          className={cx("me-2")}
                        />
                        Complete Payment
                      </h5>
                    </div>
                    <div className={cx("card-body", "p-4")}>
                      {/* Selected Bookings Summary */}
                      <div className={cx("mb-4")}>
                        <h6 className={cx("fw-bold", "mb-3")}>
                          Selected Bookings
                        </h6>
                        {bookings.filter((b) => b.isSelected).length === 0 ? (
                          <div className={cx("alert", "alert-info")}>
                            <FontAwesomeIcon
                              icon={faExclamationTriangle}
                              className={cx("me-2")}
                            />
                            Please select at least one booking to proceed with
                            payment.
                          </div>
                        ) : (
                          <div className={cx("bg-light", "rounded", "p-3")}>
                            {bookings
                              .filter((b) => b.isSelected)
                              .map((booking) => (
                                <div
                                  key={booking.BookingVotesId}
                                  className={cx(
                                    "d-flex",
                                    "justify-content-between",
                                    "mb-2"
                                  )}
                                >
                                  <span>
                                    Booking #{booking.BookingVotesId}
                                    {booking.roomDetails?.RoomName && (
                                      <small
                                        className={cx("text-muted", "ms-2")}
                                      >
                                        ({booking.roomDetails.RoomName})
                                      </small>
                                    )}
                                  </span>
                                  <strong>
                                    ${parseInt(booking.TotalAmount)}
                                  </strong>
                                </div>
                              ))}
                            <hr />
                            <div
                              className={cx(
                                "d-flex",
                                "justify-content-between",
                                "fw-bold"
                              )}
                            >
                              <span>Total Amount</span>
                              <span className={cx("text-success")}>
                                $
                                {bookings
                                  .filter((b) => b.isSelected)
                                  .reduce(
                                    (sum, b) => sum + parseInt(b.TotalAmount),
                                    0
                                  )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Payment Options */}
                      <div className={cx("mb-4")}>
                        <h6 className={cx("fw-bold", "mb-3")}>
                          Payment Method
                        </h6>
                        <div className={cx("row", "g-3")}>
                          <div className={cx("col-md-6")}>
                            <div className={cx("form-check", "payment-option")}>
                              <input
                                type="radio"
                                id="wallet"
                                name="payment"
                                value="wallet"
                                checked={paymentMethod === "wallet"}
                                onChange={handlePaymentChange}
                                className={cx("form-check-input")}
                              />
                              <label
                                htmlFor="wallet"
                                className={cx("form-check-label", "w-100")}
                              >
                                <div
                                  className={cx(
                                    "card",
                                    "h-100",
                                    "payment-card"
                                  )}
                                >
                                  <div
                                    className={cx("card-body", "text-center")}
                                  >
                                    <div className={cx("mb-2")}>💳</div>
                                    <strong>ZaloPay</strong>
                                    <small
                                      className={cx("d-block", "text-muted")}
                                    >
                                      Instant payment
                                    </small>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                          <div className={cx("col-md-6")}>
                            <div className={cx("form-check", "payment-option")}>
                              <input
                                type="radio"
                                id="cash"
                                name="payment"
                                value="cash"
                                checked={paymentMethod === "cash"}
                                onChange={handlePaymentChange}
                                className={cx("form-check-input")}
                              />
                              <label
                                htmlFor="cash"
                                className={cx("form-check-label", "w-100")}
                              >
                                <div
                                  className={cx(
                                    "card",
                                    "h-100",
                                    "payment-card"
                                  )}
                                >
                                  <div
                                    className={cx("card-body", "text-center")}
                                  >
                                    <div className={cx("mb-2")}>💵</div>
                                    <strong>Cash on Delivery</strong>
                                    <small
                                      className={cx("d-block", "text-muted")}
                                    >
                                      Pay at hotel
                                    </small>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Button */}
                      <div className={cx("text-center")}>
                        <button
                          type="button"
                          className={cx("btn", "btn-primary", "btn-lg", "px-5")}
                          onClick={handlePaymentSubmit}
                          disabled={
                            loading ||
                            bookings.filter((b) => b.isSelected).length === 0
                          }
                        >
                          {loading ? (
                            <>
                              <FontAwesomeIcon
                                icon={faSpinner}
                                spin
                                className={cx("me-2")}
                              />
                              Processing Payment...
                            </>
                          ) : (
                            <>
                              Proceed to Payment
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className={cx("ms-2")}
                              />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
