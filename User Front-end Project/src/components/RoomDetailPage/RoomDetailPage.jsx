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
import { Tag } from "primereact/tag";

// Ảnh mẫu
import RoomImage from "../../assets/img/room-1.jpg";

// Tạo hàm bind
const cx = classNames.bind(styles);

export default function RoomDetail() {
  const { id } = useParams();
  const roomId = id;
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        console.log("Room ID:", roomId);
        const response = await axios.get(
          `http://localhost:3000/api/rooms/get-data-by-id/${roomId}`
        );
        console.log("Room details:", response.data);
        setRoomData(response.data[0]);
      } catch (error) {
        console.error("Failed to load room details:", error);
        toast.error("Failed to load room details.", { position: "top-right" });
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetail();
  }, [roomId]);

  // Khi đang load
  if (loading) {
    return <div className={cx("loading")}>Loading room details...</div>;
  }

  // Khi không có dữ liệu
  if (!roomData) {
    return <div className={cx("no-data")}>No room details available.</div>;
  }

  // Xử lý nút
  const handleBooking = () => {
    navigate("/booking");
  };
  const handleNext = () => {
    toast.info("Next suite room logic here...", { position: "top-right" });
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
        <button className="btn btn-link text-secondary" onClick={handleBack}>
          <i className="pi pi-arrow-left"></i> Back to hotel detail
        </button>
        <button className="btn btn-link text-secondary" onClick={handleNext}>
          Next Suite Room <i className="pi pi-arrow-right"></i>
        </button>
      </div>

      <div className="row">
        {/* Ảnh phòng */}
        <div className="col-md-5">
          <Card className={cx("roomImageCard", "mb-4")}>
            <Card.Img variant="top" src={RoomImage} alt="Room Image" />
          </Card>
        </div>

        {/* Thông tin phòng */}
        <div className="col-md-7">
          <Card className={cx("roomInfoCard")}>
            <Card.Body>
              {/* Tiêu đề & diện tích */}
              <h3 className={cx("titleRoom", "mb-3")}>
                {/* Bạn có thể thay bằng dữ liệu động: roomData.RoomTypeName */}
                Suite 45 m<sup>2</sup>
              </h3>

              {/* Tiện nghi */}
              <div className="mb-3">
                <h6 className={cx("sectionTitle")}>Room Amenities</h6>
                <div className={cx("d-flex", "flex-wrap", "amenitiesTags")}>
                  <Tag severity="success" value="Free Wi-Fi" />
                  <Tag severity="success" value="Concierge" />
                  <Tag severity="success" value="Safe" />
                  <Tag severity="success" value="24/7 Service" />
                  <Tag severity="success" value="Luggage" />
                  <Tag severity="success" value="Room Service" />
                </div>
              </div>

              {/* Loại giường */}
              <div className="mb-3">
                <h6 className={cx("sectionTitle")}>Bed Type</h6>
                <p className="mb-0">Queen Size Bed + Sofa Bed</p>
                <small className="text-muted">Sleeps in the mornings</small>
              </div>

              <Divider className={cx("roomDivider")} />

              {/* Quy tắc hủy */}
              <div className="mb-3">
                <h6 className={cx("sectionTitle")}>Cancellation Rules</h6>
                <ul className="mb-1">
                  <li>Free Cancellation until 12:00 PM on arrival day</li>
                  <li>Extra fee may apply after that</li>
                </ul>
                <small className="text-muted">
                  Valid for stay from July 20 - July 22
                </small>
              </div>

              <Divider className={cx("roomDivider")} />

              {/* Bảng giá */}
              <div className="mb-4">
                <h6 className={cx("sectionTitle")}>Prices</h6>
                <div className={cx("priceItem")}>
                  <span>Booking.com</span>
                  <span className={cx("priceValue")}>USD 964</span>
                </div>
                <div className={cx("priceItem")}>
                  <span>HotelStore</span>
                  <span className={cx("priceValue")}>USD 872</span>
                </div>
              </div>

              {/* Nút chọn (Choose) */}
              <BsButton
                className={cx("chooseBtn")}
                variant="success"
                onClick={handleBooking}
              >
                Choose
              </BsButton>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
