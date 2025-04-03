import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./RoomDetail.module.scss"; // File SCSS

// Toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Bootstrap
import { Card, Button as BsButton } from "react-bootstrap";

// PrimeReact
import { Divider } from "primereact/divider";

const cx = classNames.bind(styles);

export default function RoomDetail() {
  const { id } = useParams();
  const roomId = id;
  const navigate = useNavigate();

  const [room, setRoomData] = useState(null);
  const [devices, setDevices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        // console.log("Room ID:", roomId);
        const response = await axios.get(
          `http://localhost:3000/api/rooms/get-data-by-id/${roomId}`
        );
        // console.log("Room details:", response.data);
        setRoomData(response.data[0]);
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
          `http://localhost:3000/api/device/get-all`
        );
        // console.log("RoomId:", roomId);
        // console.log("Device: ", response.data);
        const result = response.data.filter(
          (device) => Number(device.RoomId) === Number(roomId)
        );
        // console.log("Room devices:", result);
        setDevices(result);
      } catch (error) {
        console.error("Error fetching devices:", error);
        toast.error("Failed to load devices.", { position: "top-right" });
      }
    };

    fetchDevices();
  }, [roomId]);

  if (loading) {
    return <div className={cx("loading")}>Loading room details...</div>;
  }

  if (!room) {
    return <div className={cx("no-data")}>No room details available.</div>;
  }

  const handleBooking = () => {
    navigate("/booking");
  };
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={cx("roomDetailContainer", "container", "my-5")}>
      <ToastContainer />

      {/* Header (Back & Next) */}
      <div
        className={cx(
          "roomHeader",
          "d-flex",
          "justify-content-between",
          "align-items-center",
          "mb-3"
        )}
      >
        <button
          className={cx("btn-back", "btn", "btn-link", "text-secondary")}
          onClick={handleBack}
        >
          <i className="pi pi-arrow-left"></i> Back
        </button>
      </div>

      <div className="row">
        <div className="col-md-5">
          <Card className={cx("roomImageCard", "mb-4")}>
            <Card.Img
              variant="top"
              src={room.RoomImage}
              alt="Room Image"
              className={cx("room-image")}
            />
          </Card>
        </div>

        <div className="col-md-7">
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
                  {devices.map((device) => (
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

              <BsButton
                className={cx("chooseBtn")}
                variant="success"
                onClick={handleBooking}
              >
                Booking
              </BsButton>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
