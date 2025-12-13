import { BrowserRouter, Routes, Route } from "react-router-dom";
import "primeicons/primeicons.css";

import Home from "./components/Home/Home.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import Login from "./features/auth/Login/Login.jsx";
import Register from "./features/auth/Register/Register.jsx";
import About from "./features/about/AboutPage/About.jsx";
import BookingPage from "./features/booking/BookingPage/Booking.jsx";
import Contact from "./components/ContactPage/Contact.jsx";
import Room from "./components/RoomPage/Room.jsx";
import RoomDetailPage from "./components/RoomDetailPage/RoomDetailPage.jsx";
import Service from "./features/service/ServicePage/Service.jsx";
import Review from "./components/ReviewPage/Review.jsx";
import Event from "./components/EventPage/Event.jsx";
import EventDetail from "./components/EventDetailPage/EventDetailPage.jsx";
import SearchPage from "./components/SearchPage/SearchPage.jsx";
import PromotionPage from "./components/PromotionPage/PromotionPage.jsx";
import BlogPage from "./components/BlogPage/BlogPage.jsx";
import ProfilePage from "./features/profile/ProfilePage/ProfilePage.jsx";
import Checkout from "./features/booking/Checkout/Checkout.jsx";
import TransportationPage from "./components/TransportationPage/TransportationPage.jsx";
import NotificationPage from "./components/NotificationPage/NotificationPage.jsx";
import FavouritePage from "./components/FavouritePage/FavouritePage.jsx";

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
        <Route path="/transportation" element={<TransportationPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/favourite" element={<FavouritePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
