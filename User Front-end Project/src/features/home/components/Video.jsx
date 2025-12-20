import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";

import bootstrapStyles from "../../../assets/css/bootstrap.module.css";
import styles from "../../../assets/css/style.module.css";

const cx = classNames.bind({ ...bootstrapStyles, ...styles });

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

  const videoStyles = {
    video: {
      position: "relative",
      height: "100%",
      minHeight: "500px",
      background:
        'linear-gradient(rgba(15, 23, 43, .7), rgba(15, 23, 43, .7)), url("../../../assets/img/video.jpg")',
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    btnPlay: {
      position: "relative",
      display: "block",
      boxSizing: "content-box",
      width: "32px",
      height: "44px",
      borderRadius: "50%",
      border: "none",
      outline: "none !important",
      padding: "18px 20px 18px 28px",
      background: "#fea116",
      cursor: "pointer",
    },
    customModal: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    },
    customModalContent: {
      backgroundColor: "white",
      borderRadius: "8px",
      width: "90%",
      maxWidth: "800px",
      maxHeight: "90%",
      overflow: "hidden",
    },
    customModalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem",
      borderBottom: "1px solid #dee2e6",
    },
    customModalBody: {
      padding: "1rem",
    },
  };

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
            <div style={videoStyles.video}>
              <button
                type="button"
                style={videoStyles.btnPlay}
                onClick={handlePlayClick}
              >
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={videoStyles.customModal}>
          <div style={videoStyles.customModalContent}>
            <div style={videoStyles.customModalHeader}>
              <h5>Youtube Video</h5>
              <button
                onClick={handleCloseModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
            <div style={videoStyles.customModalBody}>
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
