// import Spinner from "../Spinner/Spinner";
import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
import Profile from "../Profile/Profile";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

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
