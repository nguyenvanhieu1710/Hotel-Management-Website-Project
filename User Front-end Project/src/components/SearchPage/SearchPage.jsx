// import Spinner from "../Spinner/Spinner";
import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
// import Booking from "../Booking/Booking";
import Search from "../Search/Search";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

export default function SearchPage() {
  const pageHeaderProps = {
    title: "Search",
  };
  return (
    <div>
      {/* <Spinner /> */}
      <Header />
      <PageHeader {...pageHeaderProps} />
      {/* <Booking /> */}
      <Search />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
