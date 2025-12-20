import Header from "../../components/Header/Header";
import PageHeader from "../../components/PageHeader/PageHeader";
import Notification from "./Notification";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";
import BackToTop from "../../components/BackToTop/BackToTop";

export default function NotificationPage() {
  const pageHeaderProps = {
    title: "Notification",
  };
  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Notification />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
