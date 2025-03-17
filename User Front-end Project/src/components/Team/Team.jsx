import { useEffect } from "react";
import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import TeamOneImage from "../../assets/img/team-1.jpg";
import TeamTwoImage from "../../assets/img/team-2.jpg";
import TeamThreeImage from "../../assets/img/team-3.jpg";
import TeamFourImage from "../../assets/img/team-4.jpg";

const cx = classNames.bind({ ...bootstrapStyles, ...styles });

export default function Team() {
  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  return (
    <div data-aos="fade-up">
      {/* Team Start */}

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
              Our Team
            </h6>
            <h1 className={cx("mb-5")}>
              Explore Our{" "}
              <span className={cx("text-primary", "text-uppercase")}>
                Staffs
              </span>
            </h1>
          </div>
          <div className={cx("row", "g-4")}>
            <div
              className={cx("col-lg-3", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.1s"
            >
              <div className={cx("rounded", "shadow", "overflow-hidden")}>
                <div className={cx("position-relative")}>
                  <img
                    className={cx("img-fluid")}
                    src={TeamOneImage}
                    alt="Team 1"
                  />
                  <div
                    className={cx(
                      "position-absolute",
                      "start-50",
                      "top-100",
                      "translate-middle",
                      "d-flex",
                      "align-items-center"
                    )}
                  >
                    <a
                      className={cx("btn", "btn-square", "btn-primary", "mx-1")}
                      href=""
                    >
                      <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                    <a
                      className={cx("btn", "btn-square", "btn-primary", "mx-1")}
                      href=""
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a
                      className={cx("btn", "btn-square", "btn-primary", "mx-1")}
                      href=""
                    >
                      <FontAwesomeIcon icon={faInstagram} />
                    </a>
                  </div>
                </div>
                <div className={cx("text-center", "p-4", "mt-3")}>
                  <h5 className={cx("fw-bold", "mb-0")}>Full Name</h5>
                  <small>Designation</small>
                </div>
              </div>
            </div>
            <div
              className={cx("col-lg-3", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.3s"
            >
              <div className={cx("rounded", "shadow", "overflow-hidden")}>
                <div className={cx("position-relative")}>
                  <img
                    className={cx("img-fluid")}
                    src={TeamTwoImage}
                    alt="Team 2"
                  />
                  <div
                    className={cx(
                      "position-absolute",
                      "start-50",
                      "top-100",
                      "translate-middle",
                      "d-flex",
                      "align-items-center"
                    )}
                  >
                    <a
                      className={cx("btn", "btn-square", "btn-primary", "mx-1")}
                      href=""
                    >
                      <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                    <a
                      className={cx("btn", "btn-square", "btn-primary", "mx-1")}
                      href=""
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a
                      className={cx("btn", "btn-square", "btn-primary", "mx-1")}
                      href=""
                    >
                      <FontAwesomeIcon icon={faInstagram} />
                    </a>
                  </div>
                </div>
                <div className={cx("text-center", "p-4", "mt-3")}>
                  <h5 className={cx("fw-bold", "mb-0")}>Full Name</h5>
                  <small>Designation</small>
                </div>
              </div>
            </div>
            <div
              className={cx("col-lg-3", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.5s"
            >
              <div className={cx("rounded", "shadow", "overflow-hidden")}>
                <div className={cx("position-relative")}>
                  <img
                    className={cx("img-fluid")}
                    src={TeamThreeImage}
                    alt="Team 3"
                  />
                  <div
                    className={cx(
                      "position-absolute",
                      "start-50",
                      "top-100",
                      "translate-middle",
                      "d-flex",
                      "align-items-center"
                    )}
                  >
                    <a
                      className={cx("btn", "btn-square", "btn-primary", "mx-1")}
                      href=""
                    >
                      <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                    <a
                      className={cx("btn", "btn-square", "btn-primary", "mx-1")}
                      href=""
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a
                      className={cx("btn", "btn-square", "btn-primary", "mx-1")}
                      href=""
                    >
                      <FontAwesomeIcon icon={faInstagram} />
                    </a>
                  </div>
                </div>
                <div className={cx("text-center", "p-4", "mt-3")}>
                  <h5 className={cx("fw-bold", "mb-0")}>Full Name</h5>
                  <small>Designation</small>
                </div>
              </div>
            </div>
            <div
              className={cx("col-lg-3", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.7s"
            >
              <div className={cx("rounded", "shadow", "overflow-hidden")}>
                <div className={cx("position-relative")}>
                  <img
                    className={cx("img-fluid")}
                    src={TeamFourImage}
                    alt="Team 4"
                  />
                  <div
                    className={cx(
                      "position-absolute",
                      "start-50",
                      "top-100",
                      "translate-middle",
                      "d-flex",
                      "align-items-center"
                    )}
                  >
                    <a
                      className={cx("btn", "btn-square", "btn-primary", "mx-1")}
                      href=""
                    >
                      <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                    <a
                      className={cx("btn", "btn-square", "btn-primary", "mx-1")}
                      href=""
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a
                      className={cx("btn", "btn-square", "btn-primary", "mx-1")}
                      href=""
                    >
                      <FontAwesomeIcon icon={faInstagram} />
                    </a>
                  </div>
                </div>
                <div className={cx("text-center", "p-4", "mt-3")}>
                  <h5 className={cx("fw-bold", "mb-0")}>Full Name</h5>
                  <small>Designation</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Team End */}
    </div>
  );
}
