import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Booking from "../Booking/Booking";
import BookingForm from "../BookingForm/BookingForm";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";

export default function BookingPage() {
  return (
    <div>
      <Header />
      <PageHeader />
      <Booking />
      <BookingForm />
      <Newsletter />
      <Footer />
    </div>
  );
}
