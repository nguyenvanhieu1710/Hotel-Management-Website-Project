import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Booking from "../Booking/Booking";
import BookingForm from "../BookingForm/BookingForm";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

export default function BookingPage() {
  return (
    <div>
      <Header />
      <PageHeader />
      <Booking />
      <BookingForm />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
