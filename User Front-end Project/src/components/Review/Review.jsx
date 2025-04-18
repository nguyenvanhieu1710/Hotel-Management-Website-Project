import classNames from "classnames/bind";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useState, useEffect } from "react";
import axios from "axios";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import reviewStyles from "./Review.module.scss";

const cx = classNames.bind({
  ...bootstrapStyles,
  ...styles,
  ...reviewStyles,
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

export default function Review() {
  const [evaluations, setEvaluations] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 3000 });
    // console.log("useEffect running...");
    fetchUsers();
    fetchEvaluations();
    // console.log("useEffect finished...");
  }, []);

  const fetchEvaluations = () => {
    axios
      .get("http://localhost:3000/api/evaluation")
      .then((response) => {
        setEvaluations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching evaluations:", error);
      });
  };

  const fetchUsers = () => {
    axios
      .get("http://localhost:3000/api/user/get-all")
      .then((response) => setUsers(response.data))
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  return (
    <div data-aos="zoom-in">
      {/* Review Start */}
      <div
        className={cx(
          "container-xxl",
          "review",
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
            className={cx("review-carousel", "py-5")}
          >
            {evaluations.map((evaluation) => {
              const user = users.find((u) => u.UserId === evaluation.UserId);
              return (
                user && (
                  <div
                    key={evaluation.EvaluationId}
                    className={cx(
                      "review-item",
                      "position-relative",
                      "bg-white",
                      "rounded",
                      "overflow-hidden"
                    )}
                  >
                    <p>{evaluation.Comment}</p>
                    <div className={cx("d-flex", "align-items-center")}>
                      <img
                        className={cx("img-fluid", "flex-shrink-0", "rounded")}
                        src={user.UserImage || "default-avatar.png"}
                        style={{ width: "45px", height: "45px" }}
                        alt="Review 1"
                      />
                      <div className={cx("ps-3")}>
                        <h6 className={cx("fw-bold", "mb-1")}>
                          {user.UserName || "Unknown"}
                        </h6>
                        <small>{user.Gender || "Male"}</small>
                      </div>
                    </div>
                  </div>
                )
              );
            })}
            {/* <div
              className={cx(
                "review-item",
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
                  src={ReviewOne}
                  style={{ width: "45px", height: "45px" }}
                  alt="Review 1"
                />
                <div className={cx("ps-3")}>
                  <h6 className={cx("fw-bold", "mb-1")}>Client Name</h6>
                  <small>Profession</small>
                </div>
              </div>
            </div>
            <div
              className={cx(
                "review-item",
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
                  src={ReviewTwo}
                  style={{ width: "45px", height: "45px" }}
                  alt="Review 2"
                />
                <div className={cx("ps-3")}>
                  <h6 className={cx("fw-bold", "mb-1")}>Client Name</h6>
                  <small>Profession</small>
                </div>
              </div>
            </div>
            <div
              className={cx(
                "review-item",
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
                  src={ReviewThree}
                  style={{ width: "45px", height: "45px" }}
                  alt="Review 3"
                />
                <div className={cx("ps-3")}>
                  <h6 className={cx("fw-bold", "mb-1")}>Client Name</h6>
                  <small>Profession</small>
                </div>
              </div>
            </div> */}
          </Carousel>
        </div>
      </div>
      {/* Review End */}
    </div>
  );
}
