/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useRef } from 'react'

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
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const showToast = (message, color) => {
    clearTimeout(toastTimer.current)
    setToast({ message, color })
    toastTimer.current = setTimeout(() => setToast(null), 2000)
  }

  const addToCart = (phone) => {
    setCart((prev) => [...prev, phone])
    showToast('Phone added', '#3a7d44')
  }

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
    showToast('Phone removed', '#c00')
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, totalPrice, toast }}
    >
      {children}
    </CartContext.Provider>
  )
}
