import { Routes, Route } from "react-router-dom";
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

const Content = () => {
  return (
    <div id="content" className="p-4 p-md-5 pt-5">
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
      </Routes>
    </div>
  );
};

export default Content;
