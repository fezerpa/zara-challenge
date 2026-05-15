import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import './Cart.scss'

const Cart = () => {
  const { cart, removeFromCart, totalPrice } = useCart()
  const navigate = useNavigate()
  const [removingIndex, setRemovingIndex] = useState(null)

  const handleRemove = (index) => {
    setRemovingIndex(index)
    setTimeout(() => {
      removeFromCart(index)
      setRemovingIndex(null)
    }, 350)
  }

  return (
    <div className="cart">
      <div className="cart__container">
        <h1 className="cart__title">CART ({cart.length})</h1>

        {cart.length === 0 && (
          <p className="cart__empty">Tu carrito está vacío.</p>
        )}
        {cart.length > 0 && (
          <ul className="cart__list">
            {cart.map((item, index) => (
              <li
                key={index}
                className={`cart__item${removingIndex === index ? ' cart__item--removing' : ''}`}
              >
                <div className="cart__item-image-wrap">
                  <img src={item.image} alt={item.name} className="cart__item-image" />
                </div>
                <div className="cart__item-info">
                  <div className="cart__item-details">
                    <p className="cart__item-brand">{item.brand}</p>
                    <p className="cart__item-name">{item.name}</p>
                    <p className="cart__item-specs">{item.storage} | {item.color}</p>
                    <p className="cart__item-price">{item.price} EUR</p>
                  </div>
                  <button
                    className="cart__item-remove"
                    onClick={() => handleRemove(index)}
                    aria-label={`Eliminar ${item.name} del carrito`}
                    disabled={removingIndex !== null}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="cart__footer">
        <button className="cart__continue-btn" onClick={() => navigate('/')}>
          CONTINUE SHOPPING
        </button>
        {cart.length > 0 && (
          <>
            <span className="cart__total">
              <span>TOTAL</span>
              <span>{totalPrice} EUR</span>
            </span>
            <button className="cart__pay-btn">PAY</button>
          </>
        )}
      </div>
    </div>
  )
}

export default Cart
