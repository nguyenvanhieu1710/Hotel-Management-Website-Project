import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Favourite from "../Favourite/Favourite";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

export default function FavouritePage() {
  const pageHeaderProps = {
    title: "Favourite",
  };

  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Favourite />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
