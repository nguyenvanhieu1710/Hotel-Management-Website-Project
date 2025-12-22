import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState, useMemo } from "react";

import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import serviceStyles from "./Service.module.scss";
import { useServices } from "../../hooks";
import Pagination from "../Pagination/Pagination";

const cx = classNames.bind({ ...bootstrapStyles, ...styles, ...serviceStyles });

// Static params to prevent infinite loops
const EMPTY_PARAMS = {};
const PUBLIC_OPTIONS = { isPublic: true };
const ITEMS_PER_PAGE = 6; // Show 6 services per page

export default function Service() {
  const [currentPage, setCurrentPage] = useState(1);

  // Use hooks for data fetching with static params
  const { services, loading, error } = useServices(
    EMPTY_PARAMS,
    PUBLIC_OPTIONS
  );

  // Pagination logic
  const totalItems = services?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentServices = useMemo(() => {
    return services?.slice(startIndex, endIndex) || [];
  }, [services, startIndex, endIndex]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of services section
    const servicesSection = document.querySelector(".services-section");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container")}>
          <div className={cx("text-center")}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container")}>
          <div className={cx("text-center")}>
            <div className="alert alert-danger" role="alert">
              Error loading services: {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-aos="fade-up">
      {/* Service Start */}
      <div className={cx("container-xxl", "py-5", "services-section")}>
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
              Our Services
            </h6>
            <h1 className={cx("mb-5")}>
              Explore Our{" "}
              <span className={cx("text-primary", "text-uppercase")}>
                Services
              </span>
            </h1>
          </div>
          <div className={cx("row", "g-4")}>
            {currentServices?.map((service) => (
              <div
                key={service.ServiceId}
                className={cx("col-lg-4", "col-md-6", "wow", "fadeInUp")}
                data-wow-delay="0.1s"
                data-aos="fade-right"
              >
                <a
                  className={cx(
                    "service-item",
                    "rounded",
                    "service-item-hover"
                  )}
                  href=""
                >
                  <div
                    className={cx(
                      "service-icon",
                      "bg-transparent",
                      "border",
                      "rounded",
                      "p-1"
                    )}
                  >
                    <div
                      className={cx(
                        "w-100",
                        "h-100",
                        "border",
                        "rounded",
                        "d-flex",
                        "align-items-center",
                        "justify-content-center"
                      )}
                    >
                      {/* <FontAwesomeIcon
                        icon={faHeart}
                        size="2x"
                        className={cx("text-primary", "icon-service")}
                      /> */}
                      <img
                        src={service.ServiceImage}
                        alt={service.ServiceName}
                        className={cx("service-image")}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <h5 className={cx("mb-3")}>{service.ServiceName}</h5>
                  <p className={cx("text-body", "mb-0")}>
                    {service.Description}
                  </p>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            showInfo={true}
            showFirstLast={true}
            maxVisiblePages={5}
            size="md"
            variant="primary"
          />
        )}
      </div>
      {/* Service End */}
    </div>
  );
}
