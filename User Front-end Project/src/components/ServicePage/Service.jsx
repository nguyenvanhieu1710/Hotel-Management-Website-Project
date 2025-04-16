import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Booking from "../Booking/Booking";
import Service from "../Service/Service";
import Review from "../Review/Review";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

export default function ServicePage() {
  const pageHeaderProps = {
    title: "Services",
  };

  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Booking />
      <Service />
      <Review />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
