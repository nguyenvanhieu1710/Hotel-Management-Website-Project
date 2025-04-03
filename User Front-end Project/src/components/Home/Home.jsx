import classNames from "classnames/bind";

// import Spinner from "../Spinner/Spinner";
import Header from "../Header/Header";
import Carousel from "./Carousel/Carousel";
import Booking from "../Booking/Booking";
import AboutUs from "../AboutUs/AboutUs";
import Room from "../Room/Room";
import Video from "./Video/Video";
import Service from "../Service/Service";
import Testimonial from "../Testimonial/Testimonial";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function Home() {
  return (
    <div className={cx("container-xxl", "bg-white", "p-0")}>
      {/* <Spinner /> */}
      <Header />
      <Carousel />
      <Booking />
      <AboutUs />
      <Room />
      <Video />
      <Service />
      <Testimonial />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
