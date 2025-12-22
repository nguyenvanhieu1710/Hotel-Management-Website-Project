import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import classNames from "classnames/bind";
import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "./RoomDetail.module.scss"; // SCSS File

// Toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Bootstrap
import { Card, Button as BsButton } from "react-bootstrap";

// PrimeReact
import { Divider } from "primereact/divider";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faCoffee,
  faRulerCombined,
  faDumbbell,
  faUserFriends,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function RoomDetail() {
  const { id } = useParams();
  const roomId = id;
  const navigate = useNavigate();

  const [room, setRoomData] = useState(null);
  const [devices, setDevices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/rooms/public/${roomId}`
        );
        console.log("Room response:", response.data); // Debug log

        // Handle different response formats
        let roomData = response.data;
        if (response.data.success && response.data.data) {
          roomData = response.data.data;
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          roomData = response.data[0];
        }

        setRoomData(roomData);
      } catch (error) {
        console.error("Failed to load room details:", error);
        toast.error("Failed to load room details.", { position: "top-right" });
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetail();

    const fetchDevices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/device/public`
        );
        console.log("Devices response:", response.data); // Debug log

        // Handle different response formats
        let devicesData = response.data;
        if (response.data.success && response.data.data) {
          devicesData = response.data.data;
        } else if (response.data.devices) {
          devicesData = response.data.devices;
        }

        // Ensure devicesData is an array
        if (Array.isArray(devicesData)) {
          const result = devicesData.filter(
            (device) => Number(device.RoomId) === Number(roomId)
          );
          setDevices(result);
        } else {
          console.warn("Devices data is not an array:", devicesData);
          setDevices([]);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
        toast.error("Failed to load devices.", { position: "top-right" });
        setDevices([]); // Set empty array on error
      }
    };

    fetchDevices();
  }, [roomId]);

  // Check if room is already in favorites when component loads
  useEffect(() => {
    if (room) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const isInFavorites = favorites.some((fav) => fav.RoomId === room.RoomId);
      setIsFavorited(isInFavorites);
    }
  }, [room]);

  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (!isFavorited) {
      // Add to favorites
      const roomWithDevices = {
        ...room,
        devices: devices || [],
        addedAt: new Date().toISOString(),
      };
      favorites.push(roomWithDevices);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorited(true);
      toast.success("Added to your favorites list.", {
        position: "top-right",
      });
    } else {
      // Remove from favorites
      const updatedFavorites = favorites.filter(
        (fav) => fav.RoomId !== room.RoomId
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorited(false);
      toast.info("Removed from your favorites list.", {
        position: "top-right",
      });
    }

    // Dispatch custom event to notify header about favorites update
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  if (loading) {
    return <div className={cx("loading")}>Loading room details...</div>;
  }

  if (!room) {
    return <div className={cx("no-data")}>No room details available.</div>;
  }

  const handleBooking = () => {
    navigate("/booking");
  };

  return (
    <div className={cx("container-xxl", "my-5")}>
      <ToastContainer />

      <div className={cx("row")}>
        <div className={cx("col-md-6")}>
          <Card className={cx("roomImageCard", "mb-4")}>
            <Card.Img
              variant="top"
              src={room.RoomImage}
              alt="Room Image"
              className={cx("room-image")}
            />
          </Card>
        </div>

        {/* Amenities */}
        <div className={cx("col-md-6")}>
          <div className={cx("mb-3")}>
            <h3 className={cx("amenities-title")}>Amenities</h3>
            <ul className={cx("list-unstyled", "amenities-list")}>
              <li
                className={cx(
                  "d-flex",
                  "align-items-center",
                  "mb-2",
                  "amenity-item"
                )}
              >
                <FontAwesomeIcon
                  icon={faUserFriends}
                  className={cx("me-2", "text-secondary")}
                />
                <span className={cx("amenity-text")}>2 - 5 Persons</span>
              </li>

              <li
                className={cx(
                  "d-flex",
                  "align-items-center",
                  "mb-2",
                  "amenity-item"
                )}
              >
                <FontAwesomeIcon
                  icon={faWifi}
                  className={cx("me-2", "text-secondary")}
                />
                <span className={cx("amenity-text")}>Free Wifi Available</span>
              </li>
              <li
                className={cx(
                  "d-flex",
                  "align-items-center",
                  "mb-2",
                  "amenity-item"
                )}
              >
                <FontAwesomeIcon
                  icon={faCoffee}
                  className={cx("me-2", "text-secondary")}
                />
                <span className={cx("amenity-text")}>Breakfast</span>
              </li>

              <li
                className={cx(
                  "d-flex",
                  "align-items-center",
                  "mb-2",
                  "amenity-item"
                )}
              >
                <FontAwesomeIcon
                  icon={faRulerCombined}
                  className={cx("me-2", "text-secondary")}
                />
                <span className={cx("amenity-text")}>
                  {room.RoomArea} m&sup2; Rooms
                </span>
              </li>
              <li
                className={cx(
                  "d-flex",
                  "align-items-center",
                  "mb-2",
                  "amenity-item"
                )}
              >
                <FontAwesomeIcon
                  icon={faDumbbell}
                  className={cx("me-2", "text-secondary")}
                />
                <span className={cx("amenity-text")}>Gym facilities</span>
              </li>
            </ul>
            <BsButton
              className={cx("favorite-btn", { favorited: isFavorited })}
              onClick={handleFavorite}
            >
              <FontAwesomeIcon icon={faHeart} />
            </BsButton>
          </div>
        </div>
      </div>

      {/* Informatin of rooms */}
      <div className="row mt-4">
        <div className="col-md-12">
          <Card className={cx("roomInfoCard")}>
            <Card.Body>
              <h3 className={cx("titleRoom", "mb-3")}>
                Room ID: {room.RoomId} - Floor {room.NumberOfFloor}
              </h3>
              <p className="mb-2">Room Area: {room.RoomArea} m&sup2;</p>
              <p className="mb-2">Description: {room.Description}</p>
              <p className="mb-2">Status: {room.Status}</p>
              <p className="mb-2">Price: USD {room.Price}</p>
              <p className="mb-2">Amenities: {room.Amenities}</p>

              <div className="mb-3">
                <h6 className={cx("sectionTitle")}>Room Devices</h6>
                <div className={cx("d-flex", "flex-wrap", "amenitiesTags")}>
                  {devices &&
                    devices.map((device) => (
                      <div key={device.DeviceId} className={cx("deviceItem")}>
                        <img
                          src={device.DeviceImage}
                          alt={device.DeviceName}
                          className={cx("deviceImage")}
                          width={50}
                          height={50}
                        />
                        <p>
                          {device.DeviceName} - Price: USD {device.Price}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              <Divider className={cx("roomDivider")} />

              <div className="mb-4">
                <h6 className={cx("sectionTitle")}>Prices</h6>
                <div className={cx("priceItem")}>
                  <span>Official Price</span>
                  <span className={cx("priceValue")}>USD {room.Price}</span>
                </div>
              </div>

              <div className="d-flex">
                <BsButton
                  className={cx("chooseBtn", "flex-grow-1")}
                  variant="success"
                  onClick={handleBooking}
                >
                  Booking
                </BsButton>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Review Section */}
      <div className={cx("row", "mt-5", "review-section")}>
        <div className="col-md-12">
          <h2 className={cx("mb-4", "review-title")}>Review</h2>
          <div className={cx("row", "align-items-center", "review-summary")}>
            <div className="col-md-3">
              <h3 className={cx("average-rating")}>0/5</h3>
              <p className={cx("total-reviews")}>0 Reviews</p>
            </div>
            <div className="col-md-6">
              {[5, 4, 3, 2, 1].map((star) => (
                <div
                  key={star}
                  className={cx(
                    "d-flex",
                    "align-items-center",
                    "mb-2",
                    `star-${star}-rating`
                  )}
                >
                  <span className={cx("me-2", "star-label")}>
                    {star} stars &nbsp;
                  </span>
                  <div
                    className={cx(
                      "progress",
                      "w-75",
                      "me-2",
                      "rating-progress-bar"
                    )}
                    style={{ height: "8px" }}
                  >
                    <div
                      className={cx("progress-bar", "bg-secondary")}
                      role="progressbar"
                      style={{ width: "0%" }} // Need actual data to display percentage
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <span className={cx("rating-count")}>&nbsp;0</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
