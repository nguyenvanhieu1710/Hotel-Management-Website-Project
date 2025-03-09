import classNames from "classnames/bind";
import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import TestimonialOne from "../../assets/img/testimonial-1.jpg";
import TestimonialTwo from "../../assets/img/testimonial-2.jpg";
import TestimonialThree from "../../assets/img/testimonial-3.jpg";

const cx = classNames.bind({ ...bootstrapStyles, ...styles });

export default function Testimonial() {
  return (
    <div>
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
          <div className={cx("owl-carousel", "testimonial-carousel", "py-5")}>
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
              <FontAwesomeIcon
                icon={faQuoteRight}
                size="3x"
                className={cx(
                  "text-primary",
                  "position-absolute",
                  "end-0",
                  "bottom-0",
                  "me-4",
                  "mb-n1"
                )}
              />
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
              <FontAwesomeIcon
                icon={faQuoteRight}
                size="3x"
                className={cx(
                  "text-primary",
                  "position-absolute",
                  "end-0",
                  "bottom-0",
                  "me-4",
                  "mb-n1"
                )}
              />
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
              <FontAwesomeIcon
                icon={faQuoteRight}
                size="3x"
                className={cx(
                  "text-primary",
                  "position-absolute",
                  "end-0",
                  "bottom-0",
                  "me-4",
                  "mb-n1"
                )}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Testimonial End */}
    </div>
  );
}
