import classNames from "classnames/bind";
import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faFacebookF,
  faYoutube,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

const cx = classNames.bind({ ...bootstrapStyles, ...styles });

export default function Footer() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div data-aos="zoom-in-up">
      {/* Footer Start */}
      <div
        className={cx(
          "container-fluid",
          "bg-dark",
          "text-light",
          "footer",
          "wow",
          "fadeIn"
        )}
        data-wow-delay="0.1s"
      >
        <div className={cx("container", "pb-5")}>
          <div className={cx("row", "g-5")}>
            <div className={cx("col-md-6", "col-lg-4")}>
              <div className={cx("bg-primary", "rounded", "p-4")}>
                <a href="index.html">
                  <h1 className={cx("text-white", "text-uppercase", "mb-3")}>
                    Hieu&apos;s Hotel
                  </h1>
                </a>
                <p className={cx("text-white", "mb-0")}>
                  Our hotel offers elegantly furnished rooms, fine dining
                  experiences, and a range of premium amenities designed to
                  cater to every need. With personalized service and attention
                  to detail, we ensure your stay is both relaxing and
                  unforgettable.
                </p>
              </div>
            </div>
            <div className={cx("col-md-6", "col-lg-3")}>
              <h6
                className={cx(
                  "section-title",
                  "text-start",
                  "text-primary",
                  "text-uppercase",
                  "mb-4"
                )}
              >
                Contact
              </h6>
              <p className={cx("mb-2")}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className={cx("me-3")} />
                My Hao, Hung Yen, Viet Nam
              </p>
              <p className={cx("mb-2")}>
                <FontAwesomeIcon icon={faPhoneAlt} className={cx("me-3")} />
                +0984 605 2630
              </p>
              <p className={cx("mb-2")}>
                <FontAwesomeIcon icon={faEnvelope} className={cx("me-3")} />
                nguyenvanhieu@gmail.com
              </p>
              <div className={cx("d-flex", "pt-2")}>
                <a
                  className={cx("btn", "btn-outline-light", "btn-social")}
                  href=""
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a
                  className={cx("btn", "btn-outline-light", "btn-social")}
                  href=""
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a
                  className={cx("btn", "btn-outline-light", "btn-social")}
                  href=""
                >
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
                <a
                  className={cx("btn", "btn-outline-light", "btn-social")}
                  href=""
                >
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
              </div>
            </div>
            <div className={cx("col-lg-5", "col-md-12")}>
              <div className={cx("row", "gy-5", "g-4")}>
                <div className={cx("col-md-6")}>
                  <h6
                    className={cx(
                      "section-title",
                      "text-start",
                      "text-primary",
                      "text-uppercase",
                      "mb-4"
                    )}
                  >
                    Company
                  </h6>
                  <a className={cx("btn", "btn-link")} href="">
                    About Us
                  </a>
                  <a className={cx("btn", "btn-link")} href="">
                    Contact Us
                  </a>
                  <a className={cx("btn", "btn-link")} href="">
                    Privacy Policy
                  </a>
                  <a className={cx("btn", "btn-link")} href="">
                    Terms & Condition
                  </a>
                  <a className={cx("btn", "btn-link")} href="">
                    Support
                  </a>
                </div>
                <div className={cx("col-md-6")}>
                  <h6
                    className={cx(
                      "section-title",
                      "text-start",
                      "text-primary",
                      "text-uppercase",
                      "mb-4"
                    )}
                  >
                    Services
                  </h6>
                  <a className={cx("btn", "btn-link")} href="">
                    Food & Restaurant
                  </a>
                  <a className={cx("btn", "btn-link")} href="">
                    Spa & Fitness
                  </a>
                  <a className={cx("btn", "btn-link")} href="">
                    Sports & Gaming
                  </a>
                  <a className={cx("btn", "btn-link")} href="">
                    Event & Party
                  </a>
                  <a className={cx("btn", "btn-link")} href="">
                    GYM & Yoga
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}
    </div>
  );
}
