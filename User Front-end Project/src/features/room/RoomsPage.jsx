import { useState } from "react";
import classNames from "classnames/bind";
import { useLocation } from "react-router-dom";

import Room from "../../components/Room/Room";
import RoomFilter from "../../components/Room/RoomFilter";
import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function RoomsPage() {
  const location = useLocation();
  const [filters, setFilters] = useState(location.state || null);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className={cx("container-fluid", "p-0")}>
      {/* Page Header */}
      <div className={cx("container-xxl", "py-5", "bg-dark", "mb-5")}>
        <div className={cx("container", "my-5", "py-5")}>
          <div className={cx("row", "align-items-center", "g-5")}>
            <div className={cx("col-lg-6", "text-center", "text-lg-start")}>
              <h1
                className={cx(
                  "display-3",
                  "text-white",
                  "animated",
                  "slideInLeft"
                )}
              >
                Our Rooms
              </h1>
              <nav aria-label="breadcrumb">
                <ol
                  className={cx(
                    "breadcrumb",
                    "justify-content-center",
                    "justify-content-lg-start"
                  )}
                >
                  <li className={cx("breadcrumb-item")}>
                    <a className={cx("text-white")} href="/">
                      Home
                    </a>
                  </li>
                  <li
                    className={cx("breadcrumb-item", "text-white", "active")}
                    aria-current="page"
                  >
                    Rooms
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Content */}
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

          {/* Room Filter */}
          <RoomFilter
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />

          {/* Room Component */}
          <Room filters={filters} />
        </div>
      </div>
    </div>
  );
}
