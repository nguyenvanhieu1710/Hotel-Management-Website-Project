import { useState } from "react";
import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import bootstrapStyles from "../../../assets/css/bootstrap.module.css";
import styles from "../../../assets/css/style.module.css";
import videoStyles from "./Video.module.css";

const cx = classNames.bind({ ...bootstrapStyles, ...styles, ...videoStyles });

export default function Video() {
  const [showModal, setShowModal] = useState(false);

  const handlePlayClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  return (
    <div data-aos="zoom-in">
      <div
        className={cx("container-xxl", "py-5", "px-0", "wow", "zoomIn")}
        data-wow-delay="0.1s"
      >
        <div className={cx("row", "g-0")}>
          <div
            className={cx(
              "col-md-6",
              "bg-dark",
              "d-flex",
              "align-items-center"
            )}
          >
            <div className={cx("p-5")}>
              <h6
                className={cx(
                  "section-title",
                  "text-start",
                  "text-white",
                  "text-uppercase",
                  "mb-3"
                )}
              >
                Luxury Living
              </h6>
              <h1 className={cx("text-white", "mb-4")}>
                Discover A Brand Luxurious Hotel
              </h1>
              <p className={cx("text-white", "mb-4")}>
                Our hotel offers elegantly furnished rooms, fine dining
                experiences, and a range of premium amenities designed to cater
                to every need. With personalized service and attention to
                detail, we ensure your stay is both relaxing and unforgettable.
              </p>
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
          <div className={cx("col-md-6")}>
            <div className={cx("video")}>
              <button
                type="button"
                className={cx("btn-play")}
                onClick={handlePlayClick}
              >
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={cx("custom-modal")}>
          <div className={cx("custom-modal-content")}>
            <div className={cx("custom-modal-header")}>
              <h5>Youtube Video</h5>
              <button onClick={handleCloseModal}>X</button>
            </div>
            <div className={cx("custom-modal-body")}>
              <div className={cx("ratio", "ratio-16x9")}>
                <iframe
                  src="https://www.youtube.com/embed/N0hfJMjYluM?si=2tkj_wiLarzAzsD3?autoplay=1"
                  allow="autoplay"
                  allowFullScreen
                  title="Youtube Video"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
