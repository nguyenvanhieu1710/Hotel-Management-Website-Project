import Header from "../../../components/Header/Header";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Booking from "../../../components/Booking/Booking";
import BookingForm from "../BookingForm/BookingForm";
import Newsletter from "../../../components/Newsletter/Newsletter";
import Footer from "../../../components/Footer/Footer";
import BackToTop from "../../../components/BackToTop/BackToTop";

export default function BookingPage() {
  const pageHeaderProps = {
    title: "Booking",
  };

  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Booking />
      <BookingForm />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
