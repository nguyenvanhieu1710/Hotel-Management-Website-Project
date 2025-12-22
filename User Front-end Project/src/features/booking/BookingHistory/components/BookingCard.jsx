import { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faBed,
  faUsers,
  faDollarSign,
  faInfoCircle,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faChevronDown,
  faChevronUp,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import bootstrapStyles from "../../../../assets/css/bootstrap.module.css";
import styles from "./BookingCard.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function BookingCard({ booking, isSelected, onSelect }) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "success";
      case "unpaid":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return faCheckCircle;
      case "unpaid":
        return faExclamationTriangle;
      case "cancelled":
        return faTimes;
      default:
        return faInfoCircle;
    }
  };

  // Calculate pricing breakdown
  const roomPrice = booking.pricePerNight || 0;
  const nights = booking.numberOfNights || 1;
  const subtotal = roomPrice * nights;
  const tax = subtotal * 0.1; // 10% tax
  const total = booking.TotalAmount || subtotal + tax;

  return (
    <div className={cx("booking-card", { selected: isSelected })}>
      <div className={cx("card", "shadow-sm", "border-0", "h-100")}>
        {/* Header with selection and status */}
        <div className={cx("card-header", "bg-light", "border-0", "py-3")}>
          <div
            className={cx(
              "d-flex",
              "justify-content-between",
              "align-items-center"
            )}
          >
            <div className={cx("form-check")}>
              <input
                type="checkbox"
                className={cx("form-check-input")}
                checked={isSelected}
                onChange={() => onSelect(booking.BookingVotesId)}
                id={`select-${booking.BookingVotesId}`}
              />
              <label
                className={cx("form-check-label", "fw-bold")}
                htmlFor={`select-${booking.BookingVotesId}`}
              >
                Booking #{booking.BookingVotesId}
              </label>
            </div>
            <span
              className={cx(
                "badge",
                `bg-${getStatusColor(booking.Status)}`,
                "px-3",
                "py-2"
              )}
            >
              <FontAwesomeIcon
                icon={getStatusIcon(booking.Status)}
                className={cx("me-1")}
              />
              {booking.Status}
            </span>
          </div>
        </div>

        <div className={cx("card-body", "p-4")}>
          {/* Room Information */}
          <div className={cx("row", "mb-4")}>
            <div className={cx("col-md-4")}>
              {booking.roomDetails?.RoomImage ? (
                <img
                  src={booking.roomDetails.RoomImage}
                  alt={booking.roomDetails.RoomName || "Room"}
                  className={cx("img-fluid", "rounded", "room-image")}
                  style={{ height: "120px", objectFit: "cover", width: "100%" }}
                />
              ) : (
                <div
                  className={cx(
                    "bg-light",
                    "rounded",
                    "d-flex",
                    "align-items-center",
                    "justify-content-center"
                  )}
                  style={{ height: "120px" }}
                >
                  <FontAwesomeIcon
                    icon={faBed}
                    size="2x"
                    className={cx("text-muted")}
                  />
                </div>
              )}
            </div>
            <div className={cx("col-md-8")}>
              <h5 className={cx("mb-2")}>
                {booking.roomDetails?.RoomName ||
                  `Booking #${booking.BookingVotesId}`}
              </h5>
              <p className={cx("text-muted", "mb-2")}>
                <FontAwesomeIcon icon={faBed} className={cx("me-2")} />
                {booking.roomDetails?.RoomTypeName || "Room Booking"}
              </p>
              {booking.roomDetails?.MaxGuests && (
                <p className={cx("text-muted", "mb-2")}>
                  <FontAwesomeIcon icon={faUsers} className={cx("me-2")} />
                  Max {booking.roomDetails.MaxGuests} guests
                </p>
              )}
              {booking.roomDetails?.Description ? (
                <p className={cx("text-muted", "small", "mb-0")}>
                  {booking.roomDetails.Description.length > 100
                    ? `${booking.roomDetails.Description.substring(0, 100)}...`
                    : booking.roomDetails.Description}
                </p>
              ) : (
                <p className={cx("text-muted", "small", "mb-0")}>
                  Room details will be available after confirmation
                </p>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className={cx("row", "mb-4")}>
            <div className={cx("col-md-6")}>
              <div className={cx("d-flex", "align-items-center", "mb-2")}>
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className={cx("text-primary", "me-2")}
                />
                <div>
                  <small className={cx("text-muted", "d-block")}>
                    Check-in
                  </small>
                  <strong>{formatDate(booking.CheckinDate)}</strong>
                </div>
              </div>
            </div>
            <div className={cx("col-md-6")}>
              <div className={cx("d-flex", "align-items-center", "mb-2")}>
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className={cx("text-primary", "me-2")}
                />
                <div>
                  <small className={cx("text-muted", "d-block")}>
                    Check-out
                  </small>
                  <strong>{formatDate(booking.CheckoutDate)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className={cx("bg-light", "rounded", "p-3", "mb-3")}>
            <div
              className={cx(
                "d-flex",
                "justify-content-between",
                "align-items-center"
              )}
            >
              <div>
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className={cx("text-success", "me-2")}
                />
                <span className={cx("fw-bold")}>Total Amount</span>
                {nights > 1 && (
                  <small className={cx("text-muted", "d-block")}>
                    {nights} nights × {formatCurrency(roomPrice)}
                  </small>
                )}
              </div>
              <h4 className={cx("mb-0", "text-success")}>
                {formatCurrency(total)}
              </h4>
            </div>
          </div>

          {/* Toggle Details Button */}
          <button
            className={cx("btn", "btn-outline-primary", "w-100", "mb-3")}
            onClick={() => setShowDetails(!showDetails)}
          >
            <FontAwesomeIcon
              icon={showDetails ? faChevronUp : faChevronDown}
              className={cx("me-2")}
            />
            {showDetails ? "Hide Details" : "Show Details"}
          </button>

          {/* Detailed Information (Collapsible) */}
          {showDetails && (
            <div className={cx("border-top", "pt-3")}>
              {/* Pricing Breakdown */}
              <div className={cx("mb-4")}>
                <h6 className={cx("fw-bold", "mb-3")}>
                  <FontAwesomeIcon icon={faDollarSign} className={cx("me-2")} />
                  Pricing Breakdown
                </h6>
                <div className={cx("row", "g-2")}>
                  <div className={cx("col-8")}>Room ({nights} nights)</div>
                  <div className={cx("col-4", "text-end")}>
                    {formatCurrency(subtotal)}
                  </div>
                  <div className={cx("col-8")}>Taxes & Fees</div>
                  <div className={cx("col-4", "text-end")}>
                    {formatCurrency(tax)}
                  </div>
                  <hr className={cx("my-2")} />
                  <div className={cx("col-8", "fw-bold")}>Total</div>
                  <div className={cx("col-4", "text-end", "fw-bold")}>
                    {formatCurrency(total)}
                  </div>
                </div>
              </div>

              {/* Room Amenities */}
              {booking.roomDetails?.Amenities && (
                <div className={cx("mb-4")}>
                  <h6 className={cx("fw-bold", "mb-2")}>Room Amenities</h6>
                  <p className={cx("text-muted", "small")}>
                    {booking.roomDetails.Amenities}
                  </p>
                </div>
              )}

              {/* Special Notes */}
              {booking.Note && (
                <div className={cx("mb-4")}>
                  <h6 className={cx("fw-bold", "mb-2")}>Special Notes</h6>
                  <p className={cx("text-muted", "small")}>{booking.Note}</p>
                </div>
              )}

              {/* Payment Information */}
              <div className={cx("mb-4")}>
                <h6 className={cx("fw-bold", "mb-3")}>
                  <FontAwesomeIcon icon={faClock} className={cx("me-2")} />
                  Payment Information
                </h6>
                <div className={cx("alert", "alert-info", "mb-2")}>
                  <small>
                    <strong>Payment Methods:</strong> ZaloPay, Cash on Delivery
                    (COD)
                  </small>
                </div>
                <div className={cx("alert", "alert-warning", "mb-2")}>
                  <small>
                    <strong>Payment Deadline:</strong> Please complete payment
                    within 24 hours of booking
                  </small>
                </div>
                <div className={cx("alert", "alert-secondary", "mb-0")}>
                  <small>
                    <strong>Cancellation Policy:</strong> Free cancellation up
                    to 24 hours before check-in
                  </small>
                </div>
              </div>

              {/* Contact Information */}
              <div className={cx("bg-light", "rounded", "p-3")}>
                <h6 className={cx("fw-bold", "mb-3")}>Contact & Support</h6>
                <div className={cx("row", "g-2", "small")}>
                  <div className={cx("col-12")}>
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className={cx("text-primary", "me-2")}
                    />
                    <strong>Grand Hotel</strong> - 123 Main Street, City Center
                  </div>
                  <div className={cx("col-md-6")}>
                    <FontAwesomeIcon
                      icon={faPhone}
                      className={cx("text-success", "me-2")}
                    />
                    Hotline: +1 (555) 123-4567
                  </div>
                  <div className={cx("col-md-6")}>
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className={cx("text-info", "me-2")}
                    />
                    support@grandhotel.com
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

BookingCard.propTypes = {
  booking: PropTypes.shape({
    BookingVotesId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    CheckinDate: PropTypes.string.isRequired,
    CheckoutDate: PropTypes.string.isRequired,
    TotalAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    Status: PropTypes.string.isRequired,
    Note: PropTypes.string,
    numberOfNights: PropTypes.number,
    pricePerNight: PropTypes.number,
    roomDetails: PropTypes.shape({
      RoomId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      RoomName: PropTypes.string,
      RoomTypeName: PropTypes.string,
      RoomImage: PropTypes.string,
      MaxGuests: PropTypes.number,
      Description: PropTypes.string,
      Amenities: PropTypes.string,
      Price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    bookingDetails: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};
