import Header from "../../components/Header/Header";
import PageHeader from "../../components/PageHeader/PageHeader";
import Search from "./Search";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";
import BackToTop from "../../components/BackToTop/BackToTop";

export default function SearchPage() {
  const pageHeaderProps = {
    title: "Search",
  };
  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Search />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
