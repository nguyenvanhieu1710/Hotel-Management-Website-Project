import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Booking from "../Booking/Booking";
import Testimonial from "../Testimonial/Testimonial";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

export default function TestimonialPage() {
  const pageHeaderProps = {
    title: "Testimonial",
  };

  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Booking />
      <Testimonial />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
