import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import RoomDetail from "../RoomDetail/RoomDetail";
import Review from "../Review/Review";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

export default function RoomDetailPage() {
  const pageHeaderProps = {
    title: "Room Details",
  };
  return (
    <div>
      <Header />
      <PageHeader {...pageHeaderProps} />
      <RoomDetail />
      <Review />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
