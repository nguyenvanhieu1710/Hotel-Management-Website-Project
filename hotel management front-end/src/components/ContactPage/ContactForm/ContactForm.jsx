import classNames from "classnames/bind";
import bootstrapStyles from "../../../assets/css/bootstrap.module.css";
import styles from "../../../assets/css/style.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function ContactForm() {
  return (
    <div>
      {/* Contact Start */}
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
              Contact Us
            </h6>
            <h1 className={cx("mb-5")}>
              <span className={cx("text-primary", "text-uppercase")}>
                Contact
              </span>{" "}
              For Any Query
            </h1>
          </div>
          <div className={cx("row", "g-4")}>
            <div className={cx("col-12")}>
              <div className={cx("row", "gy-4")}>
                <div className={cx("col-md-4")}>
                  <h6
                    className={cx(
                      "section-title",
                      "text-start",
                      "text-primary",
                      "text-uppercase"
                    )}
                  >
                    Booking
                  </h6>
                  <p>
                    <i
                      className={cx(
                        "fa",
                        "fa-envelope-open",
                        "text-primary",
                        "me-2"
                      )}
                    ></i>
                    book@example.com
                  </p>
                </div>
                <div className={cx("col-md-4")}>
                  <h6
                    className={cx(
                      "section-title",
                      "text-start",
                      "text-primary",
                      "text-uppercase"
                    )}
                  >
                    General
                  </h6>
                  <p>
                    <i
                      className={cx(
                        "fa",
                        "fa-envelope-open",
                        "text-primary",
                        "me-2"
                      )}
                    ></i>
                    info@example.com
                  </p>
                </div>
                <div className={cx("col-md-4")}>
                  <h6
                    className={cx(
                      "section-title",
                      "text-start",
                      "text-primary",
                      "text-uppercase"
                    )}
                  >
                    Technical
                  </h6>
                  <p>
                    <i
                      className={cx(
                        "fa",
                        "fa-envelope-open",
                        "text-primary",
                        "me-2"
                      )}
                    ></i>
                    tech@example.com
                  </p>
                </div>
              </div>
            </div>
            <div
              className={cx("col-md-6", "wow", "fadeIn")}
              data-wow-delay="0.1s"
            >
              <iframe
                className={cx("position-relative", "rounded", "w-100", "h-100")}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
                frameBorder="0"
                style={{ minHeight: "350px", border: 0 }}
                allowFullScreen
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>
            <div className={cx("col-md-6")}>
              <div className={cx("wow", "fadeInUp")} data-wow-delay="0.2s">
                <form>
                  <div className={cx("row", "g-3")}>
                    <div className={cx("col-md-6")}>
                      <div className={cx("form-floating")}>
                        <input
                          type="text"
                          className={cx("form-control")}
                          id="name"
                          placeholder="Your Name"
                        />
                        <label htmlFor="name">Your Name</label>
                      </div>
                    </div>
                    <div className={cx("col-md-6")}>
                      <div className={cx("form-floating")}>
                        <input
                          type="email"
                          className={cx("form-control")}
                          id="email"
                          placeholder="Your Email"
                        />
                        <label htmlFor="email">Your Email</label>
                      </div>
                    </div>
                    <div className={cx("col-12")}>
                      <div className={cx("form-floating")}>
                        <input
                          type="text"
                          className={cx("form-control")}
                          id="subject"
                          placeholder="Subject"
                        />
                        <label htmlFor="subject">Subject</label>
                      </div>
                    </div>
                    <div className={cx("col-12")}>
                      <div className={cx("form-floating")}>
                        <textarea
                          className={cx("form-control")}
                          placeholder="Leave a message here"
                          id="message"
                          style={{ height: "150px" }}
                        ></textarea>
                        <label htmlFor="message">Message</label>
                      </div>
                    </div>
                    <div className={cx("col-12")}>
                      <button
                        className={cx("btn", "btn-primary", "w-100", "py-3")}
                        type="submit"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact End */}
    </div>
  );
}
