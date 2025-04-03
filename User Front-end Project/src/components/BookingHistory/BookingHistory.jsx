import classNames from "classnames/bind";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "./BookingHistory.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

const bookingHistoryData = [
  {
    bookingId: 1,
    roomName: "Deluxe Suite",
    checkinDate: "2024-10-20",
    checkoutDate: "2024-10-25",
    totalAmount: 1500,
    status: "Completed",
    isSelected: false,
  },
  {
    bookingId: 2,
    roomName: "Standard Room",
    checkinDate: "2024-11-05",
    checkoutDate: "2024-11-10",
    totalAmount: 800,
    status: "Cancelled",
    isSelected: false,
  },
  {
    bookingId: 3,
    roomName: "Family Room",
    checkinDate: "2024-12-15",
    checkoutDate: "2024-12-20",
    totalAmount: 1200,
    status: "Confirmed",
    isSelected: false,
  },
];

export default function BookingHistory() {
  const [bookings, setBookings] = useState(bookingHistoryData);

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  const handleCheckboxChange = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.bookingId === bookingId
          ? { ...booking, isSelected: !booking.isSelected }
          : booking
      )
    );
  };

  return (
    <div data-aos="fade-up" className={cx("container-xxl")}>
      <div className={cx("container")}>
        <div className={(cx("booking-history-container"), "container-xxl")}>
          <h2>Booking History</h2>
          {bookings.length === 0 ? (
            <p>No booking history found.</p>
          ) : (
            <table className={cx("booking-history-table")}>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Booking ID</th>
                  <th>Room Name</th>
                  <th>Check-in Date</th>
                  <th>Check-out Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={booking.isSelected}
                        onChange={() => handleCheckboxChange(booking.bookingId)}
                      />
                    </td>
                    <td>{booking.bookingId}</td>
                    <td>{booking.roomName}</td>
                    <td>{booking.checkinDate}</td>
                    <td>{booking.checkoutDate}</td>
                    <td>${booking.totalAmount}</td>
                    <td>
                      <span
                        className={cx("status", booking.status.toLowerCase())}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
