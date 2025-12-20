import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import "primeicons/primeicons.css";

import Home from "./features/home/HomePage.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import Login from "./features/auth/Login/Login.jsx";
import Register from "./features/auth/Register/Register.jsx";
import About from "./features/about/AboutPage/About.jsx";
import BookingPage from "./features/booking/BookingPage/Booking.jsx";
import Contact from "./features/contact/ContactPage.jsx";
import Room from "./features/room/RoomListPage.jsx";
import RoomDetailPage from "./components/RoomDetailPage/RoomDetailPage.jsx";
import Service from "./features/service/ServicePage/Service.jsx";
import Review from "./features/review/ReviewPage.jsx";
import Event from "./features/event/EventListPage.jsx";
import EventDetail from "./components/EventDetailPage/EventDetailPage.jsx";
import SearchPage from "./features/search/SearchPage.jsx";
import PromotionPage from "./features/promotion/PromotionPage.jsx";
import BlogPage from "./features/blog/BlogPage.jsx";
import ProfilePage from "./features/profile/ProfilePage/ProfilePage.jsx";
import Checkout from "./features/booking/Checkout/Checkout.jsx";
import TransportationPage from "./features/transportation/TransportationPage.jsx";
import NotificationPage from "./features/notification/NotificationPage.jsx";
import FavouritePage from "./features/favorite/FavoritePage.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
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
          <Route path="/transportation" element={<TransportationPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification"
            element={
              <ProtectedRoute>
                <NotificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favourite"
            element={
              <ProtectedRoute>
                <FavouritePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
