import Header from "../../components/Header/Header";
import PageHeader from "../../components/PageHeader/PageHeader";
import Promotion from "./Promotion";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";
import BackToTop from "../../components/BackToTop/BackToTop";

const PromotionPage = () => {
  const pageHeaderProps = {
    title: "Promotion",
  };
  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Promotion />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default PromotionPage;
