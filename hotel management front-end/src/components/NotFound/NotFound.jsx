import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./NotFound.module.scss";

const cx = classNames.bind(styles);

export default function NotFound() {
  return (
    <div className={cx("body-notfound")}>
      <div className={cx("bsod", "container")}>
        <h1 className={cx("neg", "title")}>
          <span className={cx("bg")}>Error - 404</span>
        </h1>
        <p className={cx("p", "mg-t-b-1em")}>
          An error has occured, to continue:
        </p>
        <p className={cx("p")}>
          * Return to our homepage.
          <br />* Send us an e-mail about this error and try later.
        </p>
        <nav className={cx("nav")}>
          <Link to="/" className={cx("link")}>
            index
          </Link>
          <span className={cx("color-white")}>&nbsp;|&nbsp;</span>
          <Link to="/" className={cx("link")}>
            webmaster
          </Link>
        </nav>
      </div>
    </div>
  );
}
