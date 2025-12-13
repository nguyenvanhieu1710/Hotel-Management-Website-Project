// import Spinner from "../Spinner/Spinner";
import Header from "../../../components/Header/Header";
import PageHeader from "../../../components/PageHeader/PageHeader";
import BookingHistory from "../BookingHistory/BookingHistory";
import Newsletter from "../../../components/Newsletter/Newsletter";
import Footer from "../../../components/Footer/Footer";
import BackToTop from "../../../components/BackToTop/BackToTop";

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
