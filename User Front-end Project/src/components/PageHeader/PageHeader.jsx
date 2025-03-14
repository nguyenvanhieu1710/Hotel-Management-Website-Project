import classNames from "classnames/bind";
import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import CarouselOneImage from "../../assets/img/carousel-1.jpg";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function PageHeader() {
  return (
    <div>
      {/* Page Header Start */}
      <div
        className={cx("container-fluid", "page-header", "mb-5", "p-0")}
        style={{ backgroundImage: `url(${CarouselOneImage})` }}
      >
        <div className={cx("container-fluid", "page-header-inner", "py-5")}>
          <div className={cx("container", "text-center", "pb-5")}>
            <h1
              className={cx(
                "display-3",
                "text-white",
                "mb-3",
                "animated",
                "slideInDown"
              )}
            >
              About Us
            </h1>
            <nav aria-label="breadcrumb">
              <ol
                className={cx(
                  "breadcrumb",
                  "justify-content-center",
                  "text-uppercase"
                )}
              >
                <li className={cx("breadcrumb-item")}>
                  <a href="#">Home</a>
                </li>
                <li className={cx("breadcrumb-item")}>
                  <a href="#">Pages</a>
                </li>
                <li
                  className={cx("breadcrumb-item", "text-white", "active")}
                  aria-current="page"
                >
                  About
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      {/* Page Header End */}
    </div>
  );
}
