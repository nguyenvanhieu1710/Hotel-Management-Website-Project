import { useState } from "react";
import {
  FaBell,
  FaTag,
  FaCar,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import styles from "./Notification.module.css";

const notifications = [
  {
    id: 1,
    type: "transport",
    title: "Your airport transfer is confirmed!",
    message:
      "Driver will pick you up at 10:00 AM tomorrow. Please be ready at the lobby.",
    time: "2 minutes ago",
    unread: true,
    icon: <FaCar color="#fea116" />,
  },
  {
    id: 2,
    type: "promotion",
    title: "Limited Time Offer: 20% Off All Rooms!",
    message: "Book now and enjoy exclusive discounts for your next stay.",
    time: "1 hour ago",
    unread: true,
    icon: <FaTag color="#28a745" />,
  },
  {
    id: 3,
    type: "booking",
    title: "Your room booking is successful!",
    message: "Check-in: 15 July, 2:00 PM. We look forward to welcoming you!",
    time: "Yesterday",
    unread: false,
    icon: <FaCheckCircle color="#007bff" />,
  },
  {
    id: 4,
    type: "info",
    title: "Hotel pool maintenance notice",
    message: "The swimming pool will be closed for maintenance on 18 July.",
    time: "2 days ago",
    unread: false,
    icon: <FaInfoCircle color="#6c757d" />,
  },
];

export default function Notification() {
  const [notiList] = useState(notifications);
  return (
    <div className={styles.notiContainer}>
      <div className={styles.notiHeader}>
        <FaBell className={styles.notiBell} />
        <h2>Notifications</h2>
      </div>
      <div className={styles.notiList}>
        {notiList.length === 0 ? (
          <div className={styles.notiEmpty}>No notifications yet.</div>
        ) : (
          notiList.map((noti) => (
            <div
              key={noti.id}
              className={
                styles.notiItem + (noti.unread ? " " + styles.unread : "")
              }
            >
              <div className={styles.notiIcon}>{noti.icon}</div>
              <div className={styles.notiContent}>
                <div className={styles.notiTitle}>{noti.title}</div>
                <div className={styles.notiMsg}>{noti.message}</div>
                <div className={styles.notiTime}>{noti.time}</div>
              </div>
              {noti.unread && <span className={styles.notiBadge}></span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
