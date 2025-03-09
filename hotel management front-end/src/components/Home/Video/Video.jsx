import classNames from "classnames/bind";

import bootstrapStyles from "../../../assets/css/bootstrap.module.css";
import styles from "../../../assets/css/style.module.css";

const cx = classNames.bind({ ...bootstrapStyles, ...styles });

export default function Video() {
  return (
    <div>
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
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit,
                sed stet lorem sit clita duo justo magna dolore erat amet
              </p>
              <a
                href=""
                className={cx(
                  "btn",
                  "btn-primary",
                  "py-md-3",
                  "px-md-5",
                  "me-3"
                )}
              >
                Our Rooms
              </a>
              <a
                href=""
                className={cx("btn", "btn-light", "py-md-3", "px-md-5")}
              >
                Book A Room
              </a>
            </div>
          </div>
          <div className={cx("col-md-6")}>
            <div className={cx("video")}>
              <button
                type="button"
                className={cx("btn-play")}
                data-bs-toggle="modal"
                data-src="https://www.youtube.com/embed/oZ_N6Hqa6WA?si=pLCEPBqhfPPLnZG_"
                data-bs-target="#videoModal"
              >
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cx("modal", "fade")}
        id="videoModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className={cx("modal-dialog")}>
          <div className={cx("modal-content", "rounded-0")}>
            <div className={cx("modal-header")}>
              <h5 className={cx("modal-title")} id="exampleModalLabel">
                Youtube Video
              </h5>
              <button
                type="button"
                className={cx("btn-close")}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className={cx("modal-body")}>
              <div className={cx("ratio", "ratio-16x9")}>
                <iframe
                  className={cx("embed-responsive-item")}
                  src=""
                  id="video"
                  allowFullScreen
                  allow="autoplay"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
