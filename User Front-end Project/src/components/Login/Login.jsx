import classNames from "classnames/bind";
import styles from "./Login.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

const cx = classNames.bind(styles);

export default function Login() {
  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("background")}>
          <div className={cx("shape")}></div>
          <div className={cx("shape")}></div>
        </div>
        <form className={cx("form")}>
          <h3>Login Here</h3>

          <label htmlFor="username" className={cx("label")}>
            Username
          </label>
          <input
            type="text"
            placeholder="Email or Phone"
            id="username"
            className={cx("input")}
          />

          <label htmlFor="password" className={cx("label")}>
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            id="password"
            className={cx("input")}
          />

          <button className={cx("btn-login")}>Log In</button>
          <div className={cx("social")}>
            <div className={cx("go")}>
              <FontAwesomeIcon icon={faGoogle} /> Google
            </div>
            <div className={cx("fb")}>
              <FontAwesomeIcon icon={faFacebook} /> Facebook
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
