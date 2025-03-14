import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Booking from "../Booking/Booking";
import ContactForm from "./ContactForm/ContactForm";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

export default function Contact() {
  return (
    <div>
      <Header />
      <PageHeader />
      <Booking />
      <ContactForm />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
