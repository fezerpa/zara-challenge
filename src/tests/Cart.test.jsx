import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CartContext, CartProvider } from '../context/CartContext'
import { useCart } from '../hooks/useCart'
import Cart from '../pages/Cart/Cart'

const mockItem = {
  id: 'APL-I15',
  name: 'iPhone 15',
  brand: 'Apple',
  image: 'https://example.com/image.webp',
  color: 'Black Titanium',
  storage: '128 GB',
  price: 999,
}

const renderCart = (cart = [], removeFromCart = vi.fn(), totalPrice = 0) =>
  render(
    <CartContext.Provider value={{ cart, removeFromCart, totalPrice }}>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </CartContext.Provider>
  )

describe('Cart — empty state', () => {
  test('shows empty cart message', () => {
    renderCart([])
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
  })

  test('shows count of 0 in title', () => {
    renderCart([])
    expect(screen.getByRole('heading', { name: 'CART (0)' })).toBeInTheDocument()
  })

  test('does not show PAY button', () => {
    renderCart([])
    expect(screen.queryByRole('button', { name: 'PAY' })).not.toBeInTheDocument()
  })

  test('Continue Shopping is a link to home', () => {
    renderCart([])
    const link = screen.getByRole('link', { name: 'CONTINUE SHOPPING' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })
})

describe('Cart — with items', () => {
  test('shows cart count in title', () => {
    renderCart([mockItem])
    expect(screen.getByRole('heading', { name: 'CART (1)' })).toBeInTheDocument()
  })

  test('renders item brand, name, specs, and price', () => {
    renderCart([mockItem], vi.fn(), 0)
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('iPhone 15')).toBeInTheDocument()
    expect(screen.getByText('128 GB | Black Titanium')).toBeInTheDocument()
    expect(screen.getByText('999 EUR')).toBeInTheDocument()
  })

  test('renders item image', () => {
    renderCart([mockItem])
    const img = screen.getByAltText('iPhone 15')
    expect(img).toHaveAttribute('src', 'https://example.com/image.webp')
  })

  test('shows total price', () => {
    const secondItem = { ...mockItem, id: 'APL-I14', price: 799 }
    renderCart([mockItem, secondItem], vi.fn(), 1798)
    expect(screen.getByText('1798 EUR')).toBeInTheDocument()
  })

  test('shows PAY button', () => {
    renderCart([mockItem])
    expect(screen.getByRole('button', { name: 'PAY' })).toBeInTheDocument()
  })

  test('remove button has correct aria-label', () => {
    renderCart([mockItem])
    expect(
      screen.getByRole('button', { name: 'Remove iPhone 15 from cart' })
    ).toBeInTheDocument()
  })

  test('calls removeFromCart after animation delay', async () => {
    const removeFromCart = vi.fn()
    renderCart([mockItem], removeFromCart)

    await userEvent.click(
      screen.getByRole('button', { name: 'Remove iPhone 15 from cart' })
    )

    await vi.waitFor(() => expect(removeFromCart).toHaveBeenCalledWith(0), {
      timeout: 1000,
    })
  })

  test('remove button is disabled while another removal is animating', () => {
    const removeFromCart = vi.fn()
    const items = [
      mockItem,
      { ...mockItem, id: 'APL-I14', name: 'iPhone 14' },
    ]
    renderCart(items, removeFromCart)

    fireEvent.click(
      screen.getByRole('button', { name: 'Remove iPhone 15 from cart' })
    )

    expect(
      screen.getByRole('button', { name: 'Remove iPhone 14 from cart' })
    ).toBeDisabled()
  })
})

describe('CartProvider — localStorage persistence', () => {
  beforeEach(() => localStorage.clear())

  const TestConsumer = () => {
    const { cart, addToCart } = useCart()
    return (
      <>
        <button
          onClick={() =>
            addToCart({ id: '1', name: 'Test', brand: 'X', image: '', color: 'Black', storage: '128 GB', price: 100 })
          }
        >
          Add
        </button>
        <span>{cart.length} items</span>
      </>
    )
  }

  test('persists cart to localStorage when item is added', () => {
    render(
      <CartProvider>
        <MemoryRouter>
          <TestConsumer />
        </MemoryRouter>
      </CartProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    const saved = JSON.parse(localStorage.getItem('cart'))
    expect(saved).toHaveLength(1)
    expect(saved[0].id).toBe('1')
  })

  test('loads cart from localStorage on mount', () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([{ id: '1', name: 'Test', brand: 'X', image: '', color: 'Black', storage: '128 GB', price: 100 }])
    )

    render(
      <CartProvider>
        <MemoryRouter>
          <TestConsumer />
        </MemoryRouter>
      </CartProvider>
    )

    expect(screen.getByText('1 items')).toBeInTheDocument()
  })
})
