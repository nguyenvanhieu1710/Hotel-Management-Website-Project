import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

import oneCarouselImage from "../../../assets/img/carousel-1.jpg";
import twoCarouselImage from "../../../assets/img/carousel-2.jpg";
import bootstrapStyles from "../../../assets/css/bootstrap.module.css";
import styles from "../../../assets/css/style.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export default function CarouselComponent() {
  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  };

  const captionStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    width: "100%",
    backgroundColor: "transparent",
    zIndex: 2,
  };

  return (
    <div>
      {/* <!-- Carousel Start --> */}
      <div className={cx("container-fluid", "p-0", "mb-5")}>
        <style>
          {`
            .react-multiple-carousel__arrow {
              z-index: 10;
            }
          `}
        </style>
        <Carousel
          responsive={responsive}
          autoPlay={true}
          autoPlaySpeed={3000}
          infinite={true}
          arrows={true}
          showDots={true}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          <div style={{ position: "relative" }}>
            <img
              className={cx("w-100")}
              src={oneCarouselImage}
              alt="Carousel 1"
            />
            <div style={overlayStyle}></div>
            <div
              className={cx("carousel-caption", "d-flex", "flex-column")}
              style={captionStyle}
            >
              <div
                className={cx("p-3")}
                style={{ maxWidth: "700px", margin: "0 auto" }}
              >
                <h6
                  data-aos="fade-down"
                  className={cx(
                    "section-title",
                    "text-white",
                    "text-uppercase",
                    "mb-3"
                  )}
                >
                  Luxury Living
                </h6>
                <h1
                  className={cx("display-3", "text-white", "mb-4")}
                  data-aos="fade-down"
                >
                  Discover A Brand Luxurious Hotel
                </h1>
                <Link
                  // data-aos="fade-right"
                  to="/room"
                  className={cx(
                    "btn",
                    "btn-primary",
                    "py-md-3",
                    "px-md-5",
                    "me-3"
                  )}
                >
                  Our Rooms
                </Link>
                <Link
                  // data-aos="fade-left"
                  to="booking"
                  className={cx("btn", "btn-light", "py-md-3", "px-md-5")}
                >
                  Book A Room
                </Link>
              </div>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <img
              className={cx("w-100")}
              src={twoCarouselImage}
              alt="Carousel 2"
            />
            <div style={overlayStyle}></div>
            <div
              className={cx("carousel-caption", "d-flex", "flex-column")}
              style={captionStyle}
            >
              <div
                className={cx("p-3")}
                style={{ maxWidth: "700px", margin: "0 auto" }}
              >
                <h6
                  className={cx(
                    "section-title",
                    "text-white",
                    "text-uppercase",
                    "mb-3"
                  )}
                >
                  Luxury Living
                </h6>
                <h1 className={cx("display-3", "text-white", "mb-4")}>
                  Experience peak luxury
                </h1>
                <Link
                  to="/room"
                  className={cx(
                    "btn",
                    "btn-primary",
                    "py-md-3",
                    "px-md-5",
                    "me-3"
                  )}
                >
                  Our Rooms
                </Link>
                <Link
                  to="/booking"
                  className={cx("btn", "btn-light", "py-md-3", "px-md-5")}
                >
                  Book A Room
                </Link>
              </div>
            </div>
          </div>
        </Carousel>
      </div>
      {/* <!-- Carousel End --> */}
    </div>
  );
}
