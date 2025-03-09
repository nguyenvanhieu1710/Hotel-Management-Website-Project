// import Spinner from "../Spinner/Spinner";
import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Booking from "../Booking/Booking";
import AboutUs from "../AboutUs/AboutUs";
import Team from "../Team/Team";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";

export default function About() {
  return (
    <div>
      {/* <Spinner /> */}
      <Header />
      <PageHeader />
      <Booking />
      <AboutUs />
      <Team />
      <Newsletter />
      <Footer />
      {/* <!-- Back to Top --> */}
      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
        <i className="bi bi-arrow-up"></i>
      </a>
    </div>
  );
}
