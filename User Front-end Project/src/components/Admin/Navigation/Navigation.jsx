import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHouseUser,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { faStickyNote } from "@fortawesome/free-regular-svg-icons";
import bootstrapStyles from "../../../assets/css/bootstrap-v4dot3dot1.module.css";
import styles from "../../../assets/css/admin.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

const Navigation = () => {
  return (
    <nav id="sidebar" className={cx("sidebar")}>
      <div className={cx("custom-menu")}>
        <button
          type="button"
          id="sidebarCollapse"
          className={cx("btn", "btn-primary")}
        >
          <FontAwesomeIcon icon={faChartLine} />
          <span className={cx("sr-only")}>Toggle Menu</span>
        </button>
      </div>
      <h1>
        <a href="/" className={cx("logo")}>
          Admin Panel
        </a>
      </h1>
      <ul className={cx("list-unstyled", "components", "mb-5", "list-item")}>
        <li>
          <Link to="/users">
            <FontAwesomeIcon icon={faUser} className={cx("mr-3")} />
            Users
          </Link>
        </li>
        <li>
          <Link to="/staff">
            <FontAwesomeIcon icon={faUser} className={cx("mr-3")} />
            Staffs
          </Link>
        </li>
        <li>
          <Link to="/rooms">
            <FontAwesomeIcon icon={faHouseUser} className={cx("mr-3")} />
            Rooms
          </Link>
        </li>
        <li>
          <Link to="/room-types">
            <FontAwesomeIcon icon={faHouseUser} className={cx("mr-3")} />
            Room Types
          </Link>
        </li>
        <li>
          <Link to="/service-types">
            <FontAwesomeIcon icon={faStickyNote} className={cx("mr-3")} />
            Service Types
          </Link>
        </li>
        <li>
          <Link to="/services">
            <FontAwesomeIcon icon={faStickyNote} className={cx("mr-3")} />
            Services
          </Link>
        </li>
        <li>
          <Link to="/service-tickets">
            <FontAwesomeIcon icon={faStickyNote} className={cx("mr-3")} />
            Service Tickets
          </Link>
        </li>
        <li>
          <Link to="/room-rentals">
            <FontAwesomeIcon icon={faStickyNote} className={cx("mr-3")} />
            Room Rentals
          </Link>
        </li>
        <li>
          <Link to="/room-bookings">
            <FontAwesomeIcon icon={faStickyNote} className={cx("mr-3")} />
            Room Bookings
          </Link>
        </li>
        <li>
          <Link to="/invoices">
            <FontAwesomeIcon icon={faStickyNote} className={cx("mr-3")} />
            Invoices
          </Link>
        </li>
        <li>
          <Link to="/statistics">
            <FontAwesomeIcon icon={faChartLine} className={cx("mr-3")} />
            Statistics
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
