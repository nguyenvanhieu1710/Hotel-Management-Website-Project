import classNames from "classnames/bind";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import testimonialStyles from "./Testimonial.module.scss";
import TestimonialOne from "../../assets/img/testimonial-1.jpg";
import TestimonialTwo from "../../assets/img/testimonial-2.jpg";
import TestimonialThree from "../../assets/img/testimonial-3.jpg";

const cx = classNames.bind({
  ...bootstrapStyles,
  ...styles,
  ...testimonialStyles,
});

const responsive = {
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 992, min: 768 },
    items: 2,
  },
  desktop: {
    breakpoint: { max: 3000, min: 992 },
    items: 2,
  },
};

export default function Testimonial() {
  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  return (
    <div data-aos="zoom-in">
      {/* Testimonial Start */}
      <div
        className={cx(
          "container-xxl",
          "testimonial",
          "my-5",
          "py-5",
          "bg-dark",
          "wow",
          "zoomIn"
        )}
        data-wow-delay="0.1s"
      >
        <div className={cx("container")}>
          <Carousel
            responsive={responsive}
            autoPlay={true}
            infinite={true}
            autoPlaySpeed={3000}
            arrows={true}
            showDots={false}
            className={cx("testimonial-carousel", "py-5")}
          >
            <div
              className={cx(
                "testimonial-item",
                "position-relative",
                "bg-white",
                "rounded",
                "overflow-hidden"
              )}
            >
              <p>
                Tempor stet labore dolor clita stet diam amet ipsum dolor duo
                ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet
                est kasd kasd et erat magna eos
              </p>
              <div className={cx("d-flex", "align-items-center")}>
                <img
                  className={cx("img-fluid", "flex-shrink-0", "rounded")}
                  src={TestimonialOne}
                  style={{ width: "45px", height: "45px" }}
                  alt="Testimonial 1"
                />
                <div className={cx("ps-3")}>
                  <h6 className={cx("fw-bold", "mb-1")}>Client Name</h6>
                  <small>Profession</small>
                </div>
              </div>
            </div>
            <div
              className={cx(
                "testimonial-item",
                "position-relative",
                "bg-white",
                "rounded",
                "overflow-hidden"
              )}
            >
              <p>
                Tempor stet labore dolor clita stet diam amet ipsum dolor duo
                ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet
                est kasd kasd et erat magna eos
              </p>
              <div className={cx("d-flex", "align-items-center")}>
                <img
                  className={cx("img-fluid", "flex-shrink-0", "rounded")}
                  src={TestimonialTwo}
                  style={{ width: "45px", height: "45px" }}
                  alt="Testimonial 2"
                />
                <div className={cx("ps-3")}>
                  <h6 className={cx("fw-bold", "mb-1")}>Client Name</h6>
                  <small>Profession</small>
                </div>
              </div>
            </div>
            <div
              className={cx(
                "testimonial-item",
                "position-relative",
                "bg-white",
                "rounded",
                "overflow-hidden"
              )}
            >
              <p>
                Tempor stet labore dolor clita stet diam amet ipsum dolor duo
                ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet
                est kasd kasd et erat magna eos
              </p>
              <div className={cx("d-flex", "align-items-center")}>
                <img
                  className={cx("img-fluid", "flex-shrink-0", "rounded")}
                  src={TestimonialThree}
                  style={{ width: "45px", height: "45px" }}
                  alt="Testimonial 3"
                />
                <div className={cx("ps-3")}>
                  <h6 className={cx("fw-bold", "mb-1")}>Client Name</h6>
                  <small>Profession</small>
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
      {/* Testimonial End */}
    </div>
  );
}
