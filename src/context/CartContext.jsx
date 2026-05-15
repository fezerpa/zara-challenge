/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart')
      if (!saved) return []
      return JSON.parse(saved.replaceAll('http://', 'https://'))
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (phone) => setCart((prev) => [...prev, phone])
  const removeFromCart = (index) =>
    setCart((prev) => prev.filter((_, i) => i !== index))
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}
