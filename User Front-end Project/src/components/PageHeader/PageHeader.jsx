import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import pageHeaderStyles from "./PageHeader.module.css";
import CarouselOneImage from "../../assets/img/carousel-1.jpg";

const mergedStyles = { ...bootstrapStyles, ...styles, ...pageHeaderStyles };
const cx = classNames.bind(mergedStyles);

export default function PageHeader(props) {
  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

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
              data-aos="fade-down"
              className={cx(
                "display-3",
                "text-white",
                "mb-3",
                "animated",
                "slideInDown"
              )}
            >
              {props.title}
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
                  <Link to="/">Home</Link>
                </li>
                <li className={cx("breadcrumb-item", "breadcrumbSeparator")}>
                  <Link to="/">Pages</Link>
                </li>
                <li
                  className={cx(
                    "breadcrumb-item",
                    "breadcrumbSeparator",
                    "text-white",
                    "active"
                  )}
                  aria-current="page"
                >
                  {props.title}
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

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
};
