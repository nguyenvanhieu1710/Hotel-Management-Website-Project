// import Spinner from "../Spinner/Spinner";
import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import BookingHistory from "../BookingHistory/BookingHistory";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

export default function Checkout() {
  const pageHeaderProps = {
    title: "Checkout",
  };
  return (
    <div>
      {/* <Spinner /> */}
      <Header />
      <PageHeader {...pageHeaderProps} />
      <BookingHistory />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
