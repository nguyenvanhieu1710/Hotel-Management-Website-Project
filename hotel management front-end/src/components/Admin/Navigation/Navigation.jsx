import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHouseUser,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { faStickyNote } from "@fortawesome/free-regular-svg-icons";

const Navigation = () => {
  return (
    <nav id="sidebar">
      <div className="custom-menu">
        <button type="button" id="sidebarCollapse" className="btn btn-primary">
          <FontAwesomeIcon icon={faChartLine} />
          <span className="sr-only">Toggle Menu</span>
        </button>
      </div>
      <h1>
        <a href="/" className="logo">
          Admin Panel
        </a>
      </h1>
      <ul className="list-unstyled components mb-5 list-item">
        <li>
          <Link to="/users">
            <FontAwesomeIcon icon={faUser} className="mr-3" />
            Khách hàng
          </Link>
        </li>
        <li>
          <Link to="/staff">
            <FontAwesomeIcon icon={faUser} className="mr-3" />
            Nhân viên
          </Link>
        </li>
        <li>
          <Link to="/rooms">
            <FontAwesomeIcon icon={faHouseUser} className="mr-3" />
            Phòng
          </Link>
        </li>
        <li>
          <Link to="/room-types">
            <FontAwesomeIcon icon={faHouseUser} className="mr-3" />
            Loại phòng
          </Link>
        </li>
        <li>
          <Link to="/service-types">
            <FontAwesomeIcon icon={faStickyNote} className="mr-3" />
            Loại dịch vụ
          </Link>
        </li>
        <li>
          <Link to="/services">
            <FontAwesomeIcon icon={faStickyNote} className="mr-3" />
            Dịch vụ
          </Link>
        </li>
        <li>
          <Link to="/service-tickets">
            <FontAwesomeIcon icon={faStickyNote} className="mr-3" />
            Phiếu dịch vụ
          </Link>
        </li>
        <li>
          <Link to="/room-rentals">
            <FontAwesomeIcon icon={faStickyNote} className="mr-3" />
            Phiếu thuê phòng
          </Link>
        </li>
        <li>
          <Link to="/room-bookings">
            <FontAwesomeIcon icon={faStickyNote} className="mr-3" />
            Phiếu đặt phòng
          </Link>
        </li>
        <li>
          <Link to="/invoices">
            <FontAwesomeIcon icon={faStickyNote} className="mr-3" />
            Hóa đơn
          </Link>
        </li>
        <li>
          <Link to="/statistics">
            <FontAwesomeIcon icon={faChartLine} className="mr-3" />
            Thống kê
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
