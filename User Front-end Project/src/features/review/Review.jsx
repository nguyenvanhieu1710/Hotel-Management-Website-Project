import classNames from "classnames/bind";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import DOMPurify from "dompurify";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import reviewStyles from "./Review.module.scss";
import { useEvaluations } from "../../hooks";
import { userService } from "../../services";
import { useApi } from "../../hooks/useApi";

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
  // Use hooks for data fetching
  const {
    evaluations,
    loading: evaluationsLoading,
    error: evaluationsError,
  } = useEvaluations();

  const {
    data: users,
    loading: usersLoading,
    error: usersError,
  } = useApi(() => userService.getAllUsers());

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  if (evaluationsLoading || usersLoading) {
    return (
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container")}>
          <div className={cx("text-center")}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading reviews...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (evaluationsError || usersError) {
    return (
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container")}>
          <div className={cx("text-center")}>
            <div className="alert alert-danger" role="alert">
              Error loading reviews: {evaluationsError || usersError}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {evaluations?.map((evaluation) => {
              const user = users?.find((u) => u.UserId === evaluation.UserId);
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
                    <p
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(evaluation.Comment),
                      }}
                    />
                    <div className={cx("d-flex", "align-items-center")}>
                      <img
                        className={cx("img-fluid", "flex-shrink-0", "rounded")}
                        src={user.UserImage || "default-avatar.png"}
                        style={{ width: "45px", height: "45px" }}
                        alt="Review"
                        referrerPolicy="no-referrer"
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
          </Carousel>
        </div>
      </div>
      {/* Review End */}
    </div>
  );
}
