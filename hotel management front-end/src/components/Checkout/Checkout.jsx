import { useState } from "react";
import axios from "axios";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactionData, setTransactionData] = useState(null);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const fetchTransactionData = async () => {
    setLoading(true);
    try {
      const requestData = {
        orderId: 1,
        userId: 1,
        staffId: 1,
        orderStatus: "Wait for confirmation",
        dayBuy: "2025-01-16T07:13:56.647Z",
        deliveryAddress: "Hung Yen",
        evaluate: 5,
        deleted: false,
        listjson_orderDetail: [
          {
            orderDetailId: 1,
            orderId: 1,
            productId: 1,
            quantity: 10,
            price: 20000,
            discountAmount: 10,
            voucherId: 1,
            orderDetailStatus: 0,
          },
        ],
      };
      const response = await axios.post(
        "http://localhost:5000/payment",
        requestData
      );
      // eslint-disable-next-line no-debugger
      //   debugger;
      setTransactionData(response.data);
      setError("");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to fetch transaction data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    switch (paymentMethod) {
      case "card":
        alert(
          "You selected to pay with card. Please wait for the payment gateway."
        );
        break;

      case "wallet":
        await fetchTransactionData();
        // eslint-disable-next-line no-debugger
        // debugger;
        if (transactionData) {
          window.location.href = transactionData.order_url;
        } else {
          alert("Can not fetch transaction data.");
        }
        break;

      case "cash":
        alert("You selected to pay with cash. Please wait for the delivery.");
        break;

      default:
        alert("Please select a payment method.");
        break;
    }
  };

  return (
    <div className="payment-container">
      <h2 className="title">Chọn Hình Thức Thanh Toán</h2>
      <form onSubmit={(e) => e.preventDefault()} className="payment-form">
        <div className="payment-option">
          <input
            type="radio"
            id="card"
            name="payment"
            value="card"
            checked={paymentMethod === "card"}
            onChange={handlePaymentChange}
          />
          <label htmlFor="card">Pay with card</label>
        </div>
        <div className="payment-option">
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
        <div className="payment-option">
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
          className="submit-button"
          onClick={handlePaymentSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </button>
      </form>

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Payment;
