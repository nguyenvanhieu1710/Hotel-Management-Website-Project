import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import Login from "./components/Login/Login.jsx";
import Payment from "./components/Home/Checkout/Checkout.jsx";
import About from "./components/AboutPage/About.jsx";
import BookingPage from "./components/BookingPage/Booking.jsx";
import Contact from "./components/ContactPage/Contact.jsx";
import Room from "./components/RoomPage/Room.jsx";
import Service from "./components/ServicePage/Service.jsx";
import Team from "./components/TeamPage/Team.jsx";
import Testimonial from "./components/TestimonialPage/Testimonial.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/room" element={<Room />} />
        <Route path="/service" element={<Service />} />
        <Route path="/team" element={<Team />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
