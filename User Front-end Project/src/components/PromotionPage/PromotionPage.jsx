import { Card } from "primereact/card";
import { Button } from "primereact/button";
import classNames from "classnames/bind";

// import Spinner from "../Spinner/Spinner";
import Header from "../Header/Header";
import PageHeader from "../PageHeader/PageHeader";
// import Booking from "../Booking/Booking";
// import History from "../HistoryPage/HistoryPage";
import Newsletter from "../Newsletter/Newsletter";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";

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

const PromotionPage = () => {
  const pageHeaderProps = {
    title: "Promotion",
  };
  return (
    <div>
      {/* <Spinner /> */}
      <Header />
      <PageHeader {...pageHeaderProps} />
      <div className={cx("container", "my-5")}>
        <h2 className={cx("mb-4")}>View and Claim Promotions</h2>
        <div className={cx("row")}>
          {promotions.map((promo) => (
            <div key={promo.id} className={cx("col-md-6", "mb-4")}>
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
                  icon="pi pi-check"
                  className={cx("p-button-success")}
                  onClick={() => alert(`You have claimed: ${promo.title}`)}
                />
              </Card>
            </div>
          ))}
        </div>
      </div>
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default PromotionPage;
