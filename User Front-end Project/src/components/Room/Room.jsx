// import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

import OneRoomImage from "../../assets/img/room-1.jpg";
import TwoRoomImage from "../../assets/img/room-2.jpg";
import ThreeRoomImage from "../../assets/img/room-3.jpg";
import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import {
  faStar,
  faBed,
  faBath,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function Room() {
  // const [rooms, setRooms] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:3000/api/rooms/get-all")
  //     .then((response) => {
  //       console.log(response.data);
  //       setRooms(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching rooms:", error);
  //     });
  // }, []);

  // const getImage = (index) => {
  //   const images = [OneRoomImage, TwoRoomImage, ThreeRoomImage];
  //   return images[index % images.length];
  // };

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  return (
    <div data-aos="fade-up">
      {/* Room Start */}
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container")}>
          <div
            className={cx("text-center", "wow", "fadeInUp")}
            data-wow-delay="0.1s"
          >
            <h6
              className={cx(
                "section-title",
                "text-center",
                "text-primary",
                "text-uppercase"
              )}
            >
              Our Rooms
            </h6>
            <h1 className={cx("mb-5")}>
              Explore Our{" "}
              <span className={cx("text-primary", "text-uppercase")}>
                Rooms
              </span>
            </h1>
          </div>
          <div className={cx("row", "g-4")}>
            {/* Room Item 1 */}
            <div
              className={cx("col-lg-4", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.1s"
            >
              <div
                className={cx(
                  "room-item",
                  "shadow",
                  "rounded",
                  "overflow-hidden"
                )}
              >
                <div className={cx("position-relative")}>
                  <img
                    className={cx("img-fluid")}
                    src={OneRoomImage}
                    alt="Room 1"
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
                    $100/Night
                  </small>
                </div>
                <div className={cx("p-4", "mt-2")}>
                  <div
                    className={cx("d-flex", "justify-content-between", "mb-3")}
                  >
                    <h5 className={cx("mb-0")}>Junior Suite</h5>
                    <div className={cx("ps-2")}>
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                    </div>
                  </div>
                  <div className={cx("d-flex", "mb-3")}>
                    <small className={cx("border-end", "me-3", "pe-3")}>
                      <FontAwesomeIcon
                        icon={faBed}
                        className={cx("text-primary", "me-2")}
                      />
                      3 Bed
                    </small>
                    <small className={cx("border-end", "me-3", "pe-3")}>
                      <FontAwesomeIcon
                        icon={faBath}
                        className={cx("text-primary", "me-2")}
                      />
                      2 Bath
                    </small>
                    <small>
                      <FontAwesomeIcon
                        icon={faWifi}
                        className={cx("text-primary", "me-2")}
                      />
                      Wifi
                    </small>
                  </div>
                  <p className={cx("text-body", "mb-3")}>
                    Erat ipsum justo amet duo et elitr dolor, est duo duo eos
                    lorem sed diam stet diam sed stet lorem.
                  </p>
                  <div className={cx("d-flex", "justify-content-between")}>
                    <a
                      className={cx(
                        "btn",
                        "btn-sm",
                        "btn-primary",
                        "rounded",
                        "py-2",
                        "px-4"
                      )}
                      href=""
                    >
                      View Detail
                    </a>
                    <a
                      className={cx(
                        "btn",
                        "btn-sm",
                        "btn-dark",
                        "rounded",
                        "py-2",
                        "px-4"
                      )}
                      href=""
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Room Item 2 */}
            <div
              className={cx("col-lg-4", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.3s"
            >
              <div
                className={cx(
                  "room-item",
                  "shadow",
                  "rounded",
                  "overflow-hidden"
                )}
              >
                <div className={cx("position-relative")}>
                  <img
                    className={cx("img-fluid")}
                    src={TwoRoomImage}
                    alt="Room 2"
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
                    $100/Night
                  </small>
                </div>
                <div className={cx("p-4", "mt-2")}>
                  <div
                    className={cx("d-flex", "justify-content-between", "mb-3")}
                  >
                    <h5 className={cx("mb-0")}>Executive Suite</h5>
                    <div className={cx("ps-2")}>
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                    </div>
                  </div>
                  <div className={cx("d-flex", "mb-3")}>
                    <small className={cx("border-end", "me-3", "pe-3")}>
                      <FontAwesomeIcon
                        icon={faBed}
                        className={cx("text-primary", "me-2")}
                      />
                      3 Bed
                    </small>
                    <small className={cx("border-end", "me-3", "pe-3")}>
                      <FontAwesomeIcon
                        icon={faBath}
                        className={cx("text-primary", "me-2")}
                      />
                      2 Bath
                    </small>
                    <small>
                      <FontAwesomeIcon
                        icon={faWifi}
                        className={cx("text-primary", "me-2")}
                      />
                      Wifi
                    </small>
                  </div>
                  <p className={cx("text-body", "mb-3")}>
                    Erat ipsum justo amet duo et elitr dolor, est duo duo eos
                    lorem sed diam stet diam sed stet lorem.
                  </p>
                  <div className={cx("d-flex", "justify-content-between")}>
                    <a
                      className={cx(
                        "btn",
                        "btn-sm",
                        "btn-primary",
                        "rounded",
                        "py-2",
                        "px-4"
                      )}
                      href=""
                    >
                      View Detail
                    </a>
                    <a
                      className={cx(
                        "btn",
                        "btn-sm",
                        "btn-dark",
                        "rounded",
                        "py-2",
                        "px-4"
                      )}
                      href=""
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Room Item 3 */}
            <div
              className={cx("col-lg-4", "col-md-6", "wow", "fadeInUp")}
              data-wow-delay="0.6s"
            >
              <div
                className={cx(
                  "room-item",
                  "shadow",
                  "rounded",
                  "overflow-hidden"
                )}
              >
                <div className={cx("position-relative")}>
                  <img
                    className={cx("img-fluid")}
                    src={ThreeRoomImage}
                    alt="Room 3"
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
                    $100/Night
                  </small>
                </div>
                <div className={cx("p-4", "mt-2")}>
                  <div
                    className={cx("d-flex", "justify-content-between", "mb-3")}
                  >
                    <h5 className={cx("mb-0")}>Super Deluxe</h5>
                    <div className={cx("ps-2")}>
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        className={cx("text-primary", "me-1")}
                      />
                    </div>
                  </div>
                  <div className={cx("d-flex", "mb-3")}>
                    <small className={cx("border-end", "me-3", "pe-3")}>
                      <FontAwesomeIcon
                        icon={faBed}
                        className={cx("text-primary", "me-2")}
                      />
                      3 Bed
                    </small>
                    <small className={cx("border-end", "me-3", "pe-3")}>
                      <FontAwesomeIcon
                        icon={faBath}
                        className={cx("text-primary", "me-2")}
                      />
                      2 Bath
                    </small>
                    <small>
                      <FontAwesomeIcon
                        icon={faWifi}
                        className={cx("text-primary", "me-2")}
                      />
                      Wifi
                    </small>
                  </div>
                  <p className={cx("text-body", "mb-3")}>
                    Erat ipsum justo amet duo et elitr dolor, est duo duo eos
                    lorem sed diam stet diam sed stet lorem.
                  </p>
                  <div className={cx("d-flex", "justify-content-between")}>
                    <a
                      className={cx(
                        "btn",
                        "btn-sm",
                        "btn-primary",
                        "rounded",
                        "py-2",
                        "px-4"
                      )}
                      href=""
                    >
                      View Detail
                    </a>
                    <a
                      className={cx(
                        "btn",
                        "btn-sm",
                        "btn-dark",
                        "rounded",
                        "py-2",
                        "px-4"
                      )}
                      href=""
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Room End */}
    </div>
    // <div>
    //   {/* Room Start */}
    //   <div className={cx("container-xxl", "py-5")}>
    //     <div className={cx("container")}>
    //       <div
    //         className={cx("text-center", "wow", "fadeInUp")}
    //         data-wow-delay="0.1s"
    //       >
    //         <h6
    //           className={cx(
    //             "section-title",
    //             "text-center",
    //             "text-primary",
    //             "text-uppercase"
    //           )}
    //         >
    //           Our Rooms
    //         </h6>
    //         <h1 className={cx("mb-5")}>
    //           Explore Our{" "}
    //           <span className={cx("text-primary", "text-uppercase")}>
    //             Rooms
    //           </span>
    //         </h1>
    //       </div>
    //       <div className={cx("row", "g-4")}>
    //         {rooms.map((room, index) => (
    //           <div
    //             key={room.RoomId}
    //             className={cx("col-lg-4", "col-md-6", "wow", "fadeInUp")}
    //             data-wow-delay={`${0.1 + index * 0.2}s`}
    //           >
    //             <div
    //               className={cx(
    //                 "room-item",
    //                 "shadow",
    //                 "rounded",
    //                 "overflow-hidden"
    //               )}
    //             >
    //               <div className={cx("position-relative")}>
    //                 <img
    //                   className={cx("img-fluid")}
    //                   src={getImage(index)}
    //                   alt={`Room ${room.RoomId}`}
    //                 />
    //                 <small
    //                   className={cx(
    //                     "position-absolute",
    //                     "start-0",
    //                     "top-100",
    //                     "translate-middle-y",
    //                     "bg-primary",
    //                     "text-white",
    //                     "rounded",
    //                     "py-1",
    //                     "px-3",
    //                     "ms-4"
    //                   )}
    //                 >
    //                   ${room.Price}/Night
    //                 </small>
    //               </div>
    //               <div className={cx("p-4", "mt-2")}>
    //                 <div
    //                   className={cx(
    //                     "d-flex",
    //                     "justify-content-between",
    //                     "mb-3"
    //                   )}
    //                 >
    //                   <h5 className={cx("mb-0")}>{room.Status}</h5>
    //                   <div className={cx("ps-2")}>
    //                     {/* Giả sử đánh giá mặc định 5 sao */}
    //                     <FontAwesomeIcon
    //                       icon={faStar}
    //                       className={cx("text-primary", "me-1")}
    //                     />
    //                     <FontAwesomeIcon
    //                       icon={faStar}
    //                       className={cx("text-primary", "me-1")}
    //                     />
    //                     <FontAwesomeIcon
    //                       icon={faStar}
    //                       className={cx("text-primary", "me-1")}
    //                     />
    //                     <FontAwesomeIcon
    //                       icon={faStar}
    //                       className={cx("text-primary", "me-1")}
    //                     />
    //                     <FontAwesomeIcon
    //                       icon={faStar}
    //                       className={cx("text-primary", "me-1")}
    //                     />
    //                   </div>
    //                 </div>
    //                 <div className={cx("d-flex", "mb-3")}>
    //                   <small className={cx("border-end", "me-3", "pe-3")}>
    //                     <FontAwesomeIcon
    //                       icon={faBed}
    //                       className={cx("text-primary", "me-2")}
    //                     />
    //                     {room.NumberOfFloor} Floor
    //                   </small>
    //                   <small className={cx("border-end", "me-3", "pe-3")}>
    //                     <FontAwesomeIcon
    //                       icon={faBath}
    //                       className={cx("text-primary", "me-2")}
    //                     />
    //                     2 Bath
    //                   </small>
    //                   <small>
    //                     <FontAwesomeIcon
    //                       icon={faWifi}
    //                       className={cx("text-primary", "me-2")}
    //                     />
    //                     Wifi
    //                   </small>
    //                 </div>
    //                 <p className={cx("text-body", "mb-3")}>
    //                   {room.Description}
    //                 </p>
    //                 <div className={cx("d-flex", "justify-content-between")}>
    //                   <a
    //                     className={cx(
    //                       "btn",
    //                       "btn-sm",
    //                       "btn-primary",
    //                       "rounded",
    //                       "py-2",
    //                       "px-4"
    //                     )}
    //                     href=""
    //                   >
    //                     View Detail
    //                   </a>
    //                   <a
    //                     className={cx(
    //                       "btn",
    //                       "btn-sm",
    //                       "btn-dark",
    //                       "rounded",
    //                       "py-2",
    //                       "px-4"
    //                     )}
    //                     href=""
    //                   >
    //                     Book Now
    //                   </a>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //         {rooms.length === 0 && (
    //           <div className={cx("col-12", "text-center")}>
    //             No rooms available.
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    //   {/* Room End */}
    // </div>
  );
}
