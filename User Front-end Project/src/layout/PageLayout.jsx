import PropTypes from "prop-types";
import MainLayout from "./MainLayout";
import PageHeader from "../components/PageHeader/PageHeader";
import Newsletter from "../components/Newsletter/Newsletter";

const PageLayout = ({
  children,
  title,
  showNewsletter = true,
  showHeader = true,
  showFooter = true,
  showBackToTop = true,
}) => {
  return (
    <MainLayout
      showHeader={showHeader}
      showFooter={showFooter}
      showBackToTop={showBackToTop}
    >
      {title && <PageHeader title={title} />}

      <div className="page-content">{children}</div>

      {showNewsletter && <Newsletter />}
    </MainLayout>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  showNewsletter: PropTypes.bool,
  showHeader: PropTypes.bool,
  showFooter: PropTypes.bool,
  showBackToTop: PropTypes.bool,
};

export default PageLayout;
