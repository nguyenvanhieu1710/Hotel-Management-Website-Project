import { Routes, Route } from "react-router-dom";
import classNames from "classnames/bind";

import Users from "./Users/Users.jsx";
import Staff from "./Staff/Staff.jsx";
import Rooms from "./Rooms/Rooms.jsx";
import RoomTypes from "./RoomTypes/RoomTypes.jsx";
import ServiceTypes from "./ServiceTypes/ServiceTypes.jsx";
import Services from "./Services/Services.jsx";
import ServiceTickets from "./ServiceTickets/ServiceTickets.jsx";
import RoomRentals from "./RoomRentals/RoomRentals.jsx";
import RoomBookings from "./RoomBookings/RoomBookings.jsx";
import Invoices from "./Invoices/Invoices.jsx";
import Statistics from "./Statistics/Statistics.jsx";
import EventType from "./EventType/EventType.jsx";
import bootstrapStyles from "../../../assets/css/bootstrap-v4dot3dot1.module.css";
import styles from "../../../assets/css/admin.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

const Content = () => {
  return (
    <div id="content" className={cx("p-4", "p-md-5", "pt-5")}>
      <Routes>
        <Route path="/" element={<h2>Welcome to Admin Panel</h2>} />
        <Route path="/users" element={<Users />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room-types" element={<RoomTypes />} />
        <Route path="/service-types" element={<ServiceTypes />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service-tickets" element={<ServiceTickets />} />
        <Route path="/room-rentals" element={<RoomRentals />} />
        <Route path="/room-bookings" element={<RoomBookings />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/event-types" element={<EventType />} />
      </Routes>
    </div>
  );
};

export default Content;
