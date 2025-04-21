import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import {
  faCalendarAlt,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function Event() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 3000 });
    fetchEvent();
  }, []);

  const fetchEvent = () => {
    axios
      .get("http://localhost:3000/api/event/get-all")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  return (
    <div className={cx("container", "py-5")} data-aos="fade-up">
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
          Our Events
        </h6>
        <h1 className={cx("mb-5")}>
          Explore Our{" "}
          <span className={cx("text-primary", "text-uppercase")}>Events</span>
        </h1>
      </div>
      <div className={cx("row")}>
        {events.map((event) => (
          <div key={event.EventId} className={cx("col-md-6", "mb-4")}>
            <div className={cx("card", "shadow-sm")}>
              <img
                src={event.EventImage}
                className={cx("card-img-top")}
                alt={event.EventName}
                referrerPolicy="no-referrer"
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                }}
              />
              <div className={cx("card-body")}>
                <h5 className={cx("card-title")}>{event.EventName}</h5>
                <p className={cx("text-muted")}>
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className={cx("me-2")}
                  />
                  {event.OrganizationDay}
                </p>
                <p className={cx("text-muted")}>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className={cx("me-2")}
                  />
                  {event.OrganizationLocation}
                </p>
                <p className={cx("card-text")}>{event.Description}</p>
                <Link
                  to={`/event-detail/${event.EventId}`}
                  className={cx("btn", "btn-primary", "p-2")}
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
