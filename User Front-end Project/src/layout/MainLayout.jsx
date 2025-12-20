import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import BackToTop from "../components/BackToTop/BackToTop";
import "react-toastify/dist/ReactToastify.css";

const MainLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  showBackToTop = true,
}) => {
  return (
    <div className="main-layout">
      {showHeader && <Header />}

      <main className="main-content">{children}</main>

      {showFooter && <Footer />}
      {showBackToTop && <BackToTop />}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  showHeader: PropTypes.bool,
  showFooter: PropTypes.bool,
  showBackToTop: PropTypes.bool,
};

export default MainLayout;
