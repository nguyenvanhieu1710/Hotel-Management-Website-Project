import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import AOS from "aos";
import "aos/dist/aos.css";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function Booking() {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

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
                    <select defaultValue="0" className={cx("form-select")}>
                      <option value="0">Adult</option>
                      <option value="1">Adult 1</option>
                      <option value="2">Adult 2</option>
                      <option value="3">Adult 3</option>
                    </select>
                  </div>
                  <div className={cx("col-md-3")}>
                    <select defaultValue="0" className={cx("form-select")}>
                      <option value="0">Child</option>
                      <option value="1">Child 1</option>
                      <option value="2">Child 2</option>
                      <option value="3">Child 3</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={cx("col-md-2")}>
                <button className={cx("btn", "btn-primary", "w-100")}>
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
