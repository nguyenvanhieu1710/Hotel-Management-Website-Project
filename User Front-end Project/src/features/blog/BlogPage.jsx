import Header from "../../components/Header/Header";
import PageHeader from "../../components/PageHeader/PageHeader";
import Blog from "./Blog";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";
import BackToTop from "../../components/BackToTop/BackToTop";

export default function BlogPage() {
  const pageHeaderProps = {
    title: "Blog",
  };
  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Blog />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
