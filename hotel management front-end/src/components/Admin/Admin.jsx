import Navigation from "./Navigation/Navigation.jsx";
import Content from "./Content/Content.jsx";
// import "../../assets/css/bootstrap-v4dot3dot1.css";
// import "../../assets/css/admin.css";

export default function Admin() {
  return (
    <div className="wrapper d-flex align-items-stretch">
      <Navigation />
      <Content />
    </div>
  );
}
