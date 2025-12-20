import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCalendar,
  faClock,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  formatCurrency,
  formatDate,
  formatTime,
  truncateText,
  getStatusColor,
} from "../../../utils";

const EventCard = ({ event, isFavorite, onFavoriteToggle }) => {
  return (
    <div className="event-item shadow rounded overflow-hidden position-relative">
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

      {/* Status Badge */}
      <span
        className={`badge bg-${getStatusColor(
          event.Status
        )} position-absolute top-0 start-0 m-2`}
        style={{ zIndex: 2 }}
      >
        {event.Status}
      </span>

      {/* Event Image */}
      <div className="position-relative">
        <img
          className="img-fluid"
          src={event.EventImage || "/default-event.jpg"}
          alt={event.EventName}
          style={{ height: "250px", objectFit: "cover", width: "100%" }}
        />
        <small className="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">
          {formatCurrency(event.Price)}
        </small>
      </div>

      {/* Event Details */}
      <div className="p-4 mt-2">
        <h5 className="mb-3">{event.EventName}</h5>

        {/* Event Info */}
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <FontAwesomeIcon icon={faCalendar} className="text-primary me-2" />
            <small>{formatDate(event.OrganizationDay)}</small>
          </div>

          <div className="d-flex align-items-center mb-2">
            <FontAwesomeIcon icon={faClock} className="text-primary me-2" />
            <small>
              {formatTime(event.StartTime)} - {formatTime(event.EndTime)}
            </small>
          </div>

          <div className="d-flex align-items-center mb-2">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="text-primary me-2"
            />
            <small>{truncateText(event.OrganizationLocation, 30)}</small>
          </div>
        </div>

        {/* Event Description */}
        <p className="text-body mb-3">
          {event.Description
            ? truncateText(event.Description, 100)
            : "Join us for an amazing event experience."}
        </p>

        {/* Event Type */}
        {event.EventTypeName && (
          <div className="mb-3">
            <span className="badge bg-secondary">{event.EventTypeName}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="d-flex justify-content-between">
          <Link
            className="btn btn-sm btn-primary rounded py-2 px-4"
            to={`/event-detail/${event.EventId}`}
          >
            View Detail
          </Link>
          <Link
            className="btn btn-sm btn-success rounded py-2 px-4"
            to={`/event-booking?eventId=${event.EventId}`}
          >
            Book Event
          </Link>
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    EventId: PropTypes.number.isRequired,
    EventName: PropTypes.string.isRequired,
    EventImage: PropTypes.string,
    Price: PropTypes.number.isRequired,
    Description: PropTypes.string,
    OrganizationDay: PropTypes.string.isRequired,
    StartTime: PropTypes.string.isRequired,
    EndTime: PropTypes.string.isRequired,
    OrganizationLocation: PropTypes.string.isRequired,
    Status: PropTypes.string.isRequired,
    EventTypeName: PropTypes.string,
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onFavoriteToggle: PropTypes.func.isRequired,
};

export default EventCard;
