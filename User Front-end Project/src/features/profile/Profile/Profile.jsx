import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEdit,
  faSave,
  faTimes,
  faCamera,
  faKey,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faVenusMars,
  faIdCard,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";

import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { useUser } from "../../../hooks/useUsers";
import { validationRules, validateForm } from "../../../utils/validation";
import bootstrapStyles from "../../../assets/css/bootstrap.module.css";
import styles from "./Profile.module.css";

const mergedStyles = { ...bootstrapStyles, ...styles };
const cx = classNames.bind(mergedStyles);

export default function Profile() {
  const [user] = useLocalStorage("user", null);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Use useUser hook for profile data management
  const {
    user: userInformation,
    loading,
    error,
    refetch,
    updateUser,
    changePassword,
    // uploadAvatar - temporarily disabled
  } = useUser(user?.AccountId, { autoFetch: !!user?.AccountId });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    if (userInformation) {
      setFormData({
        UserName: userInformation.UserName || "",
        PhoneNumber: userInformation.PhoneNumber || "",
        Gender: userInformation.Gender || "",
        Address: userInformation.Address || "",
        IdentificationNumber: userInformation.IdentificationNumber || "",
      });
    }
  }, [userInformation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateProfileForm = () => {
    const rules = {
      UserName: [
        validationRules.required,
        (value) => validationRules.minLength(value, 2, "Full name"),
      ],
      PhoneNumber: [validationRules.required, validationRules.phone],
      Gender: [validationRules.required],
    };

    const { isValid, errors } = validateForm(formData, rules);
    setFormErrors(errors);
    return isValid;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the errors in the form",
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    try {
      await updateUser(formData);
      setIsEditing(false);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profile updated successfully",
        confirmButtonColor: "#ffc107",
        timer: 2000,
      });
    } catch (err) {
      console.error("Failed to update profile:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message || "Failed to update profile. Please try again.",
        confirmButtonColor: "#ffc107",
      });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate passwords
    const currentPasswordError = validationRules.required(
      passwordData.currentPassword,
      "Current password"
    );
    const newPasswordError = validationRules.password(passwordData.newPassword);
    const confirmPasswordError = validationRules.confirmPassword(
      passwordData.confirmPassword,
      passwordData.newPassword
    );

    if (currentPasswordError || newPasswordError || confirmPasswordError) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: currentPasswordError || newPasswordError || confirmPasswordError,
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Password changed successfully",
        confirmButtonColor: "#ffc107",
        timer: 2000,
      });
    } catch (err) {
      console.error("Failed to change password:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message || "Failed to change password. Please try again.",
        confirmButtonColor: "#ffc107",
      });
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please select an image file",
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Image size must be less than 5MB",
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    // Show loading
    Swal.fire({
      title: "Uploading...",
      text: "Please wait while we upload your avatar",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        try {
          const data = reader.result.split(",")[1];
          const postData = {
            name: file.name,
            type: file.type,
            data: data,
          };

          // Upload to Google Apps Script
          const response = await fetch(
            "https://script.google.com/macros/s/AKfycbyz_D55hBv_H6AqQqwmLKQeYIRbBAw6n-zkxf_J92QV7F8V9dTUF5NJi2533S7nnoBL/exec",
            {
              method: "POST",
              body: JSON.stringify(postData),
            }
          );

          const result = await response.json();
          console.log("API Response When Upload Image:", result);

          if (result.link) {
            // Only update UserImage, don't send other fields to avoid null constraint errors
            const updateData = {
              UserImage: result.link,
            };

            await updateUser(updateData);

            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Avatar uploaded successfully",
              confirmButtonColor: "#ffc107",
              timer: 2000,
            });

            // Refresh user data to show new avatar
            refetch();
          } else {
            throw new Error("Upload failed! No image link returned.");
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          Swal.fire({
            icon: "error",
            title: "Upload Failed",
            text:
              uploadError.message ||
              "Failed to upload avatar. Please try again.",
            confirmButtonColor: "#ffc107",
          });
        }
      };

      reader.onerror = () => {
        Swal.fire({
          icon: "error",
          title: "File Read Error",
          text: "Failed to read the selected file",
          confirmButtonColor: "#ffc107",
        });
      };
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message || "Failed to upload avatar. Please try again.",
        confirmButtonColor: "#ffc107",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormErrors({});
    // Reset form data to original values
    if (userInformation) {
      setFormData({
        UserName: userInformation.UserName || "",
        PhoneNumber: userInformation.PhoneNumber || "",
        Gender: userInformation.Gender || "",
        Address: userInformation.Address || "",
        IdentificationNumber: userInformation.IdentificationNumber || "",
      });
    }
  };

  if (!user) {
    return (
      <div className={cx("container-fluid", "py-5", "bg-light")}>
        <div className={cx("container")}>
          <div className={cx("row", "justify-content-center")}>
            <div className={cx("col-lg-6", "text-center")}>
              <div className={cx("bg-white", "rounded", "shadow", "p-5")}>
                <FontAwesomeIcon
                  icon={faUser}
                  className={cx("text-primary", "mb-3")}
                  size="3x"
                />
                <h4 className={cx("mb-3")}>Please Log In</h4>
                <p className={cx("text-muted", "mb-4")}>
                  You need to be logged in to view your profile.
                </p>
                <a href="/login" className={cx("btn", "btn-primary", "px-4")}>
                  Go to Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={cx("container-fluid", "py-5", "bg-light")}>
        <div className={cx("container")}>
          <div className={cx("row", "justify-content-center")}>
            <div className={cx("col-lg-6", "text-center")}>
              <div className={cx("bg-white", "rounded", "shadow", "p-5")}>
                <div
                  className={cx("spinner-border", "text-primary", "mb-3")}
                  role="status"
                >
                  <span className={cx("visually-hidden")}>Loading...</span>
                </div>
                <h5>Loading your profile...</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cx("container-fluid", "py-5", "bg-light")}>
        <div className={cx("container")}>
          <div className={cx("row", "justify-content-center")}>
            <div className={cx("col-lg-6", "text-center")}>
              <div className={cx("bg-white", "rounded", "shadow", "p-5")}>
                <FontAwesomeIcon
                  icon={faTimes}
                  className={cx("text-danger", "mb-3")}
                  size="3x"
                />
                <h4 className={cx("text-danger", "mb-3")}>
                  Error Loading Profile
                </h4>
                <p className={cx("text-muted", "mb-4")}>{error}</p>
                <button
                  className={cx("btn", "btn-primary", "px-4")}
                  onClick={() => refetch()}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userInformation) {
    return (
      <div className={cx("container-fluid", "py-5", "bg-light")}>
        <div className={cx("container")}>
          <div className={cx("row", "justify-content-center")}>
            <div className={cx("col-lg-6", "text-center")}>
              <div className={cx("bg-white", "rounded", "shadow", "p-5")}>
                <FontAwesomeIcon
                  icon={faUser}
                  className={cx("text-warning", "mb-3")}
                  size="3x"
                />
                <h4 className={cx("mb-3")}>No Profile Data</h4>
                <p className={cx("text-muted", "mb-4")}>
                  Unable to load your profile information.
                </p>
                <button
                  className={cx("btn", "btn-primary", "px-4")}
                  onClick={() => refetch()}
                >
                  Reload Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cx("container-fluid", "py-5", "bg-light")}
      data-aos="fade-up"
    >
      <div className={cx("container")}>
        {/* Header */}
        <div className={cx("row", "mb-4")}>
          <div className={cx("col-12")}>
            <div
              className={cx(
                "d-flex",
                "justify-content-between",
                "align-items-center",
                "flex-wrap"
              )}
            >
              <div className={cx("mb-3", "mb-md-0")}>
                <h2 className={cx("mb-1")}>My Profile</h2>
                <p className={cx("text-muted", "mb-0")}>
                  Manage your account information
                </p>
              </div>
              <div>
                {!isEditing ? (
                  <button
                    className={cx("btn", "btn-primary")}
                    onClick={() => setIsEditing(true)}
                  >
                    <FontAwesomeIcon icon={faEdit} className={cx("me-2")} />
                    Edit Profile
                  </button>
                ) : (
                  <div className={cx("d-flex", "gap-2")}>
                    <button
                      className={cx("btn", "btn-success")}
                      onClick={handleSaveProfile}
                    >
                      <FontAwesomeIcon icon={faSave} className={cx("me-2")} />
                      Save
                    </button>
                    <button
                      className={cx("btn", "btn-secondary")}
                      onClick={handleCancelEdit}
                    >
                      <FontAwesomeIcon icon={faTimes} className={cx("me-2")} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={cx("row")}>
          {/* Profile Card */}
          <div className={cx("col-lg-4", "mb-4")}>
            <div className={cx("card", "shadow", "border-0", "h-100")}>
              <div className={cx("card-body", "text-center", "p-4")}>
                {/* Avatar Section */}
                <div
                  className={cx(
                    "position-relative",
                    "d-inline-block",
                    "mb-4",
                    "avatar-container"
                  )}
                >
                  <img
                    src={
                      userInformation.UserImage ||
                      "https://via.placeholder.com/120"
                    }
                    alt="Profile"
                    className={cx(
                      "rounded-circle",
                      "border",
                      "border-3",
                      "border-primary",
                      "avatar-img"
                    )}
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={cx(
                      "position-absolute",
                      "bottom-0",
                      "end-0",
                      "rounded-circle",
                      "d-flex",
                      "align-items-center",
                      "justify-content-center",
                      "camera-btn"
                    )}
                    style={{
                      width: "40px",
                      height: "40px",
                      cursor: "pointer",
                      backgroundColor: "#212529",
                      color: "#ffc107",
                      border: "3px solid #ffc107",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }}
                    title="Upload avatar"
                  >
                    <FontAwesomeIcon icon={faCamera} />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className={cx("d-none")}
                  />
                </div>

                <h4 className={cx("mb-1")}>{userInformation.UserName}</h4>
                <p className={cx("text-muted", "mb-3")}>{user.Email}</p>

                <button
                  className={cx("btn", "btn-outline-primary", "w-100")}
                  onClick={() => setShowChangePassword(true)}
                >
                  <FontAwesomeIcon icon={faKey} className={cx("me-2")} />
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Information Card */}
          <div className={cx("col-lg-8")}>
            <div className={cx("card", "shadow", "border-0", "h-100")}>
              <div className={cx("card-body", "p-4")}>
                <div className={cx("row", "g-3")}>
                  {/* Full Name */}
                  <div className={cx("col-md-6")}>
                    <label className={cx("form-label", "fw-bold")}>
                      <FontAwesomeIcon
                        icon={faUser}
                        className={cx("me-2", "text-primary")}
                      />
                      Full Name
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="UserName"
                          value={formData.UserName}
                          onChange={handleInputChange}
                          className={cx("form-control", {
                            "is-invalid": formErrors.UserName,
                          })}
                          placeholder="Enter your full name"
                        />
                        {formErrors.UserName && (
                          <div className={cx("invalid-feedback")}>
                            {formErrors.UserName}
                          </div>
                        )}
                      </>
                    ) : (
                      <p
                        className={cx(
                          "form-control-plaintext",
                          "border-bottom",
                          "pb-2"
                        )}
                      >
                        {userInformation.UserName || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className={cx("col-md-6")}>
                    <label className={cx("form-label", "fw-bold")}>
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className={cx("me-2", "text-primary")}
                      />
                      Email Address
                    </label>
                    <p
                      className={cx(
                        "form-control-plaintext",
                        "border-bottom",
                        "pb-2",
                        "text-muted"
                      )}
                    >
                      {user.Email} <small>(Cannot be changed)</small>
                    </p>
                  </div>

                  {/* Phone */}
                  <div className={cx("col-md-6")}>
                    <label className={cx("form-label", "fw-bold")}>
                      <FontAwesomeIcon
                        icon={faPhone}
                        className={cx("me-2", "text-primary")}
                      />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="tel"
                          name="PhoneNumber"
                          value={formData.PhoneNumber}
                          onChange={handleInputChange}
                          className={cx("form-control", {
                            "is-invalid": formErrors.PhoneNumber,
                          })}
                          placeholder="Enter your phone number"
                        />
                        {formErrors.PhoneNumber && (
                          <div className={cx("invalid-feedback")}>
                            {formErrors.PhoneNumber}
                          </div>
                        )}
                      </>
                    ) : (
                      <p
                        className={cx(
                          "form-control-plaintext",
                          "border-bottom",
                          "pb-2"
                        )}
                      >
                        {userInformation.PhoneNumber || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className={cx("col-md-6")}>
                    <label className={cx("form-label", "fw-bold")}>
                      <FontAwesomeIcon
                        icon={faVenusMars}
                        className={cx("me-2", "text-primary")}
                      />
                      Gender
                    </label>
                    {isEditing ? (
                      <>
                        <select
                          name="Gender"
                          value={formData.Gender}
                          onChange={handleInputChange}
                          className={cx("form-select", {
                            "is-invalid": formErrors.Gender,
                          })}
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {formErrors.Gender && (
                          <div className={cx("invalid-feedback")}>
                            {formErrors.Gender}
                          </div>
                        )}
                      </>
                    ) : (
                      <p
                        className={cx(
                          "form-control-plaintext",
                          "border-bottom",
                          "pb-2"
                        )}
                      >
                        {userInformation.Gender || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* ID Number */}
                  <div className={cx("col-md-6")}>
                    <label className={cx("form-label", "fw-bold")}>
                      <FontAwesomeIcon
                        icon={faIdCard}
                        className={cx("me-2", "text-primary")}
                      />
                      ID Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="IdentificationNumber"
                        value={formData.IdentificationNumber}
                        onChange={handleInputChange}
                        className={cx("form-control")}
                        placeholder="Enter your ID number"
                      />
                    ) : (
                      <p
                        className={cx(
                          "form-control-plaintext",
                          "border-bottom",
                          "pb-2"
                        )}
                      >
                        {userInformation.IdentificationNumber || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className={cx("col-12")}>
                    <label className={cx("form-label", "fw-bold")}>
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className={cx("me-2", "text-primary")}
                      />
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        name="Address"
                        value={formData.Address}
                        onChange={handleInputChange}
                        className={cx("form-control")}
                        rows="3"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <p
                        className={cx(
                          "form-control-plaintext",
                          "border-bottom",
                          "pb-2"
                        )}
                      >
                        {userInformation.Address || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div
          className={cx("modal", "d-block")}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className={cx("modal-dialog", "modal-dialog-centered")}>
            <div className={cx("modal-content")}>
              <div className={cx("modal-header", "bg-primary", "text-white")}>
                <h5 className={cx("modal-title")}>
                  <FontAwesomeIcon icon={faKey} className={cx("me-2")} />
                  Change Password
                </h5>
                <button
                  type="button"
                  className={cx("btn-close", "btn-close-white")}
                  onClick={() => setShowChangePassword(false)}
                ></button>
              </div>
              <form onSubmit={handleChangePassword}>
                <div className={cx("modal-body")}>
                  <div className={cx("mb-3")}>
                    <label className={cx("form-label")}>Current Password</label>
                    <div className={cx("input-group")}>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={cx("form-control")}
                        required
                      />
                      <button
                        type="button"
                        className={cx("btn", "btn-outline-secondary")}
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        <FontAwesomeIcon
                          icon={showCurrentPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>
                  <div className={cx("mb-3")}>
                    <label className={cx("form-label")}>New Password</label>
                    <div className={cx("input-group")}>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={cx("form-control")}
                        required
                      />
                      <button
                        type="button"
                        className={cx("btn", "btn-outline-secondary")}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <FontAwesomeIcon
                          icon={showNewPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                    <small className={cx("text-muted")}>
                      Password must be at least 6 characters
                    </small>
                  </div>
                  <div className={cx("mb-3")}>
                    <label className={cx("form-label")}>
                      Confirm New Password
                    </label>
                    <div className={cx("input-group")}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={cx("form-control")}
                        required
                      />
                      <button
                        type="button"
                        className={cx("btn", "btn-outline-secondary")}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <FontAwesomeIcon
                          icon={showConfirmPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div className={cx("modal-footer")}>
                  <button
                    type="button"
                    className={cx("btn", "btn-secondary")}
                    onClick={() => setShowChangePassword(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={cx("btn", "btn-primary")}>
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
