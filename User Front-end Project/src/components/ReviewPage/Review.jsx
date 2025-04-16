import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import ReviewForm from "../ReviewForm/ReviewForm";
import Review from "../Review/Review";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

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
