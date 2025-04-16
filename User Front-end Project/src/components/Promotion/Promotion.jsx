import { Card } from "primereact/card";
import { Button } from "primereact/button";
import classNames from "classnames/bind";
import Swal from "sweetalert2";
import { useState } from "react";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "./Promotion.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

const promotions = [
  {
    id: 1,
    title: "Summer Promotion",
    description: "Enjoy a 20% discount on all rooms this summer!",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4CTQo_YrIea8Dfle4Jjh4Hf9aYTGxNePgCw&s",
  },
  {
    id: 2,
    title: "Holiday Combo",
    description:
      "Receive a combo package including a room and a complimentary meal.",
    image:
      "https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg",
  },
];

export default function Promotion() {
  const [isGridView, setIsGridView] = useState(false);

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  return (
    <div className={cx("container", "my-5")}>
      <div
        className={cx(
          "d-flex",
          "justify-content-between",
          "align-items-center",
          "mb-3"
        )}
      >
        <h2 className={cx("mb-0")}>View and Claim Promotions</h2>
        <Button
          label={`Switch to ${isGridView ? "List" : "Grid"} View`}
          className={cx("p-button-outlined")}
          onClick={toggleView}
        />
      </div>
      <div
        className={cx(
          "row",
          isGridView ? "promotion-grid-view" : "promotion-list-view"
        )}
      >
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className={cx(isGridView ? "col-md-4" : "col-md-12", "mb-4")}
          >
            <Card
              header={
                <img
                  alt={promo.title}
                  src={promo.image}
                  className={cx("card-img-top")}
                />
              }
              title={promo.title}
            >
              <p>{promo.description}</p>
              <Button
                label="Claim Promotion"
                className={cx("p-button-success")}
                onClick={() => {
                  Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Promotion claimed successfully!",
                    confirmButtonText: "OK",
                  });
                }}
              />
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
