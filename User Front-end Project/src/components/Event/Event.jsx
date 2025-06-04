import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "./Event.module.css";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faClock,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function Event() {
  const [events, setEvents] = useState([]);
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 });
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

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className={cx("event-container")} data-aos="fade-up">
      <div className={cx("event-header")}>
        <div className={cx("header-content")}>
          <h6 className={cx("section-subtitle")}>Upcoming Events</h6>
          <h2 className={cx("section-title")}>Discover Our Special Events</h2>
          <p className={cx("section-description")}>
            Join us for unforgettable experiences and create lasting memories
          </p>
        </div>
        <Button
          icon={isGridView ? "pi pi-list" : "pi pi-th-large"}
          className={cx("view-toggle-btn")}
          onClick={toggleView}
          tooltip={`Switch to ${isGridView ? "List" : "Grid"} View`}
          tooltipOptions={{ position: "bottom" }}
        />
      </div>

      <div className={cx("event-grid", { "list-view": !isGridView })}>
        {events.map((event) => (
          <div
            key={event.EventId}
            className={cx("event-card")}
            data-aos="fade-up"
          >
            <div className={cx("event-image")}>
              <img
                src={event.EventImage}
                alt={event.EventName}
                referrerPolicy="no-referrer"
              />
              <div className={cx("event-date")}>
                <span className={cx("date-day")}>
                  {new Date(event.OrganizationDay).getDate()}
                </span>
                <span className={cx("date-month")}>
                  {new Date(event.OrganizationDay).toLocaleString("default", {
                    month: "short",
                  })}
                </span>
              </div>
            </div>
            <div className={cx("event-content")}>
              <h3 className={cx("event-title")}>{event.EventName}</h3>
              <div className={cx("event-details")}>
                <div className={cx("detail-item")}>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>{formatDate(event.OrganizationDay)}</span>
                </div>
                <div className={cx("detail-item")}>
                  <FontAwesomeIcon icon={faClock} />
                  <span>7:00 PM - 10:00 PM</span>
                </div>
                <div className={cx("detail-item")}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>{event.OrganizationLocation}</span>
                </div>
                <div className={cx("detail-item")}>
                  <FontAwesomeIcon icon={faUsers} />
                  <span>Limited Seats</span>
                </div>
              </div>
              <p className={cx("event-description")}>{event.Description}</p>
              <div className={cx("event-footer")}>
                <Link
                  to={`/event-detail/${event.EventId}`}
                  className={cx("event-button")}
                >
                  Book Now
                </Link>
                <span className={cx("event-price")}>From $99</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
