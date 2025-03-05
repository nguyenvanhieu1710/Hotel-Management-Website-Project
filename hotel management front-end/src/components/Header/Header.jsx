import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhoneAlt,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function Header() {
  return (
    <div>
      {/* <!-- Header Start --> */}
      <div className={cx("container-fluid", "bg-dark", "px-0")}>
        <div className={cx("row", "gx-0")}>
          <div className={cx("col-lg-3", "bg-dark", "d-none", "d-lg-block")}>
            <a
              href="index.html"
              className={cx(
                "navbar-brand",
                "w-100",
                "h-100",
                "m-0",
                "p-0",
                "d-flex",
                "align-items-center",
                "justify-content-center"
              )}
            >
              <h1 className={cx("m-0", "text-primary", "text-uppercase")}>
                Hotelier
              </h1>
            </a>
          </div>
          <div className={cx("col-lg-9")}>
            <div
              className={cx("row", "gx-0", "bg-white", "d-none", "d-lg-flex")}
            >
              <div className={cx("col-lg-7", "px-5", "text-start")}>
                <div
                  className={cx(
                    "h-100",
                    "d-inline-flex",
                    "align-items-center",
                    "py-2",
                    "me-4"
                  )}
                >
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className={cx("text-primary", "me-2")}
                  />
                  <p className={cx("mb-0")}>info@example.com</p>
                </div>
                <div
                  className={cx(
                    "h-100",
                    "d-inline-flex",
                    "align-items-center",
                    "py-2"
                  )}
                >
                  <FontAwesomeIcon
                    icon={faPhoneAlt}
                    className={cx("text-primary", "me-2")}
                  />
                  <p className={cx("mb-0")}>+012 345 6789</p>
                </div>
              </div>
              <div className={cx("col-lg-5", "px-5", "text-end")}>
                <div
                  className={cx("d-inline-flex", "align-items-center", "py-2")}
                >
                  <a href="" className={cx("me-3")}>
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a href="" className={cx("me-3")}>
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a href="" className={cx("me-3")}>
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </a>
                  <a href="" className={cx("me-3")}>
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a href="" className={cx()}>
                    <FontAwesomeIcon icon={faYoutube} />
                  </a>
                </div>
              </div>
            </div>
            <nav
              className={cx(
                "navbar",
                "navbar-expand-lg",
                "bg-dark",
                "navbar-dark",
                "p-3",
                "p-lg-0"
              )}
            >
              <a
                href="index.html"
                className={cx("navbar-brand", "d-block", "d-lg-none")}
              >
                <h1 className={cx("m-0", "text-primary", "text-uppercase")}>
                  Hotelier
                </h1>
              </a>
              <button
                type="button"
                className={cx("navbar-toggler")}
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
              >
                <span className={cx("navbar-toggler-icon")}></span>
              </button>
              <div
                className={cx(
                  "collapse",
                  "navbar-collapse",
                  "justify-content-between"
                )}
                id="navbarCollapse"
              >
                <div className={cx("navbar-nav", "mr-auto", "py-0")}>
                  <a
                    href="index.html"
                    className={cx("nav-item", "nav-link", "active")}
                  >
                    Home
                  </a>
                  <a href="about.html" className={cx("nav-item", "nav-link")}>
                    About
                  </a>
                  <a href="service.html" className={cx("nav-item", "nav-link")}>
                    Services
                  </a>
                  <a href="room.html" className={cx("nav-item", "nav-link")}>
                    Rooms
                  </a>
                  <div className={cx("nav-item", "dropdown")}>
                    <a
                      href="#"
                      className={cx("nav-link", "dropdown-toggle")}
                      data-bs-toggle="dropdown"
                    >
                      Pages
                    </a>
                    <div className={cx("dropdown-menu", "rounded-0", "m-0")}>
                      <a href="booking.html" className={cx("dropdown-item")}>
                        Booking
                      </a>
                      <a href="team.html" className={cx("dropdown-item")}>
                        Our Team
                      </a>
                      <a
                        href="testimonial.html"
                        className={cx("dropdown-item")}
                      >
                        Testimonial
                      </a>
                    </div>
                  </div>
                  <a href="contact.html" className={cx("nav-item", "nav-link")}>
                    Contact
                  </a>
                </div>
                <a
                  href="https://htmlcodex.com/hotel-html-template-pro"
                  className={cx(
                    "btn",
                    "btn-primary",
                    "rounded-0",
                    "py-4",
                    "px-md-5",
                    "d-none",
                    "d-lg-block"
                  )}
                >
                  Premium Version
                  <FontAwesomeIcon icon={faArrowRight} className={cx("ms-3")} />
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
      {/* <!-- Header End --> */}
    </div>
  );
}
