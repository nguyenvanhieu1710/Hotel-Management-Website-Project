import { useState, useEffect } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "./Payment.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactionData, setTransactionData] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const fetchTransactionData = async () => {
    setLoading(true);
    try {
      const requestData = {
        BookingVotesId: 0,
        UserId: 1,
        BookingDate: "2025-03-17",
        CheckinDate: "2025-03-17",
        CheckoutDate: "2025-03-18",
        Note: "abc",
        TotalAmount: 100000,
        Deleted: false,
        listBookingVotesDetails: [
          {
            BookingVotesDetailId: 0,
            BookingVotesId: 0,
            RoomId: 1,
            RoomPrice: 100,
            Note: "abc",
            Deleted: false,
          },
          {
            BookingVotesDetailId: 0,
            BookingVotesId: 0,
            RoomId: 1,
            RoomPrice: 1000,
            Note: "abcd",
            Deleted: false,
          },
        ],
      };
      const response = await axios.post(
        "http://localhost:3000/api/payment",
        requestData
      );
      setTransactionData(response.data);
    } catch (err) {
      setError("Failed to fetch transaction data.", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (paymentMethod === "wallet") {
      await fetchTransactionData();
      if (transactionData && transactionData.order_url) {
        window.open(transactionData.order_url, "_blank");
      } else {
        setError("Please try again.");
      }
    } else if (paymentMethod === "cash") {
      Swal.fire({
        icon: "success",
        title: "Successful!",
        text: "You selected to pay with COD. Please wait for the delivery.",
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
    <div data-aos="zoom-in" className={cx("payment-container")}>
      <h2 className={cx("title")}>Select Payment Method</h2>
      <form onSubmit={(e) => e.preventDefault()} className={cx("payment-form")}>
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
          className={cx("submit-button")}
          onClick={handlePaymentSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </button>
      </form>

      {error && <p className={cx("error-message")}>{error}</p>}
    </div>
  );
};

export default Payment;
