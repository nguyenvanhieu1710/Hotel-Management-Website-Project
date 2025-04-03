import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import Swal from "sweetalert2";
import axios from "axios";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import AboutOneImage from "../../assets/img/about-1.jpg";
import AboutTwoImage from "../../assets/img/about-2.jpg";
import AboutThreeImage from "../../assets/img/about-3.jpg";
import AboutFourImage from "../../assets/img/about-4.jpg";

const cx = classNames.bind({ ...bootstrapStyles, ...styles });

export default function BookingForm() {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adultCount, setAdultCount] = useState("1");
  const [childCount, setChildCount] = useState("1");
  const [roomCount, setRoomCount] = useState("1");

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  const handleAdultChange = (event) => {
    setAdultCount(event.target.value);
  };

  const handleChildChange = (event) => {
    setChildCount(event.target.value);
  };

  const handleRoomChange = (event) => {
    setRoomCount(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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

    try {
      const result = axios.post(
        "http://localhost:3000/api/booking-votes/create",
        {
          BookingVotesId: 0,
          UserId: user.account.AccountId,
          BookingDate: new Date().toISOString().split("T")[0],
          CheckinDate: new Date().toISOString().split("T")[0],
          CheckoutDate: new Date().toISOString().split("T")[0],
          Note: "abc",
          TotalAmount: 0,
          Deleted: false,
          listBookingVotesDetails: [
            {
              BookingVotesDetailId: 0,
              BookingVotesId: 0,
              RoomId: 0,
              RoomPrice: 0,
              Note: "abcd",
              Deleted: false,
            },
          ],
        }
      );
      if (result.status === 200) {
        console.log("Booking successful", result);
        Swal.fire({
          icon: "success",
          title: "Booking successful!",
          text: "Check your booking history in your profile.",
        });
      }
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
            <h1 className={cx("mb-5")}>
              Book A{" "}
              <span className={cx("text-primary", "text-uppercase")}>
                Luxury Room
              </span>
            </h1>
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
                        />
                        <label htmlFor="name">Your Name</label>
                      </div>
                    </div>
                    <div className={cx("col-md-6")}>
                      <div className={cx("form-floating")}>
                        <input
                          type="email"
                          className={cx("form-control")}
                          id="email"
                          placeholder="Your Email"
                        />
                        <label htmlFor="email">Your Email</label>
                      </div>
                    </div>
                    <div className={cx("col-md-6")}>
                      <div
                        className={cx("form-floating", "date")}
                        id="date3"
                        data-target-input="nearest"
                      >
                        {/* <input
                          type="text"
                          className={cx("form-control", "datetimepicker-input")}
                          id="checkin"
                          placeholder="Check In"
                          data-target="#date3"
                          data-toggle="datetimepicker"
                        /> */}
                        <Datetime
                          id="checkin"
                          value={checkIn}
                          onChange={(date) => setCheckIn(date)}
                          inputProps={{
                            placeholder: "Check in",
                            className: cx(
                              "form-control",
                              "datetimepicker-input"
                            ),
                          }}
                        />
                        {/* <label htmlFor="checkin">Check In</label> */}
                      </div>
                    </div>
                    <div className={cx("col-md-6")}>
                      <div
                        className={cx("form-floating", "date")}
                        id="date4"
                        data-target-input="nearest"
                      >
                        {/* <input
                          type="text"
                          className={cx("form-control", "datetimepicker-input")}
                          id="checkout"
                          placeholder="Check Out"
                          data-target="#date4"
                          data-toggle="datetimepicker"
                        />
                        <label htmlFor="checkout">Check Out</label> */}
                        <Datetime
                          value={checkOut}
                          onChange={(date) => setCheckOut(date)}
                          inputProps={{
                            placeholder: "Check out",
                            className: cx("form-control"),
                          }}
                        />
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
                          <option value="1">1 adult</option>
                          <option value="2">2 adult</option>
                          <option value="3">3 adult</option>
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
                          <option value="1">Child 1</option>
                          <option value="2">Child 2</option>
                          <option value="3">Child 3</option>
                        </select>
                        <label htmlFor="select2">Select Child</label>
                      </div>
                    </div>
                    <div className={cx("col-12")}>
                      <div className={cx("form-floating")}>
                        <select
                          className={cx("form-select")}
                          id="select3"
                          value={roomCount}
                          onChange={handleRoomChange}
                        >
                          <option value="1">Room 1</option>
                          <option value="2">Room 2</option>
                          <option value="3">Room 3</option>
                        </select>
                        <label htmlFor="select3">Select A Room</label>
                      </div>
                    </div>
                    <div className={cx("col-12")}>
                      <div className={cx("form-floating")}>
                        <textarea
                          className={cx("form-control")}
                          placeholder="Special Request"
                          id="message"
                          style={{ height: "100px" }}
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
