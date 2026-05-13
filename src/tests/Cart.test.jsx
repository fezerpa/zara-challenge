import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Cart from "../pages/Cart/Cart";

const mockCart = [
  {
    id: "APL-I15",
    name: "iPhone 15",
    brand: "Apple",
    image: "http://example.com/image.webp",
    color: "Black",
    storage: "128 GB",
    price: 999,
  },
];

const renderCart = (cart = [], removeFromCart = () => {}, totalPrice = 0) => {
  return render(
    <CartContext.Provider value={{ cart, removeFromCart, totalPrice }}>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </CartContext.Provider>,
  );
};

describe("Cart", () => {
  test("muestra mensaje de carrito vacío", () => {
    renderCart([]);
    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
  });

  test("muestra los productos del carrito", () => {
    renderCart(mockCart, () => {}, 999);
    expect(screen.getByText("iPhone 15")).toBeInTheDocument();
    expect(screen.getAllByText("999 EUR").length).toBeGreaterThan(0);
  });

  test("llama a removeFromCart al pulsar eliminar", () => {
    const removeFromCart = vi.fn();
    renderCart(mockCart, removeFromCart, 999);
    fireEvent.click(screen.getByLabelText("Eliminar iPhone 15 del carrito"));
    expect(removeFromCart).toHaveBeenCalledWith(0);
  });
});
