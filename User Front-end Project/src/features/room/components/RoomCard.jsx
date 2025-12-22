import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faBed,
  faWifi,
  faBath,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { formatCurrency, truncateText } from "../../../utils";

import bootstrapStyles from "../../../assets/css/bootstrap.module.css";
import styles from "../../../assets/css/style.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

const RoomCard = ({ room, isFavorite, onFavoriteToggle }) => {
  return (
    <div
      className={cx(
        "room-item",
        "shadow",
        "rounded",
        "overflow-hidden",
        "position-relative"
      )}
    >
      {/* Favorite Button */}
      <button
        className={cx("btn", "position-absolute", "top-0", "end-0", "m-2", {
          "btn-danger": isFavorite,
          "btn-outline-secondary": !isFavorite,
        })}
        style={{
          zIndex: 2,
          backgroundColor: isFavorite ? undefined : "rgba(255, 255, 255, 0.95)",
          borderColor: isFavorite ? undefined : "#6c757d",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onClick={onFavoriteToggle}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <FontAwesomeIcon
          icon={faHeart}
          className={cx({
            "text-white": isFavorite,
            "text-secondary": !isFavorite,
          })}
        />
      </button>

      {/* Room Image */}
      <div className={cx("position-relative")}>
        <img
          className={cx("img-fluid")}
          src={room.RoomImage || "/default-room.jpg"}
          alt={`Room ${room.RoomId}`}
          style={{ height: "250px", objectFit: "cover", width: "100%" }}
        />
        <small
          className={cx(
            "position-absolute",
            "start-0",
            "top-100",
            "translate-middle-y",
            "bg-primary",
            "text-white",
            "rounded",
            "py-1",
            "px-3",
            "ms-4"
          )}
        >
          {formatCurrency(Number(room.Price))}/Night
        </small>
      </div>

      {/* Room Details */}
      <div className={cx("p-4", "mt-2")}>
        <div className={cx("d-flex", "justify-content-between", "mb-3")}>
          <h5 className={cx("mb-0")}>Room {room.RoomId}</h5>
          <div className={cx("ps-2")}>
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                className={cx("text-primary")}
                style={{ fontSize: "0.8rem" }}
              />
            ))}
          </div>
        </div>

        {/* Room Features */}
        <div className={cx("d-flex", "mb-3")}>
          <small className={cx("border-end", "me-3", "pe-3")}>
            <FontAwesomeIcon
              icon={faBed}
              className={cx("text-primary", "me-2")}
            />
            {room.RoomTypeName || "Standard"}
          </small>
          <small className={cx("border-end", "me-3", "pe-3")}>
            <FontAwesomeIcon
              icon={faWifi}
              className={cx("text-primary", "me-2")}
            />
            Wifi
          </small>
          <small>
            <FontAwesomeIcon
              icon={faBath}
              className={cx("text-primary", "me-2")}
            />
            Bath
          </small>
        </div>

        {/* Room Description */}
        <p className={cx("text-body", "mb-3")}>
          {room.Description
            ? truncateText(room.Description, 100)
            : "Comfortable room with modern amenities."}
        </p>

        {/* Action Buttons */}
        <div className={cx("d-flex", "justify-content-between")}>
          <Link
            className={cx(
              "btn",
              "btn-sm",
              "btn-primary",
              "rounded",
              "py-2",
              "px-4"
            )}
            to={`/room-detail/${room.RoomId}`}
          >
            View Detail
          </Link>
          <Link
            className={cx(
              "btn",
              "btn-sm",
              "btn-dark",
              "rounded",
              "py-2",
              "px-4"
            )}
            to={`/booking?roomId=${room.RoomId}`}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

RoomCard.propTypes = {
  room: PropTypes.shape({
    RoomId: PropTypes.number.isRequired,
    // RoomName: PropTypes.string.isRequired,
    RoomImage: PropTypes.string,
    Price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    Description: PropTypes.string,
    RoomTypeName: PropTypes.string,
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onFavoriteToggle: PropTypes.func.isRequired,
};

export default RoomCard;
