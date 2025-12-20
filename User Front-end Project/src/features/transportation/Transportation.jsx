import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import styles from "./Transportation.module.css";
import taxiImg from "../../assets/img/transportation-1.jpg";
import carImg from "../../assets/img/transportation-2.jpg";
import planeImg from "../../assets/img/transportation-3.jpg";
import busImg from "../../assets/img/transportation-4.jpg";
import motorbikeImg from "../../assets/img/transportation-5.jpg";

const transportationOptions = [
  {
    id: 1,
    name: "Taxi",
    description:
      "Fast and convenient taxi service at reasonable prices for all your city journeys.",
    price: "From $0.4/km",
    image: taxiImg,
  },
  {
    id: 2,
    name: "Private Car",
    description:
      "Rent a private car with a professional driver, perfect for families or groups.",
    price: "From $20/day",
    image: carImg,
  },
  {
    id: 3,
    name: "Airport Transfer",
    description:
      "Safe and punctual airport transfer service with helpful luggage assistance.",
    price: "From $8/ride",
    image: planeImg,
  },
  {
    id: 4,
    name: "Bus",
    description: "Economical travel with city and intercity bus routes.",
    price: "From $0.3/ride",
    image: busImg,
  },
  {
    id: 5,
    name: "Motorbike",
    description: "Rent a motorbike and freely explore the city your way.",
    price: "From $5/day",
    image: motorbikeImg,
  },
];

const arrivalMessages = {
  Taxi: {
    text: "Your taxi will arrive in about 5 minutes. Please be ready at the lobby.",
    time: 5,
  },
  "Private Car": {
    text: "Your private car will arrive in about 15 minutes. Please wait at the main entrance.",
    time: 15,
  },
  "Airport Transfer": {
    text: "Your airport transfer will arrive in about 30 minutes. Please prepare your luggage.",
    time: 30,
  },
  Bus: {
    text: "The next bus will arrive in about 10 minutes. Please check the bus stop.",
    time: 10,
  },
  Motorbike: {
    text: "Your motorbike will be ready in about 3 minutes. Please proceed to the parking area.",
    time: 3,
  },
};

function handleBook(option) {
  const info = arrivalMessages[option.name] || {
    text: "Your vehicle is being arranged.",
    time: 10,
  };
  Swal.fire({
    icon: "info",
    title: `Booking: ${option.name}`,
    html: `<b>${info.text}</b><br/><br/>Estimated arrival: <span style='color:#fea116;font-weight:600;'>${info.time} minutes</span>`,
    confirmButtonText: "OK",
  });
}

export default function Transportation() {
  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  return (
    <div className={styles.transportContainer} data-aos="fade-up">
      <h2 className={styles.sectionTitle}>Popular Transportation Options</h2>
      <div className={styles.grid}>
        {transportationOptions.map((option) => (
          <div key={option.id} className={styles.card}>
            <div className={styles.cardImageWrapper}>
              <img
                src={option.image}
                alt={option.name}
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{option.name}</h3>
              <p className={styles.cardDesc}>{option.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.cardPrice}>{option.price}</span>
                <button
                  className={styles.bookBtn}
                  onClick={() => handleBook(option)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
