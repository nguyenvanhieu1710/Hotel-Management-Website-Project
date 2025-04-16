import { useState } from "react";
import StarRating from "../StarRating/StarRating";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import classNames from "classnames/bind";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";

const cx = classNames.bind({
  ...bootstrapStyles,
});

export default function HotelReviewForm() {
  const [overallRating, setOverallRating] = useState(0);
  const [roomQuality, setRoomQuality] = useState(0);
  const [serviceQuality, setServiceQuality] = useState(0);
  const [amenities, setAmenities] = useState(0);
  const [location, setLocation] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleOverallRatingChange = (rating) => {
    setOverallRating(rating);
  };

  const handleRoomQualityChange = (rating) => {
    setRoomQuality(rating);
  };

  const handleServiceQualityChange = (rating) => {
    setServiceQuality(rating);
  };

  const handleAmenitiesChange = (rating) => {
    setAmenities(rating);
  };

  const handleLocationChange = (rating) => {
    setLocation(rating);
  };

  const handleCommentChange = (value) => {
    setComment(value);
  };

  const handleImageUpload = (event) => {
    console.log("Images selected:", event.target.files);
    setImages([...images, ...event.target.files]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = {};
    if (!overallRating) {
      validationErrors.overallRating = "Overall rating is required.";
    }
    if (!comment.trim()) {
      validationErrors.comment = "Comment is required.";
    }
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const reviewData = {
        overallRating,
        roomQuality,
        serviceQuality,
        amenities,
        location,
        comment,
        images,
      };
      console.log("Review Data:", reviewData);
    }
  };

  return (
    <div className={cx("container", "mt-5")}>
      <h2 className={cx("mb-4")}>Hotel Review</h2>
      <form onSubmit={handleSubmit}>
        <div className={cx("mb-3", "d-flex", "align-items-center")}>
          <label
            htmlFor="overallRating"
            className={cx("form-label", "me-2", "col-md-3")}
          >
            Overall Rating:
          </label>
          <div className={cx("flex-grow-1")}>
            <StarRating
              rating={overallRating}
              onRatingChange={handleOverallRatingChange}
            />
            {errors.overallRating && (
              <div className={cx("text-danger")}>{errors.overallRating}</div>
            )}
          </div>
        </div>

        <div className={cx("mb-3", "d-flex", "align-items-center")}>
          <label
            htmlFor="roomQuality"
            className={cx("form-label", "me-2", "col-md-3")}
          >
            Room Quality:
          </label>
          <div className={cx("flex-grow-1")}>
            <StarRating
              rating={roomQuality}
              onRatingChange={handleRoomQualityChange}
            />
          </div>
        </div>

        <div className={cx("mb-3", "d-flex", "align-items-center")}>
          <label
            htmlFor="serviceQuality"
            className={cx("form-label", "me-2", "col-md-3")}
          >
            Customer Service:
          </label>
          <div className={cx("flex-grow-1")}>
            <StarRating
              rating={serviceQuality}
              onRatingChange={handleServiceQualityChange}
            />
          </div>
        </div>

        <div className={cx("mb-3", "d-flex", "align-items-center")}>
          <label
            htmlFor="amenities"
            className={cx("form-label", "me-2", "col-md-3")}
          >
            Hotel Amenities:
          </label>
          <div className={cx("flex-grow-1")}>
            <StarRating
              rating={amenities}
              onRatingChange={handleAmenitiesChange}
            />
          </div>
        </div>

        <div className={cx("mb-3", "d-flex", "align-items-center")}>
          <label
            htmlFor="location"
            className={cx("form-label", "me-2", "col-md-3")}
          >
            Location:
          </label>
          <div className={cx("flex-grow-1")}>
            <StarRating
              rating={location}
              onRatingChange={handleLocationChange}
            />
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

        <div className={cx("mb-3")}>
          <label htmlFor="images" className={cx("form-label")}>
            Upload Images/Videos (Optional):
          </label>
          <input
            type="file"
            className={cx("form-control")}
            id="images"
            multiple
            onChange={handleImageUpload}
          />
        </div>

        <button type="submit" className={cx("btn", "btn-primary")}>
          Submit Review
        </button>
      </form>
    </div>
  );
}
