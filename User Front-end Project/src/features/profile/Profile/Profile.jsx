import { useState, useEffect } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  faFacebookF,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import bootstrapStyles from "../../../assets/css/bootstrap.module.css";
import styles from "./Profile.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function Profile() {
  const [userInformation, setUserInformation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    AOS.init({ duration: 3000 });

    const fetchUserData = async () => {
      try {
        if (user && user.account && user.account.AccountId) {
          const accountId = user.account.AccountId;
          // console.log("Account Id: " + accountId);

          const response = await axios.get(
            `http://localhost:3000/api/user/get-data-by-id/${accountId}`
          );
          setUserInformation(response.data[0]);
          // console.log("User information: " + response.data);
        } else {
          setError("Account information not found in local storage.");
        }
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("user")) {
      fetchUserData();
    } else {
      setError("User data not found in local storage.");
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userInformation) {
    return <div>No user information available.</div>;
  }

  return (
    <div
      className={cx(
        "page-content",
        "page-container",
        "d-flex",
        "justify-content-center"
      )}
      id="page-content"
    >
      <div className={cx("row", "container")}>
        <div className={cx("col-md-12")}>
          <div className={cx("card", "user-card-full")}>
            <div className={cx("row", "m-l-0", "m-r-0")}>
              <div
                className={cx("col-sm-4", "bg-c-lite-green", "user-profile")}
              >
                <div className={cx("card-block", "text-center", "text-white")}>
                  <div className={cx("m-b-25")}>
                    <img
                      src={userInformation.UserImage}
                      width={100}
                      height={100}
                      className={cx("img-radius")}
                      alt="User-Profile-Image"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h6 className={cx("f-w-600")}>{userInformation.UserName}</h6>
                  <p>
                    Identification Number:{" "}
                    {userInformation.IdentificationNumber}
                  </p>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className={cx("m-t-10", "f-16", "icon-edit")}
                  />
                </div>
              </div>
              <div className={cx("col-sm-8")}>
                <div className={cx("card-block")}>
                  <h6
                    className={cx("m-b-20", "p-b-5", "b-b-default", "f-w-600")}
                  >
                    Information
                  </h6>
                  <div className={cx("row")}>
                    <div className={cx("col-sm-6")}>
                      <p className={cx("m-b-10", "f-w-600")}>Email</p>
                      <h6 className={cx("text-muted", "f-w-400")}>
                        {user.account.Email}
                      </h6>
                    </div>
                    <div className={cx("col-sm-6")}>
                      <p className={cx("m-b-10", "f-w-600")}>Phone</p>
                      <h6 className={cx("text-muted", "f-w-400")}>
                        {userInformation.PhoneNumber}
                      </h6>
                    </div>
                  </div>
                  <div className={cx("row")}>
                    <div className={cx("col-sm-6")}>
                      <p className={cx("m-b-10", "f-w-600")}>Gender</p>
                      <h6 className={cx("text-muted", "f-w-400")}>
                        {userInformation.Gender}
                      </h6>
                    </div>
                    <div className={cx("col-sm-6")}>
                      <p className={cx("m-b-10", "f-w-600")}>Address</p>
                      <h6 className={cx("text-muted", "f-w-400")}>
                        {userInformation.Address}
                      </h6>
                    </div>
                  </div>
                  <ul
                    className={cx(
                      "social-link",
                      "list-unstyled",
                      "m-t-40",
                      "m-b-10"
                    )}
                  >
                    <li>
                      <a
                        href="#!"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title=""
                        data-original-title="facebook"
                        data-abc="true"
                      >
                        <FontAwesomeIcon icon={faFacebookF} />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#!"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title=""
                        data-original-title="twitter"
                        data-abc="true"
                      >
                        <FontAwesomeIcon icon={faTwitter} />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#!"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title=""
                        data-original-title="instagram"
                        data-abc="true"
                      >
                        <FontAwesomeIcon icon={faInstagram} />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
