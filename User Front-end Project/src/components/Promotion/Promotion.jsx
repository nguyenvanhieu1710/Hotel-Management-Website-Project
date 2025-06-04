import { Button } from "primereact/button";
import classNames from "classnames/bind";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "./Promotion.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

const promotions = [
  {
    id: 1,
    title: "Summer Special Offer",
    description: "Book now and get 20% off on all rooms!",
    subDescription: "Limited time offer for summer bookings",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    discount: "20% OFF",
    validUntil: "2024-08-31",
    code: "SUMMER2024",
  },
  {
    id: 2,
    title: "Weekend Getaway Package",
    description: "Perfect weekend escape with breakfast included",
    subDescription: "Valid for weekend stays only",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80",
    discount: "15% OFF",
    validUntil: "2024-12-31",
    code: "WEEKEND15",
  },
  {
    id: 3,
    title: "Early Bird Special",
    description: "Book 30 days in advance and save big!",
    subDescription: "Minimum 3 nights stay required",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    discount: "25% OFF",
    validUntil: "2024-12-31",
    code: "EARLYBIRD25",
  },
];

export default function Promotion() {
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleClaimPromotion = (promo) => {
    Swal.fire({
      title: "Promotion Code",
      html: `
        <div class="promo-code-container">
          <p>Your promotion code is:</p>
          <div class="promo-code">${promo.code}</div>
          <p class="valid-until">Valid until: ${formatDate(
            promo.validUntil
          )}</p>
        </div>
      `,
      icon: "success",
      confirmButtonText: "Copy Code",
      showCancelButton: true,
      cancelButtonText: "Close",
      customClass: {
        container: "promo-swal-container",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigator.clipboard.writeText(promo.code);
        Swal.fire({
          title: "Copied!",
          text: "Promotion code has been copied to clipboard",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className={cx("promotion-container")} data-aos="fade-up">
      <div className={cx("promotion-header")}>
        <h2>Special Offers & Deals</h2>
        <Button
          icon={isGridView ? "pi pi-list" : "pi pi-th-large"}
          className={cx("view-toggle-btn")}
          onClick={toggleView}
          tooltip={`Switch to ${isGridView ? "List" : "Grid"} View`}
          tooltipOptions={{ position: "bottom" }}
        />
      </div>

      <div className={cx("promotion-grid", { "list-view": !isGridView })}>
        {promotions.map((promo) => (
          <div key={promo.id} className={cx("promotion-card")}>
            <div className={cx("promotion-image")}>
              <img src={promo.image} alt={promo.title} />
              <div className={cx("discount-badge")}>{promo.discount}</div>
            </div>
            <div className={cx("promotion-content")}>
              <h3>{promo.title}</h3>
              <p className={cx("description")}>{promo.description}</p>
              <p className={cx("sub-description")}>{promo.subDescription}</p>
              <div className={cx("valid-until")}>
                Valid until: {formatDate(promo.validUntil)}
              </div>
              <Button
                label="Claim Offer"
                className={cx("claim-button")}
                onClick={() => handleClaimPromotion(promo)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
