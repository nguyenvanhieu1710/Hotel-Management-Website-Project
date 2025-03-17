import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import AboutOneImage from "../../assets/img/about-1.jpg";
import AboutTwoImage from "../../assets/img/about-2.jpg";
import AboutThreeImage from "../../assets/img/about-3.jpg";
import AboutFourImage from "../../assets/img/about-4.jpg";

const cx = classNames.bind({ ...bootstrapStyles, ...styles });

export default function BookingForm() {
  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

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
                        <input
                          type="text"
                          className={cx("form-control", "datetimepicker-input")}
                          id="checkin"
                          placeholder="Check In"
                          data-target="#date3"
                          data-toggle="datetimepicker"
                        />
                        <label htmlFor="checkin">Check In</label>
                      </div>
                    </div>
                    <div className={cx("col-md-6")}>
                      <div
                        className={cx("form-floating", "date")}
                        id="date4"
                        data-target-input="nearest"
                      >
                        <input
                          type="text"
                          className={cx("form-control", "datetimepicker-input")}
                          id="checkout"
                          placeholder="Check Out"
                          data-target="#date4"
                          data-toggle="datetimepicker"
                        />
                        <label htmlFor="checkout">Check Out</label>
                      </div>
                    </div>
                    <div className={cx("col-md-6")}>
                      <div className={cx("form-floating")}>
                        <select className={cx("form-select")} id="select1">
                          <option value="1">Adult 1</option>
                          <option value="2">Adult 2</option>
                          <option value="3">Adult 3</option>
                        </select>
                        <label htmlFor="select1">Select Adult</label>
                      </div>
                    </div>
                    <div className={cx("col-md-6")}>
                      <div className={cx("form-floating")}>
                        <select className={cx("form-select")} id="select2">
                          <option value="1">Child 1</option>
                          <option value="2">Child 2</option>
                          <option value="3">Child 3</option>
                        </select>
                        <label htmlFor="select2">Select Child</label>
                      </div>
                    </div>
                    <div className={cx("col-12")}>
                      <div className={cx("form-floating")}>
                        <select className={cx("form-select")} id="select3">
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
