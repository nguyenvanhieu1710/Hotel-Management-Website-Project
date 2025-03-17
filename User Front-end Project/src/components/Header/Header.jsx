import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, Link } from "react-router-dom";

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
import headerStyles from "./Header.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles, ...headerStyles };
const cx = classNames.bind(mergedStyles);

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = () => {
    if (isDesktop) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isDesktop) setIsHovered(false);
  };

  const handleClick = () => {
    setIsHovered((prev) => !prev);
  };

  return (
    <div>
      {/* <!-- Header Start --> */}
      <div className={cx("container-fluid", "bg-dark", "px-0")}>
        <div className={cx("row", "gx-0")}>
          <div className={cx("col-lg-3", "bg-dark", "d-none", "d-lg-block")}>
            <Link
              to="/"
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
            </Link>
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
                  <p className={cx("mb-0")}>nguyenvanhieu@gmail.com</p>
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
                  className={cx(
                    "d-inline-flex",
                    "align-items-center",
                    "py-2",
                    "socialLinks"
                  )}
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
              <Link
                to="/"
                className={cx("navbar-brand", "d-block", "d-lg-none")}
              >
                <h1 className={cx("m-0", "text-primary", "text-uppercase")}>
                  Hotelier
                </h1>
              </Link>
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
                <div
                  className={cx(
                    "navbar-nav",
                    "mr-auto",
                    "py-0",
                    "navbarNavFlex"
                  )}
                >
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      cx("nav-link", { active: isActive })
                    }
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      cx("nav-item", "nav-link", { active: isActive })
                    }
                  >
                    About
                  </NavLink>
                  <NavLink
                    to="/service"
                    className={({ isActive }) =>
                      cx("nav-item", "nav-link", { active: isActive })
                    }
                  >
                    Services
                  </NavLink>
                  <NavLink
                    to="/room"
                    className={({ isActive }) =>
                      cx("nav-item", "nav-link", { active: isActive })
                    }
                  >
                    Rooms
                  </NavLink>
                  <div
                    className={cx(
                      "nav-item",
                      "dropdown",
                      { show: isHovered },
                      "dropdownContainer"
                    )}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <a
                      href="#"
                      className={cx("nav-link", "dropdown-toggle", {
                        active: isHovered,
                      })}
                      aria-expanded={isHovered ? "true" : "false"}
                      onClick={handleClick}
                    >
                      Pages
                    </a>
                    <div
                      className={cx(
                        "dropdown-menu",
                        "rounded-0",
                        "m-0",
                        { show: isHovered },
                        "dropdownMenuCustom"
                      )}
                    >
                      <Link to="/booking" className={cx("dropdown-item")}>
                        Booking
                      </Link>
                      <Link to="/team" className={cx("dropdown-item")}>
                        Our Team
                      </Link>
                      <Link to="/testimonial" className={cx("dropdown-item")}>
                        Testimonial
                      </Link>
                    </div>
                  </div>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      cx("nav-item", "nav-link", { active: isActive })
                    }
                  >
                    Contact
                  </NavLink>
                </div>

                <a
                  href="#"
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
                  Booking Now
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
