import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import bootstrapStyles from "../../assets/css/bootstrap.module.css";
import styles from "../../assets/css/style.module.css";
import backToTopStyles from "./BackToTop.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles, ...backToTopStyles };
const cx = classNames.bind(mergedStyles);

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <a
      onClick={scrollToTop}
      className={cx(
        "btn",
        "btn-lg",
        "btn-lg-square",
        "back-to-top",
        visible ? "d-flex" : "d-none"
      )}
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </a>
  );
};

export default BackToTop;
