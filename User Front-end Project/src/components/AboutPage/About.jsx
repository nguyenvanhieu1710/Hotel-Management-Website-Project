// import Spinner from "../Spinner/Spinner";
import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Booking from "../Booking/Booking";
import AboutUs from "../AboutUs/AboutUs";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

export default function About() {
  const pageHeaderProps = {
    title: "About Us",
  };

  return (
    <div>
      {/* <Spinner /> */}
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Booking />
      <AboutUs />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
