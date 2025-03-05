import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import Admin from "./components/Admin/Admin.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import Login from "./components/Login/Login.jsx";
import Payment from "./components/Home/Checkout/Checkout.jsx";
import About from "./components/About/About.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
