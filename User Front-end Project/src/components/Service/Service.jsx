import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import serviceStyles from "./Service.module.css";
import {
  faStar,
  faBed,
  faBath,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const cx = classNames.bind({ ...bootstrapStyles, ...styles, ...serviceStyles });

export default function Service() {
  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  return (
    <div data-aos="fade-up">
      {/* Service Start */}
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container")}>
          <div
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
              Our Services
            </h6>
            <h1 className={cx("mb-5")}>
              Explore Our{" "}
              <span className={cx("text-primary", "text-uppercase")}>
                Services
              </span>
            </h1>
          </div>
          <div className={cx("row", "g-4")}>
            <div
              className={cx("col-lg-4", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.1s"
            >
              <a className={cx("service-item", "rounded")} href="">
                <div
                  className={cx(
                    "service-icon",
                    "bg-transparent",
                    "border",
                    "rounded",
                    "p-1"
                  )}
                >
                  <div
                    className={cx(
                      "w-100",
                      "h-100",
                      "border",
                      "rounded",
                      "d-flex",
                      "align-items-center",
                      "justify-content-center"
                    )}
                  >
                    <FontAwesomeIcon
                      icon={faBed}
                      size="2x"
                      className={cx("text-primary")}
                    />
                  </div>
                </div>
                <h5 className={cx("mb-3")}>Rooms & Appartment</h5>
                <p className={cx("text-body", "mb-0")}>
                  Erat ipsum justo amet duo et elitr dolor, est duo duo eos
                  lorem sed diam stet diam sed stet lorem.
                </p>
              </a>
            </div>
            <div
              className={cx("col-lg-4", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.2s"
            >
              <a className={cx("service-item", "rounded")} href="">
                <div
                  className={cx(
                    "service-icon",
                    "bg-transparent",
                    "border",
                    "rounded",
                    "p-1"
                  )}
                >
                  <div
                    className={cx(
                      "w-100",
                      "h-100",
                      "border",
                      "rounded",
                      "d-flex",
                      "align-items-center",
                      "justify-content-center"
                    )}
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      size="2x"
                      className={cx("text-primary")}
                    />
                  </div>
                </div>
                <h5 className={cx("mb-3")}>Food & Restaurant</h5>
                <p className={cx("text-body", "mb-0")}>
                  Erat ipsum justo amet duo et elitr dolor, est duo duo eos
                  lorem sed diam stet diam sed stet lorem.
                </p>
              </a>
            </div>
            <div
              className={cx("col-lg-4", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.3s"
            >
              <a className={cx("service-item", "rounded")} href="">
                <div
                  className={cx(
                    "service-icon",
                    "bg-transparent",
                    "border",
                    "rounded",
                    "p-1"
                  )}
                >
                  <div
                    className={cx(
                      "w-100",
                      "h-100",
                      "border",
                      "rounded",
                      "d-flex",
                      "align-items-center",
                      "justify-content-center"
                    )}
                  >
                    <FontAwesomeIcon
                      icon={faBath}
                      size="2x"
                      className={cx("text-primary")}
                    />
                  </div>
                </div>
                <h5 className={cx("mb-3")}>Spa & Fitness</h5>
                <p className={cx("text-body", "mb-0")}>
                  Erat ipsum justo amet duo et elitr dolor, est duo duo eos
                  lorem sed diam stet diam sed stet lorem.
                </p>
              </a>
            </div>
            <div
              className={cx("col-lg-4", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.4s"
            >
              <a className={cx("service-item", "rounded")} href="">
                <div
                  className={cx(
                    "service-icon",
                    "bg-transparent",
                    "border",
                    "rounded",
                    "p-1"
                  )}
                >
                  <div
                    className={cx(
                      "w-100",
                      "h-100",
                      "border",
                      "rounded",
                      "d-flex",
                      "align-items-center",
                      "justify-content-center"
                    )}
                  >
                    <FontAwesomeIcon
                      icon={faWifi}
                      size="2x"
                      className={cx("text-primary")}
                    />
                  </div>
                </div>
                <h5 className={cx("mb-3")}>Sports & Gaming</h5>
                <p className={cx("text-body", "mb-0")}>
                  Erat ipsum justo amet duo et elitr dolor, est duo duo eos
                  lorem sed diam stet diam sed stet lorem.
                </p>
              </a>
            </div>
            <div
              className={cx("col-lg-4", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.5s"
            >
              <a className={cx("service-item", "rounded")} href="">
                <div
                  className={cx(
                    "service-icon",
                    "bg-transparent",
                    "border",
                    "rounded",
                    "p-1"
                  )}
                >
                  <div
                    className={cx(
                      "w-100",
                      "h-100",
                      "border",
                      "rounded",
                      "d-flex",
                      "align-items-center",
                      "justify-content-center"
                    )}
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      size="2x"
                      className={cx("text-primary")}
                    />
                  </div>
                </div>
                <h5 className={cx("mb-3")}>Event & Party</h5>
                <p className={cx("text-body", "mb-0")}>
                  Erat ipsum justo amet duo et elitr dolor, est duo duo eos
                  lorem sed diam stet diam sed stet lorem.
                </p>
              </a>
            </div>
            <div
              className={cx("col-lg-4", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.6s"
            >
              <a className={cx("service-item", "rounded")} href="">
                <div
                  className={cx(
                    "service-icon",
                    "bg-transparent",
                    "border",
                    "rounded",
                    "p-1"
                  )}
                >
                  <div
                    className={cx(
                      "w-100",
                      "h-100",
                      "border",
                      "rounded",
                      "d-flex",
                      "align-items-center",
                      "justify-content-center"
                    )}
                  >
                    <FontAwesomeIcon
                      icon={faBath}
                      size="2x"
                      className={cx("text-primary")}
                    />
                  </div>
                </div>
                <h5 className={cx("mb-3")}>GYM & Yoga</h5>
                <p className={cx("text-body", "mb-0")}>
                  Erat ipsum justo amet duo et elitr dolor, est duo duo eos
                  lorem sed diam stet diam sed stet lorem.
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Service End */}
    </div>
  );
}
