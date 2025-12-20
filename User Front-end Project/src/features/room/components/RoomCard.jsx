import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faBed,
  faWifi,
  faBath,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { formatCurrency, truncateText } from "../../../utils";

const RoomCard = ({ room, isFavorite, onFavoriteToggle }) => {
  return (
    <div className="room-item shadow rounded overflow-hidden position-relative">
      {/* Favorite Button */}
      <button
        className={`btn position-absolute top-0 end-0 m-2 ${
          isFavorite ? "btn-danger" : "btn-outline-light"
        }`}
        style={{ zIndex: 2 }}
        onClick={onFavoriteToggle}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <FontAwesomeIcon icon={faHeart} />
      </button>

      {/* Room Image */}
      <div className="position-relative">
        <img
          className="img-fluid"
          src={room.RoomImage || "/default-room.jpg"}
          alt={room.RoomName}
          style={{ height: "250px", objectFit: "cover", width: "100%" }}
        />
        <small className="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">
          {formatCurrency(room.Price)}/Night
        </small>
      </div>

      {/* Room Details */}
      <div className="p-4 mt-2">
        <div className="d-flex justify-content-between mb-3">
          <h5 className="mb-0">{room.RoomName}</h5>
          <div className="ps-2">
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                className="text-primary"
                style={{ fontSize: "0.8rem" }}
              />
            ))}
          </div>
        </div>

        {/* Room Features */}
        <div className="d-flex mb-3">
          <small className="border-end me-3 pe-3">
            <FontAwesomeIcon icon={faBed} className="text-primary me-2" />
            {room.RoomTypeName || "Standard"}
          </small>
          <small className="border-end me-3 pe-3">
            <FontAwesomeIcon icon={faWifi} className="text-primary me-2" />
            Wifi
          </small>
          <small>
            <FontAwesomeIcon icon={faBath} className="text-primary me-2" />
            Bath
          </small>
        </div>

        {/* Room Description */}
        <p className="text-body mb-3">
          {room.Description
            ? truncateText(room.Description, 100)
            : "Comfortable room with modern amenities."}
        </p>

        {/* Action Buttons */}
        <div className="d-flex justify-content-between">
          <Link
            className="btn btn-sm btn-primary rounded py-2 px-4"
            to={`/room-detail/${room.RoomId}`}
          >
            View Detail
          </Link>
          <Link
            className="btn btn-sm btn-dark rounded py-2 px-4"
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
    RoomName: PropTypes.string.isRequired,
    RoomImage: PropTypes.string,
    Price: PropTypes.number.isRequired,
    Description: PropTypes.string,
    RoomTypeName: PropTypes.string,
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onFavoriteToggle: PropTypes.func.isRequired,
};

export default RoomCard;
