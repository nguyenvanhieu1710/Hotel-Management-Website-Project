import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import OneAboutImage from "../../assets/img/about-1.jpg";
import TwoAboutImage from "../../assets/img/about-2.jpg";
import ThreeAboutImage from "../../assets/img/about-3.jpg";
import FourAboutImage from "../../assets/img/about-4.jpg";
import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import {
  faHotel,
  faUsersCog,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function AboutUs() {
  return (
    <div>
      {/* About Start */}
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container")}>
          <div className={cx("row", "g-5", "align-items-center")}>
            <div className={cx("col-lg-6")}>
              <h6
                className={cx(
                  "section-title",
                  "text-start",
                  "text-primary",
                  "text-uppercase"
                )}
              >
                About Us
              </h6>
              <h1 className={cx("mb-4")}>
                Welcome to{" "}
                <span className={cx("text-primary", "text-uppercase")}>
                  Hotelier
                </span>
              </h1>
              <p className={cx("mb-4")}>
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit,
                sed stet lorem sit clita duo justo magna dolore erat amet
              </p>
              <div className={cx("row", "g-3", "pb-4")}>
                <div
                  className={cx("col-sm-4", "wow", "fadeIn")}
                  data-wow-delay="0.1s"
                >
                  <div className={cx("border", "rounded", "p-1")}>
                    <div
                      className={cx("border", "rounded", "text-center", "p-4")}
                    >
                      <FontAwesomeIcon
                        icon={faHotel}
                        className={cx("fa-2x", "text-primary", "mb-2")}
                      />
                      <h2 className={cx("mb-1")} data-toggle="counter-up">
                        1234
                      </h2>
                      <p className={cx("mb-0")}>Rooms</p>
                    </div>
                  </div>
                </div>
                <div
                  className={cx("col-sm-4", "wow", "fadeIn")}
                  data-wow-delay="0.3s"
                >
                  <div className={cx("border", "rounded", "p-1")}>
                    <div
                      className={cx("border", "rounded", "text-center", "p-4")}
                    >
                      <FontAwesomeIcon
                        icon={faUsersCog}
                        className={cx("fa-2x", "text-primary", "mb-2")}
                      />
                      <h2 className={cx("mb-1")} data-toggle="counter-up">
                        1234
                      </h2>
                      <p className={cx("mb-0")}>Staffs</p>
                    </div>
                  </div>
                </div>
                <div
                  className={cx("col-sm-4", "wow", "fadeIn")}
                  data-wow-delay="0.5s"
                >
                  <div className={cx("border", "rounded", "p-1")}>
                    <div
                      className={cx("border", "rounded", "text-center", "p-4")}
                    >
                      <FontAwesomeIcon
                        icon={faUsers}
                        className={cx("fa-2x", "text-primary", "mb-2")}
                      />
                      <h2 className={cx("mb-1")} data-toggle="counter-up">
                        1234
                      </h2>
                      <p className={cx("mb-0")}>Clients</p>
                    </div>
                  </div>
                </div>
              </div>
              <a
                className={cx("btn", "btn-primary", "py-3", "px-5", "mt-2")}
                href=""
              >
                Explore More
              </a>
            </div>
            <div className={cx("col-lg-6")}>
              <div className={cx("row", "g-3")}>
                <div className={cx("col-6", "text-end")}>
                  <img
                    className={cx(
                      "img-fluid",
                      "rounded",
                      "w-75",
                      "wow",
                      "zoomIn"
                    )}
                    data-wow-delay="0.1s"
                    src={OneAboutImage}
                    style={{ marginTop: "25%" }}
                    alt="About us 1"
                  />
                </div>
                <div className={cx("col-6", "text-start")}>
                  <img
                    className={cx(
                      "img-fluid",
                      "rounded",
                      "w-100",
                      "wow",
                      "zoomIn"
                    )}
                    data-wow-delay="0.3s"
                    src={TwoAboutImage}
                    alt="About us 2"
                  />
                </div>
                <div className={cx("col-6", "text-end")}>
                  <img
                    className={cx(
                      "img-fluid",
                      "rounded",
                      "w-50",
                      "wow",
                      "zoomIn"
                    )}
                    data-wow-delay="0.5s"
                    src={ThreeAboutImage}
                    alt="About us 3"
                  />
                </div>
                <div className={cx("col-6", "text-start")}>
                  <img
                    className={cx(
                      "img-fluid",
                      "rounded",
                      "w-75",
                      "wow",
                      "zoomIn"
                    )}
                    data-wow-delay="0.7s"
                    src={FourAboutImage}
                    alt="About us 4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}
    </div>
  );
}
