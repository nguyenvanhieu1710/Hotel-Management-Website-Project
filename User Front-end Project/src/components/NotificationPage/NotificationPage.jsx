// import Spinner from "../Spinner/Spinner";
import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Notification from "../Notification/Notification";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

export default function NotificationPage() {
  const pageHeaderProps = {
    title: "Notification",
  };
  return (
    <div>
      {/* <Spinner /> */}
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Notification />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
