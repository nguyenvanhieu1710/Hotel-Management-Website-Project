// import Spinner from "../Spinner/Spinner";
import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Blog from "../Blog/Blog";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

export default function BlogPage() {
  const pageHeaderProps = {
    title: "Blog",
  };
  return (
    <div>
      {/* <Spinner /> */}
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Blog />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
