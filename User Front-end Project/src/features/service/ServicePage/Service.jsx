import Header from "../../../components/Header/Header";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Booking from "../../../components/Booking/Booking";
import Service from "../../../components/Service/Service";
import Review from "../../../components/Review/Review";
import Newsletter from "../../../components/Newsletter/Newsletter";
import Footer from "../../../components/Footer/Footer";
import BackToTop from "../../../components/BackToTop/BackToTop";

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
