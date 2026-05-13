import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar/Navbar";

const renderNavbar = (cartItems = []) => {
  return render(
    <CartContext.Provider value={{ cart: cartItems }}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </CartContext.Provider>,
  );
};

describe("Navbar", () => {
  test("muestra el enlace al inicio", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: /ir al inicio/i })).toBeInTheDocument();
  });

  test("muestra el contador del carrito cuando hay items", () => {
    renderNavbar([{ id: "1" }, { id: "2" }]);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("no muestra el contador cuando el carrito está vacío", () => {
    renderNavbar([]);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });
});
