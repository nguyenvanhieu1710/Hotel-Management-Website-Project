import MainLayout from "../../layout/MainLayout";
import Carousel from "./components/Carousel";
import Booking from "../../components/Booking/Booking";
import AboutUs from "../../components/AboutUs/AboutUs";
import Room from "../../components/Room/Room";
import Video from "./components/Video";
import Service from "../../components/Service/Service";
import Review from "../review/Review";
import classNames from "classnames/bind";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function HomePage() {
  return (
    <MainLayout>
      <div className={cx("container-xxl", "bg-white", "p-0")}>
        <Carousel />
        <Booking />
        <AboutUs />
        <Room />
        <Video />
        <Service />
        <Review />
      </div>
    </MainLayout>
  );
}
