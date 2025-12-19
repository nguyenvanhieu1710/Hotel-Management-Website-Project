import Head from "next/head";
import { useRouter } from "next/router";
import { useEventListener, useUnmountEffect } from "primereact/hooks";
import { classNames, DomHandler } from "primereact/utils";
import React, { useContext, useEffect, useRef, useState } from "react";
import AppFooter from "./AppFooter";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";
import AppConfig from "./AppConfig";
import { LayoutContext } from "./context/layoutcontext";
import PrimeReact from "primereact/api";

const Layout = (props) => {
  const { layoutConfig, layoutState, setLayoutState } =
    useContext(LayoutContext);
  const topbarRef = useRef(null);
  const sidebarRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Public routes that don't require authentication
  const publicRoutes = ["/auth/login", "/auth/register"];
  const isPublicRoute = publicRoutes.includes(router.pathname);

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("admin");

      if (!token && !isPublicRoute) {
        // Not authenticated and trying to access protected route
        router.push("/auth/login");
        setIsAuthenticated(false);
      } else {
        // Either authenticated or on public route
        setIsAuthenticated(!!token);
      }

      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("userLoggedIn", handleAuthChange);
    window.addEventListener("userLoggedOut", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("userLoggedIn", handleAuthChange);
      window.removeEventListener("userLoggedOut", handleAuthChange);
    };
  }, [router.pathname, isPublicRoute]);
  const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] =
    useEventListener({
      type: "click",
      listener: (event) => {
        const isOutsideClicked = !(
          sidebarRef.current.isSameNode(event.target) ||
          sidebarRef.current.contains(event.target) ||
          topbarRef.current.menubutton.isSameNode(event.target) ||
          topbarRef.current.menubutton.contains(event.target)
        );

        if (isOutsideClicked) {
          hideMenu();
        }
      },
    });

  const [
    bindProfileMenuOutsideClickListener,
    unbindProfileMenuOutsideClickListener,
  ] = useEventListener({
    type: "click",
    listener: (event) => {
      const isOutsideClicked = !(
        topbarRef.current.topbarmenu.isSameNode(event.target) ||
        topbarRef.current.topbarmenu.contains(event.target) ||
        topbarRef.current.topbarmenubutton.isSameNode(event.target) ||
        topbarRef.current.topbarmenubutton.contains(event.target)
      );

      if (isOutsideClicked) {
        hideProfileMenu();
      }
    },
  });

  const hideMenu = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
    }));
    unbindMenuOutsideClickListener();
    unblockBodyScroll();
  };

  const hideProfileMenu = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: false,
    }));
    unbindProfileMenuOutsideClickListener();
  };

  const blockBodyScroll = () => {
    DomHandler.addClass("blocked-scroll");
  };

  const unblockBodyScroll = () => {
    DomHandler.removeClass("blocked-scroll");
  };

  useEffect(() => {
    if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
      bindMenuOutsideClickListener();
    }

    layoutState.staticMenuMobileActive && blockBodyScroll();
  }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

  useEffect(() => {
    if (layoutState.profileSidebarVisible) {
      bindProfileMenuOutsideClickListener();
    }
  }, [layoutState.profileSidebarVisible]);

  useEffect(() => {
    router.events.on("routeChangeComplete", () => {
      hideMenu();
      hideProfileMenu();
    });
  }, []);

  PrimeReact.ripple = true;

  useUnmountEffect(() => {
    unbindMenuOutsideClickListener();
    unbindProfileMenuOutsideClickListener();
  });

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div
        className="flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <i className="pi pi-spinner pi-spin" style={{ fontSize: "2rem" }}></i>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Don't render layout for protected routes when not authenticated
  if (!isPublicRoute && !isAuthenticated) {
    return null;
  }

  const containerClass = classNames("layout-wrapper", {
    "layout-overlay": layoutConfig.menuMode === "overlay",
    "layout-static": layoutConfig.menuMode === "static",
    "layout-static-inactive":
      layoutState.staticMenuDesktopInactive &&
      layoutConfig.menuMode === "static",
    "layout-overlay-active": layoutState.overlayMenuActive,
    "layout-mobile-active": layoutState.staticMenuMobileActive,
    "p-input-filled": layoutConfig.inputStyle === "filled",
    "p-ripple-disabled": !layoutConfig.ripple,
  });

  return (
    <React.Fragment>
      <Head>
        <title>Hotel Management</title>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="The ultimate collection of design-agnostic, flexible and accessible React UI Components."
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta property="og:type" content="website"></meta>
        <meta property="og:title" content="Hotel Management"></meta>
        <meta
          property="og:url"
          content="https://www.primefaces.org/sakai-react"
        ></meta>
        <meta
          property="og:description"
          content="The ultimate collection of design-agnostic, flexible and accessible React UI Components."
        />
        <meta
          property="og:image"
          content="https://www.primefaces.org/static/social/sakai-nextjs.png"
        ></meta>
        <meta property="og:ttl" content="604800"></meta>
        <link rel="icon" href={`/favicon.ico`} type="image/x-icon"></link>
      </Head>

      <div className={containerClass}>
        <AppTopbar ref={topbarRef} />
        <div ref={sidebarRef} className="layout-sidebar">
          <AppSidebar />
        </div>
        <div className="layout-main-container">
          <div className="layout-main">{props.children}</div>
          <AppFooter />
        </div>
        <AppConfig />
        <div className="layout-mask"></div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
