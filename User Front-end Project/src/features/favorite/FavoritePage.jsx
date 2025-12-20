import Header from "../../components/Header/Header";
import PageHeader from "../../components/PageHeader/PageHeader";
import Favorite from "./Favorite";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";
import BackToTop from "../../components/BackToTop/BackToTop";

export default function FavoritePage() {
  const pageHeaderProps = {
    title: "Favorite",
  };

  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Favorite />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
