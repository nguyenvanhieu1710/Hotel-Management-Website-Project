import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Booking from "../Booking/Booking";
import Room from "../Room/Room";
import Review from "../Review/Review";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

export default function RoomPage() {
  const pageHeaderProps = {
    title: "Rooms",
  };

  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Booking />
      <Room />
      <Review />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
