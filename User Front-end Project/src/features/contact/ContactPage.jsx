import Header from "../../components/Header/Header";
import PageHeader from "../../components/PageHeader/PageHeader";
import Booking from "../../components/Booking/Booking";
import ContactForm from "./ContactForm";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";
import BackToTop from "../../components/BackToTop/BackToTop";

export default function ContactPage() {
  const pageHeaderProps = {
    title: "Contact Us",
  };

  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Booking />
      <ContactForm />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
