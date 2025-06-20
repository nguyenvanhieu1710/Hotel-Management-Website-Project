// import Spinner from "../Spinner/Spinner";
import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Transportation from "../Transportation/Transportation";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

export default function TransportationPage() {
  const pageHeaderProps = {
    title: "Transportation",
  };
  return (
    <div>
      {/* <Spinner /> */}
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Transportation />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
