import { useState } from "react";
import StarRating from "../../components/StarRating/StarRating";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import classNames from "classnames/bind";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../providers/AuthProvider";
import { userService } from "../../services/userService";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";

const cx = classNames.bind({
  ...bootstrapStyles,
});

export default function ReviewForm() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (value) => {
    setComment(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = {};
    if (!rating) {
      validationErrors.rating = "Rating is required.";
    }
    if (!comment.trim()) {
      validationErrors.comment = "Comment is required.";
    }
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsSubmitting(true);

        if (!user) {
          throw new Error("User not logged in");
        }

        const reviewData = {
          UserId: user.AccountId,
          RoomId: roomId || 1,
          Rating: rating,
          Comment: comment,
          Status: "Active",
          Deleted: false,
        };

        const response = await userService.submitReview(reviewData);

        if (response) {
          await Swal.fire({
            title: "Success!",
            text: "Your review has been submitted successfully!",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        await Swal.fire({
          title: "Error!",
          text:
            error.message === "User not logged in"
              ? "Please login to submit a review"
              : "An error occurred while submitting your review. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#d33",
        });
        setErrors({
          submit:
            error.message === "User not logged in"
              ? "Please login to submit a review"
              : "An error occurred while submitting your review. Please try again later.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      await Swal.fire({
        title: "Validation Error!",
        html: Object.values(validationErrors)
          .map((error) => `<div class="text-danger mb-2">${error}</div>`)
          .join(""),
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <div className={cx("container", "mt-5")}>
      <h2 className={cx("mb-4")}>Hotel Review</h2>
      <form onSubmit={handleSubmit}>
        <div className={cx("mb-3", "d-flex", "align-items-center")}>
          <label
            htmlFor="rating"
            className={cx("form-label", "me-2", "col-md-3")}
          >
            Rating:
          </label>
          <div className={cx("flex-grow-1")}>
            <StarRating rating={rating} onRatingChange={handleRatingChange} />
            {errors.rating && (
              <div className={cx("text-danger")}>{errors.rating}</div>
            )}
          </div>
        </div>

        <div className={cx("mb-5")}>
          <label htmlFor="comment" className={cx("form-label")}>
            Comments/Review:
          </label>
          <ReactQuill
            id="comment"
            value={comment}
            onChange={handleCommentChange}
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [
                  { list: "ordered" },
                  { list: "bullet" },
                  { indent: "-1" },
                  { indent: "+1" },
                ],
                ["link", "image", "video"],
                ["clean"],
              ],
            }}
            formats={[
              "header",
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "list",
              "bullet",
              "indent",
              "link",
              "image",
              "video",
            ]}
            className={cx("form-control")}
            style={{ height: "120px" }}
          />
          {errors.comment && (
            <div className={cx("text-danger")}>{errors.comment}</div>
          )}
        </div>

        {errors.submit && (
          <div className={cx("alert", "alert-danger", "mb-3")}>
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          className={cx("btn", "btn-primary")}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
