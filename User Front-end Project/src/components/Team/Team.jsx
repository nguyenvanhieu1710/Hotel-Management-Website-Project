import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import teamStyles from "./Team.module.css";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
// import TeamOneImage from "../../assets/img/team-1.jpg";
// import TeamTwoImage from "../../assets/img/team-2.jpg";
// import TeamThreeImage from "../../assets/img/team-3.jpg";
// import TeamFourImage from "../../assets/img/team-4.jpg";

const cx = classNames.bind({ ...bootstrapStyles, ...styles, ...teamStyles });

export default function Team() {
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 3000 });
    fetchStaffs();
  }, []);

  const fetchStaffs = () => {
    axios
      .get("http://localhost:3000/api/staff/get-all")
      .then((res) => {
        setStaffs(res.data);
      })
      .catch((error) => {
        console.error("Error fetching staffs", error);
      });
  };

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
            {staffs.map((staff) => (
              <div
                key={staff.StaffId}
                className={cx("col-lg-3", "col-md-6", "wow", "fadeInUp")}
                data-wow-delay="0.1s"
                data-aos="fade-right"
              >
                <div className={cx("rounded", "shadow", "overflow-hidden")}>
                  <div className={cx("position-relative")}>
                    <img
                      className={cx("img-fluid", "staff-image")}
                      src={staff.StaffImage}
                      alt="Team 1"
                      referrerPolicy="no-referrer"
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
                        className={cx(
                          "btn",
                          "btn-square",
                          "btn-primary",
                          "mx-1"
                        )}
                        href=""
                      >
                        <FontAwesomeIcon icon={faFacebookF} />
                      </a>
                      <a
                        className={cx(
                          "btn",
                          "btn-square",
                          "btn-primary",
                          "mx-1"
                        )}
                        href=""
                      >
                        <FontAwesomeIcon icon={faTwitter} />
                      </a>
                      <a
                        className={cx(
                          "btn",
                          "btn-square",
                          "btn-primary",
                          "mx-1"
                        )}
                        href=""
                      >
                        <FontAwesomeIcon icon={faInstagram} />
                      </a>
                    </div>
                  </div>
                  <div className={cx("text-center", "p-4", "mt-3")}>
                    <h5 className={cx("fw-bold", "mb-0")}>{staff.StaffName}</h5>
                    <small>{staff.Position}</small>
                  </div>
                </div>
              </div>
            ))}
            {/* <div
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
            </div> */}
          </div>
        </div>
      </div>
      {/* Team End */}
    </div>
  );
}
