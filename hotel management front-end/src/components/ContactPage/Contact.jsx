import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Booking from "../Booking/Booking";
import ContactForm from "./ContactForm/ContactForm";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";

export default function Contact() {
  return (
    <div>
      <Header />
      <PageHeader />
      <Booking />
      <ContactForm />
      <Newsletter />
      <Footer />
    </div>
  );
}
