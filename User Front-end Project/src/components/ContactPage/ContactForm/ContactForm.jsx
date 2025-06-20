import classNames from "classnames/bind";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import bootstrapStyles from "../../../assets/css/bootstrap.module.css";
import styles from "../../../assets/css/style.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function ContactForm() {
  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please fill in all fields.",
      });
      return;
    }
    setSending(true);
    const requestData = {
      name: form.name,
      email: form.email,
      message: `Subject: ${form.subject}\n${form.message}`,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/account/send-email",
        requestData
      );
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
        });
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to send message.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to connect to the server.",
      });
      console.error("Error sending contact form:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {/* Contact Start */}
      <div className={cx("container-xxl", "py-5")}>
        <div className={cx("container")}>
          <div
            data-aos="fade-up"
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
                    nguyenvanhieu@gmail.com
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
                    nguyenvanhieu@gmail.com
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
                    nguyenvanhieu@gmail.com
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15743722.79496086!2d95.23367880582101!3d15.555151669615718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31157a4d736a1e5f%3A0xb03bb0c9e2fe62be!2zVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1750343971353!5m2!1svi!2s"
                frameBorder="0"
                style={{ minHeight: "350px", border: 0 }}
                allowFullScreen
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>
            <div className={cx("col-md-6")} data-aos="fade-up">
              <div className={cx("wow", "fadeInUp")} data-wow-delay="0.2s">
                <form onSubmit={handleSubmit}>
                  <div className={cx("row", "g-3")}>
                    <div className={cx("col-md-6")}>
                      <div className={cx("form-floating")}>
                        <input
                          type="text"
                          className={cx("form-control")}
                          id="name"
                          placeholder="Your Name"
                          value={form.name}
                          onChange={handleInputChange}
                          disabled={sending}
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
                          value={form.email}
                          onChange={handleInputChange}
                          disabled={sending}
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
                          value={form.subject}
                          onChange={handleInputChange}
                          disabled={sending}
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
                          value={form.message}
                          onChange={handleInputChange}
                          disabled={sending}
                        ></textarea>
                        <label htmlFor="message">Message</label>
                      </div>
                    </div>
                    <div className={cx("col-12")}>
                      <button
                        className={cx("btn", "btn-primary", "w-100", "py-3")}
                        type="submit"
                        disabled={sending}
                      >
                        {sending ? "Sending..." : "Send Message"}
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
