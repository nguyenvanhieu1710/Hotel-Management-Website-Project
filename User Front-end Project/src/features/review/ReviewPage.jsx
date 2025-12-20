import Header from "../../components/Header/Header";
import PageHeader from "../../components/PageHeader/PageHeader";
import ReviewForm from "./ReviewForm";
import Review from "./Review";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";
import BackToTop from "../../components/BackToTop/BackToTop";

export default function ReviewPage() {
  const pageHeaderProps = {
    title: "Reviews",
  };

  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <ReviewForm />
      <Review />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
