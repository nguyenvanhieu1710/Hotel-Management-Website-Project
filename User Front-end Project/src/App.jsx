import { BrowserRouter, Routes, Route } from "react-router-dom";
import "primeicons/primeicons.css";

import Home from "./components/Home/Home.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import About from "./components/AboutPage/About.jsx";
import BookingPage from "./components/BookingPage/Booking.jsx";
import Contact from "./components/ContactPage/Contact.jsx";
import Room from "./components/RoomPage/Room.jsx";
import RoomDetailPage from "./components/RoomDetailPage/RoomDetailPage.jsx";
import Service from "./components/ServicePage/Service.jsx";
import Review from "./components/ReviewPage/Review.jsx";
import Event from "./components/EventPage/Event.jsx";
import EventDetail from "./components/EventDetailPage/EventDetailPage.jsx";
import SearchPage from "./components/SearchPage/SearchPage.jsx";
import PromotionPage from "./components/PromotionPage/PromotionPage.jsx";
import BlogPage from "./components/BlogPage/BlogPage.jsx";
import ProfilePage from "./components/ProfilePage/ProfilePage.jsx";
import Checkout from "./components/Checkout/Checkout.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/room" element={<Room />} />
        <Route path="/room-detail/:id" element={<RoomDetailPage />} />
        <Route path="/service" element={<Service />} />
        <Route path="/review" element={<Review />} />
        <Route path="/event" element={<Event />} />
        <Route path="/event-detail/:id" element={<EventDetail />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/promotion" element={<PromotionPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
