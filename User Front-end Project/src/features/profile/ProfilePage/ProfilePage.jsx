// import Spinner from "../Spinner/Spinner";
import Header from "../../../components/Header/Header";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Profile from "../Profile/Profile";
import Newsletter from "../../../components/Newsletter/Newsletter";
import Footer from "../../../components/Footer/Footer";
import BackToTop from "../../../components/BackToTop/BackToTop";

export default function ProfilePage() {
  const pageHeaderProps = {
    title: "Profile",
  };
  return (
    <div>
      {/* <Spinner /> */}
      <Header />
      <PageHeader {...pageHeaderProps} />
      <Profile />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
