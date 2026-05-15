import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import Navbar from '../components/Navbar/Navbar'

const renderNavbar = (cart = [], toast = null) =>
  render(
    <CartContext.Provider value={{ cart, toast }}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </CartContext.Provider>
  )

describe('Navbar', () => {
  test('renders home link with correct aria-label', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Go to home' })).toBeInTheDocument()
  })

  test('renders cart link to /cart', () => {
    renderNavbar()
    const cartLink = screen.getByRole('link', { name: /cart/i })
    expect(cartLink).toHaveAttribute('href', '/cart')
  })

  test('cart aria-label uses plural "items" when cart is empty', () => {
    renderNavbar([])
    expect(screen.getByRole('link', { name: 'Cart, 0 items' })).toBeInTheDocument()
  })

  test('cart aria-label uses singular "item" when cart has 1 item', () => {
    renderNavbar([{ id: '1' }])
    expect(screen.getByRole('link', { name: 'Cart, 1 item' })).toBeInTheDocument()
  })

  test('cart aria-label uses plural "items" when cart has multiple items', () => {
    renderNavbar([{ id: '1' }, { id: '2' }])
    expect(screen.getByRole('link', { name: 'Cart, 2 items' })).toBeInTheDocument()
  })

  test('shows cart count badge when cart has items', () => {
    renderNavbar([{ id: '1' }, { id: '2' }])
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  test('does not show count badge when cart is empty', () => {
    renderNavbar([])
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  test('shows toast message when toast is in context', () => {
    renderNavbar([], { message: 'Phone added', color: '#3a7d44' })
    expect(screen.getByRole('status')).toHaveTextContent('Phone added')
  })

  test('does not show toast when toast is null', () => {
    renderNavbar([], null)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
