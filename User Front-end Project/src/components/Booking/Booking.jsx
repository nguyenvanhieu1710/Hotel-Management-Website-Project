import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function Booking() {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState("0");
  const [children, setChildren] = useState("0");

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  const handleSubmit = () => {
    navigate("/search", {
      state: {
        checkIn: checkIn ? checkIn.toISOString() : null,
        checkOut: checkOut ? checkOut.toISOString() : null,
        adults: adults,
        children: children,
      },
    });
  };

  return (
    <div data-aos="fade-up">
      {/* Booking Start */}
      <div className={cx("container-fluid", "booking", "pb-5")}>
        <div className={cx("container")}>
          <div className={cx("bg-white", "shadow")} style={{ padding: "35px" }}>
            <div className={cx("row", "g-2")}>
              <div className={cx("col-md-10")}>
                <div className={cx("row", "g-2")}>
                  <div className={cx("col-md-3")}>
                    <Datetime
                      value={checkIn}
                      onChange={(date) => setCheckIn(date)}
                      inputProps={{
                        placeholder: "Check in",
                        className: cx("form-control"),
                      }}
                    />
                  </div>
                  <div className={cx("col-md-3")}>
                    <Datetime
                      value={checkOut}
                      onChange={(date) => setCheckOut(date)}
                      inputProps={{
                        placeholder: "Check out",
                        className: cx("form-control"),
                      }}
                    />
                  </div>
                  <div className={cx("col-md-3")}>
                    <select
                      defaultValue="0"
                      className={cx("form-select")}
                      value={adults}
                      onChange={(e) => setAdults(e.target.value)}
                    >
                      <option value="0">Adult</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  <div className={cx("col-md-3")}>
                    <select
                      defaultValue="0"
                      className={cx("form-select")}
                      value={children}
                      onChange={(e) => setChildren(e.target.value)}
                    >
                      <option value="0">Child</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={cx("col-md-2")}>
                <button
                  className={cx("btn", "btn-primary", "w-100")}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Booking End */}
    </div>
  );
}
