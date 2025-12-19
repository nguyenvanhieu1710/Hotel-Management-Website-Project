import Link from "next/link";
import Router, { useRouter } from "next/router";
import { classNames } from "primereact/utils";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import { LayoutContext } from "./context/layoutcontext";

const AppTopbar = forwardRef((props, ref) => {
  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const settingsMenuRef = useRef(null);
  const toastRef = useRef(null);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = () => {
      const token = localStorage.getItem("admin");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener("storage", checkLoginStatus);

    // Listen for custom login event
    window.addEventListener("userLoggedIn", checkLoginStatus);
    window.addEventListener("userLoggedOut", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("userLoggedIn", checkLoginStatus);
      window.removeEventListener("userLoggedOut", checkLoginStatus);
    };
  }, []);

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    setIsLoggedIn(false);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("userLoggedOut"));

    toastRef.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Logged out successfully",
      life: 3000,
    });

    setTimeout(() => {
      router.push("/auth/login");
    }, 1000);
  };

  const settingsMenuItems = isLoggedIn
    ? [
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: handleLogout,
        },
      ]
    : [
        {
          label: "Login",
          icon: "pi pi-sign-in",
          command: handleLogin,
        },
      ];

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  return (
    <div className="layout-topbar">
      <Link href="/" className="layout-topbar-logo">
        <img
          src={`/layout/images/logo-${
            layoutConfig.colorScheme !== "light" ? "white" : "dark"
          }.svg`}
          width="47.22px"
          height={"35px"}
          widt={"true"}
          alt="logo"
        />
        <span>Hotel Management</span>
      </Link>

      <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button>

      <button
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <div
        ref={topbarmenuRef}
        className={classNames("layout-topbar-menu", {
          "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
        })}
      >
        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-user"></i>
          <span>Profile</span>
        </button>
        <button
          type="button"
          className="p-link layout-topbar-button"
          onClick={(e) => settingsMenuRef.current?.toggle(e)}
        >
          <i className="pi pi-cog"></i>
          <span>Settings</span>
        </button>
        <Menu
          ref={settingsMenuRef}
          model={settingsMenuItems}
          popup
          style={{ minWidth: "12rem" }}
        />
      </div>
      <Toast ref={toastRef} />
    </div>
  );
});

export default AppTopbar;
