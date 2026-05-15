import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar/Navbar";
import PhoneList from "./pages/PhoneList/PhoneList";
import PhoneDetail from "./pages/PhoneDetail/PhoneDetail";
import Cart from "./pages/Cart/Cart";
import "./styles/global.scss";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      <Routes>
        <Route path="/" element={<PhoneList />} />
        <Route path="/phone/:id" element={<PhoneDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <main>
          <AnimatedRoutes />
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
