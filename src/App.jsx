import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar/Navbar";
import PhoneList from "./pages/PhoneList/PhoneList";
import PhoneDetail from "./pages/PhoneDetail/PhoneDetail";
import Cart from "./pages/Cart/Cart";
import "./styles/global.scss";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<PhoneList />} />
            <Route path="/phone/:id" element={<PhoneDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
