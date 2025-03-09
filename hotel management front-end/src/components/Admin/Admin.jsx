import classNames from "classnames/bind";

import Navigation from "./Navigation/Navigation.jsx";
import Content from "./Content/Content.jsx";
import bootstrapStyles from "../../assets/css/bootstrap-v4dot3dot1.module.css";
import styles from "../../assets/css/admin.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function Admin() {
  return (
    <div className={cx("wrapper", "d-flex", "align-items-stretch")}>
      <Navigation />
      <Content />
    </div>
  );
}
