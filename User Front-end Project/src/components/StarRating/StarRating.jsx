import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as faSolidStar,
  faStarHalfStroke as faHalfStar,
  // eslint-disable-next-line no-unused-vars
  faStar as faRegularStar,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { faStar as faRegularStarOutline } from "@fortawesome/free-regular-svg-icons";

const StarRating = ({ rating, onRatingChange }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faSolidStar}
          onClick={() => onRatingChange(i)}
          style={{ color: "gold", cursor: "pointer" }}
        />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faHalfStar}
          onClick={() => onRatingChange(i)}
          style={{ color: "gold", cursor: "pointer" }}
        />
      );
    } else {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faRegularStarOutline}
          onClick={() => onRatingChange(i)}
          style={{ color: "gold", cursor: "pointer" }}
        />
      );
    }
  }

  return <div>{stars}</div>;
};
StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func.isRequired,
};

export default StarRating;
