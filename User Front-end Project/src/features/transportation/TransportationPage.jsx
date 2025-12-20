import Header from "../../components/Header/Header";
import PageHeader from "../../components/PageHeader/PageHeader";
import Transportation from "./Transportation";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";
import BackToTop from "../../components/BackToTop/BackToTop";

export default function TransportationPage() {
  const pageHeaderProps = {
    title: "Transportation",
  };
  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Transportation />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
