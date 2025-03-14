import classNames from "classnames/bind";

import oneCarouselImage from "../../../assets/img/carousel-1.jpg";
import twoCarouselImage from "../../../assets/img/carousel-2.jpg";
import bootstrapStyles from "../../../assets/css/bootstrap.module.css";
import styles from "../../../assets/css/style.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function Carousel() {
  return (
    <div>
      {/* <!-- Carousel Start --> */}
      <div className={cx("container-fluid", "p-0", "mb-5")}>
        <div
          id="header-carousel"
          className={cx("carousel", "slide")}
          data-bs-ride="carousel"
        >
          <div className={cx("carousel-inner")}>
            <div className={cx("carousel-item", "active")}>
              <img className={cx("w-100")} src={oneCarouselImage} alt="Image" />
              <div
                className={cx(
                  "carousel-caption",
                  "d-flex",
                  "flex-column",
                  "align-items-center",
                  "justify-content-center"
                )}
              >
                <div className={cx("p-3")} style={{ maxWidth: "700px" }}>
                  <h6
                    className={cx(
                      "section-title",
                      "text-white",
                      "text-uppercase",
                      "mb-3",
                      "animated",
                      "slideInDown"
                    )}
                  >
                    Luxury Living
                  </h6>
                  <h1
                    className={cx(
                      "display-3",
                      "text-white",
                      "mb-4",
                      "animated",
                      "slideInDown"
                    )}
                  >
                    Discover A Brand Luxurious Hotel
                  </h1>
                  <a
                    href=""
                    className={cx(
                      "btn",
                      "btn-primary",
                      "py-md-3",
                      "px-md-5",
                      "me-3",
                      "animated",
                      "slideInLeft"
                    )}
                  >
                    Our Rooms
                  </a>
                  <a
                    href=""
                    className={cx(
                      "btn",
                      "btn-light",
                      "py-md-3",
                      "px-md-5",
                      "animated",
                      "slideInRight"
                    )}
                  >
                    Book A Room
                  </a>
                </div>
              </div>
            </div>
            <div className={cx("carousel-item")}>
              <img className={cx("w-100")} src={twoCarouselImage} alt="Image" />
              <div
                className={cx(
                  "carousel-caption",
                  "d-flex",
                  "flex-column",
                  "align-items-center",
                  "justify-content-center"
                )}
              >
                <div className={cx("p-3")} style={{ maxWidth: "700px" }}>
                  <h6
                    className={cx(
                      "section-title",
                      "text-white",
                      "text-uppercase",
                      "mb-3",
                      "animated",
                      "slideInDown"
                    )}
                  >
                    Luxury Living
                  </h6>
                  <h1
                    className={cx(
                      "display-3",
                      "text-white",
                      "mb-4",
                      "animated",
                      "slideInDown"
                    )}
                  >
                    Discover A Brand Luxurious Hotel
                  </h1>
                  <a
                    href=""
                    className={cx(
                      "btn",
                      "btn-primary",
                      "py-md-3",
                      "px-md-5",
                      "me-3",
                      "animated",
                      "slideInLeft"
                    )}
                  >
                    Our Rooms
                  </a>
                  <a
                    href=""
                    className={cx(
                      "btn",
                      "btn-light",
                      "py-md-3",
                      "px-md-5",
                      "animated",
                      "slideInRight"
                    )}
                  >
                    Book A Room
                  </a>
                </div>
              </div>
            </div>
          </div>
          <button
            className={cx("carousel-control-prev")}
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="prev"
          >
            <span
              className={cx("carousel-control-prev-icon")}
              aria-hidden="true"
            ></span>
            <span className={cx("visually-hidden")}>Previous</span>
          </button>
          <button
            className={cx("carousel-control-next")}
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="next"
          >
            <span
              className={cx("carousel-control-next-icon")}
              aria-hidden="true"
            ></span>
            <span className={cx("visually-hidden")}>Next</span>
          </button>
        </div>
      </div>
      {/* <!-- Carousel End --> */}
    </div>
  );
}
