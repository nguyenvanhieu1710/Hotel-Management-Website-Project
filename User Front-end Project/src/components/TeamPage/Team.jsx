import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Booking from "../Booking/Booking";
import Team from "../Team/Team";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

export default function TeamPage() {
  const pageHeaderProps = {
    title: "Our Team",
  };

  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Booking />
      <Team />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
