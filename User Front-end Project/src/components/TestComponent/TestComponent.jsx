import classNames from "classnames/bind";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "./Test.module.css";

import postOneImage from "../../assets/img/post1.jpg";
import postTwoImage from "../../assets/img/post2.jpg";
import postThreeImage from "../../assets/img/post3.jpg";
import postFourImage from "../../assets/img/post4.jpg";
import postFiveImage from "../../assets/img/post5.jpg";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function TestComponent() {
  return (
    <section id="blog" className={cx("padding-medium", "pt-0")}>
      <div className={cx("container-fluid", "padding-side")} data-aos="fade-up">
        <div
          className={cx(
            "d-flex",
            "flex-wrap",
            "align-items-center",
            "justify-content-between"
          )}
        >
          <div>
            <h3 className={cx("display-3", "fw-normal", "text-center")}>
              Our Blogs
            </h3>
          </div>
          <a
            href="index.html"
            className={cx("btn", "btn-arrow", "btn-primary", "mt-3")}
          >
            <span>
              More Blog
              <svg width="18" height="18">
                <use xlinkHref="#arrow-right"></use>
              </svg>
            </span>
          </a>
        </div>
        <div className={cx("row", "mt-5")}>
          <div className={cx("col-md-6", "col-lg-4", "mb-4")}>
            <div
              className={cx(
                "blog-post",
                "position-relative",
                "overflow-hidden",
                "rounded-4"
              )}
            >
              <img
                src={postThreeImage}
                className={cx("blog-img", "img-fluid", "rounded-4")}
                alt="img"
              />
              <div className={cx("position-absolute", "bottom-0", "p-5")}>
                <a href="#">
                  <span
                    className={cx(
                      "bg-secondary",
                      "text-body",
                      "m-0",
                      "px-2",
                      "py-1",
                      "rounded-2",
                      "fs-6"
                    )}
                  >
                    Hotels
                  </span>
                </a>
                <h4 className={cx("display-6", "fw-normal", "mt-2")}>
                  <a href="index.html">
                    A Day in the Life of a Hotel Mellow Guest
                  </a>
                </h4>
                <p className={cx("m-0", "align-items-center")}>
                  <svg width="19" height="19">
                    <use xlinkHref="#clock"></use>
                  </svg>{" "}
                  22 Feb, 2024
                </p>
              </div>
            </div>
          </div>
          <div className={cx("col-md-6", "col-lg-4", "mb-4")}>
            <div
              className={cx(
                "blog-post",
                "position-relative",
                "overflow-hidden",
                "rounded-4"
              )}
            >
              <img
                src={postTwoImage}
                className={cx("blog-img", "img-fluid", "rounded-4")}
                alt="img"
              />
              <div className={cx("position-absolute", "bottom-0", "p-5")}>
                <a href="#">
                  <span
                    className={cx(
                      "bg-secondary",
                      "text-body",
                      "m-0",
                      "px-2",
                      "py-1",
                      "rounded-2",
                      "fs-6"
                    )}
                  >
                    Activites
                  </span>
                </a>
                <h4 className={cx("display-6", "fw-normal", "mt-2")}>
                  <a href="index.html">
                    Guide to Seasonal Activities in the City
                  </a>
                </h4>
                <p className={cx("m-0", "align-items-center")}>
                  <svg width="19" height="19">
                    <use xlinkHref="#clock"></use>
                  </svg>{" "}
                  22 Feb, 2024
                </p>
              </div>
            </div>
          </div>
          <div className={cx("col-md-6", "col-lg-4", "mb-4")}>
            <div
              className={cx(
                "blog-post",
                "position-relative",
                "overflow-hidden",
                "rounded-4"
              )}
            >
              <img
                src={postOneImage}
                className={cx("blog-img", "img-fluid", "rounded-4")}
                alt="img"
              />
              <div className={cx("position-absolute", "bottom-0", "p-5")}>
                <a href="#">
                  <span
                    className={cx(
                      "bg-secondary",
                      "text-body",
                      "m-0",
                      "px-2",
                      "py-1",
                      "rounded-2",
                      "fs-6"
                    )}
                  >
                    Rooms
                  </span>
                </a>
                <h4 className={cx("display-6", "fw-normal", "mt-2")}>
                  <a href="index.html">A Look Inside Hotel Mellows Suites</a>
                </h4>
                <p className={cx("m-0", "align-items-center")}>
                  <svg width="19" height="19">
                    <use xlinkHref="#clock"></use>
                  </svg>{" "}
                  22 Feb, 2024
                </p>
              </div>
            </div>
          </div>
          <div className={cx("col-md-6", "col-lg-8", "mb-4")}>
            <div
              className={cx(
                "blog-post",
                "position-relative",
                "overflow-hidden",
                "rounded-4"
              )}
            >
              <img
                src={postFiveImage}
                className={cx("blog-img", "img-fluid", "rounded-4")}
                alt="img"
              />
              <div className={cx("position-absolute", "bottom-0", "p-4")}>
                <a href="#">
                  <span
                    className={cx(
                      "bg-secondary",
                      "text-body",
                      "m-0",
                      "px-2",
                      "py-1",
                      "rounded-2",
                      "fs-6"
                    )}
                  >
                    Activites
                  </span>
                </a>
                <h4 className={cx("display-6", "fw-normal", "mt-2")}>
                  <a href="index.html">
                    Why Hotel Mellow Is the Perfect Staycation Destination
                  </a>
                </h4>
                <p className={cx("m-0", "align-items-center")}>
                  <svg width="19" height="19">
                    <use xlinkHref="#clock"></use>
                  </svg>{" "}
                  22 Feb, 2024
                </p>
              </div>
            </div>
          </div>
          <div className={cx("col-md-6", "col-lg-4", "mb-4")}>
            <div
              className={cx(
                "blog-post",
                "position-relative",
                "overflow-hidden",
                "rounded-4"
              )}
            >
              <img
                src={postFourImage}
                className={cx("blog-img", "img-fluid", "rounded-4")}
                alt="img"
              />
              <div className={cx("position-absolute", "bottom-0", "p-5")}>
                <a href="#">
                  <span
                    className={cx(
                      "bg-secondary",
                      "text-body",
                      "m-0",
                      "px-2",
                      "py-1",
                      "rounded-2",
                      "fs-6"
                    )}
                  >
                    Rooms
                  </span>
                </a>
                <h4 className={cx("display-6", "fw-normal", "mt-2")}>
                  <a href="index.html">
                    The Benefits of Booking Directly with Hotel Mellow
                  </a>
                </h4>
                <p className={cx("m-0", "align-items-center")}>
                  <svg width="19" height="19">
                    <use xlinkHref="#clock"></use>
                  </svg>{" "}
                  22 Feb, 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
