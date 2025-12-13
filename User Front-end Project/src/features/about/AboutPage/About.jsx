// import Spinner from "../Spinner/Spinner";
import Header from "../../../components/Header/Header";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Booking from "../../../components/Booking/Booking";
import AboutUs from "../../../components/AboutUs/AboutUs";
import Newsletter from "../../../components/Newsletter/Newsletter";
import Footer from "../../../components/Footer/Footer";
import BackToTop from "../../../components/BackToTop/BackToTop";

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
