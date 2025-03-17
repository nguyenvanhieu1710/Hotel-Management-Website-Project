import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";

const cx = classNames.bind({ ...bootstrapStyles, ...styles });

export default function Newsletter() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div>
      {/* Newsletter Start */}
      <div
        className={cx("container", "newsletter", "mt-5", "wow", "fadeIn")}
        data-wow-delay="0.1s"
        data-aos="zoom-in-up"
      >
        <div className={cx("row", "justify-content-center")}>
          <div className={cx("col-lg-10", "border", "rounded", "p-1")}>
            <div className={cx("border", "rounded", "text-center", "p-1")}>
              <div className={cx("bg-white", "rounded", "text-center", "p-5")}>
                <h4 className={cx("mb-4")}>
                  Subscribe Our{" "}
                  <span className={cx("text-primary", "text-uppercase")}>
                    Newsletter
                  </span>
                </h4>
                <div
                  className={cx("position-relative", "mx-auto")}
                  style={{ maxWidth: "400px" }}
                >
                  <input
                    className={cx(
                      "form-control",
                      "w-100",
                      "py-3",
                      "ps-4",
                      "pe-5"
                    )}
                    type="text"
                    placeholder="Enter your email"
                  />
                  <button
                    type="button"
                    className={cx(
                      "btn",
                      "btn-primary",
                      "py-2",
                      "px-3",
                      "position-absolute",
                      "top-0",
                      "end-0",
                      "mt-2",
                      "me-2"
                    )}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Newsletter End */}
    </div>
  );
}
