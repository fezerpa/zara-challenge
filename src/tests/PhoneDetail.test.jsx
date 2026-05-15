import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import PhoneDetail from '../pages/PhoneDetail/PhoneDetail'

const mockPhone = {
  id: 'APL-I15',
  name: 'iPhone 15',
  brand: 'Apple',
  basePrice: 999,
  description: 'A powerful smartphone',
  colorOptions: [
    { name: 'Black Titanium', hexCode: '#000000', imageUrl: 'https://example.com/black.webp' },
    { name: 'White Titanium', hexCode: '#ffffff', imageUrl: 'https://example.com/white.webp' },
  ],
  storageOptions: [
    { capacity: '128 GB', price: 999 },
    { capacity: '256 GB', price: 1099 },
  ],
  specs: {
    screen: '6.1 inch',
    resolution: '2556 x 1179',
    processor: 'A16 Bionic',
    mainCamera: '48 MP',
    selfieCamera: '12 MP',
    battery: '3877 mAh',
    os: 'iOS 17',
    screenRefreshRate: '60 Hz',
  },
  similarProducts: [
    { id: 'APL-I14', name: 'iPhone 14', brand: 'Apple', basePrice: 799, imageUrl: 'https://example.com/i14.webp' },
  ],
}

const makeFetch = (data, ok = true) =>
  vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(data),
  })

const renderDetail = (addToCart = vi.fn()) =>
  render(
    <CartContext.Provider value={{ cart: [], addToCart }}>
      <MemoryRouter initialEntries={['/phone/APL-I15']}>
        <Routes>
          <Route path="/phone/:id" element={<PhoneDetail />} />
        </Routes>
      </MemoryRouter>
    </CartContext.Provider>
  )

describe('PhoneDetail — loading state', () => {
  test('shows skeleton while loading', () => {
    vi.stubGlobal('fetch', makeFetch(mockPhone))
    renderDetail()
    expect(document.querySelector('.detail__skeleton-image')).toBeInTheDocument()
    vi.unstubAllGlobals()
  })
})

describe('PhoneDetail — loaded state', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', makeFetch(mockPhone))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('renders phone name', async () => {
    renderDetail()
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1, name: 'iPhone 15' })).toBeInTheDocument()
    )
  })

  test('sets page title to phone name', async () => {
    renderDetail()
    await waitFor(() => expect(document.title).toBe('iPhone 15'))
  })

  test('displays base price initially', async () => {
    renderDetail()
    await waitFor(() => expect(screen.getByText('From 999 EUR')).toBeInTheDocument())
  })

  test('updates price when a storage option is selected', async () => {
    renderDetail()
    await waitFor(() => screen.getByRole('button', { name: '256 GB' }))

    await userEvent.click(screen.getByRole('button', { name: '256 GB' }))

    expect(screen.getByText('From 1099 EUR')).toBeInTheDocument()
  })

  test('renders all storage options', async () => {
    renderDetail()
    await waitFor(() => screen.getByRole('button', { name: '128 GB' }))
    expect(screen.getByRole('button', { name: '256 GB' })).toBeInTheDocument()
  })

  test('renders all color options', async () => {
    renderDetail()
    await waitFor(() => screen.getByRole('button', { name: 'Black Titanium' }))
    expect(screen.getByRole('button', { name: 'White Titanium' })).toBeInTheDocument()
  })

  test('updates image when a color is selected', async () => {
    renderDetail()
    await waitFor(() => screen.getByRole('button', { name: 'White Titanium' }))

    await userEvent.click(screen.getByRole('button', { name: 'White Titanium' }))

    expect(screen.getByAltText('iPhone 15')).toHaveAttribute(
      'src',
      'https://example.com/white.webp'
    )
  })

  test('add to cart button is disabled with no selection', async () => {
    renderDetail()
    await waitFor(() => screen.getByRole('button', { name: 'ADD TO CART' }))
    expect(screen.getByRole('button', { name: 'ADD TO CART' })).toBeDisabled()
  })

  test('add to cart button is disabled with only storage selected', async () => {
    renderDetail()
    await waitFor(() => screen.getByRole('button', { name: '128 GB' }))

    await userEvent.click(screen.getByRole('button', { name: '128 GB' }))

    expect(screen.getByRole('button', { name: 'ADD TO CART' })).toBeDisabled()
  })

  test('add to cart button is disabled with only color selected', async () => {
    renderDetail()
    await waitFor(() => screen.getByRole('button', { name: 'Black Titanium' }))

    await userEvent.click(screen.getByRole('button', { name: 'Black Titanium' }))

    expect(screen.getByRole('button', { name: 'ADD TO CART' })).toBeDisabled()
  })

  test('add to cart button is enabled when both options are selected', async () => {
    renderDetail()
    await waitFor(() => screen.getByRole('button', { name: '128 GB' }))

    await userEvent.click(screen.getByRole('button', { name: '128 GB' }))
    await userEvent.click(screen.getByRole('button', { name: 'Black Titanium' }))

    expect(screen.getByRole('button', { name: 'ADD TO CART' })).not.toBeDisabled()
  })

  test('calls addToCart with correct data', async () => {
    const addToCart = vi.fn()
    renderDetail(addToCart)
    await waitFor(() => screen.getByRole('button', { name: '128 GB' }))

    await userEvent.click(screen.getByRole('button', { name: '128 GB' }))
    await userEvent.click(screen.getByRole('button', { name: 'Black Titanium' }))
    await userEvent.click(screen.getByRole('button', { name: 'ADD TO CART' }))

    expect(addToCart).toHaveBeenCalledWith({
      id: 'APL-I15',
      name: 'iPhone 15',
      brand: 'Apple',
      image: 'https://example.com/black.webp',
      color: 'Black Titanium',
      storage: '128 GB',
      price: 999,
    })
  })

  test('button shows "ADDED TO CART" immediately after clicking', async () => {
    renderDetail()
    await waitFor(() => screen.getByRole('button', { name: '128 GB' }))

    await userEvent.click(screen.getByRole('button', { name: '128 GB' }))
    await userEvent.click(screen.getByRole('button', { name: 'Black Titanium' }))
    await userEvent.click(screen.getByRole('button', { name: 'ADD TO CART' }))

    expect(screen.getByRole('button', { name: 'ADDED TO CART' })).toBeInTheDocument()
  })

  test('button reverts to "ADD TO CART" after 2 seconds', async () => {
    renderDetail()
    await waitFor(() => screen.getByRole('button', { name: '128 GB' }))

    vi.useFakeTimers()

    fireEvent.click(screen.getByRole('button', { name: '128 GB' }))
    fireEvent.click(screen.getByRole('button', { name: 'Black Titanium' }))
    fireEvent.click(screen.getByRole('button', { name: 'ADD TO CART' }))

    expect(screen.getByRole('button', { name: 'ADDED TO CART' })).toBeInTheDocument()

    await act(async () => vi.advanceTimersByTime(2000))

    expect(screen.getByRole('button', { name: 'ADD TO CART' })).toBeInTheDocument()

    vi.useRealTimers()
  })

  test('renders specifications table with correct data', async () => {
    renderDetail()
    await waitFor(() => screen.getByText('SPECIFICATIONS'))

    expect(screen.getByText('Screen')).toBeInTheDocument()
    expect(screen.getByText('6.1 inch')).toBeInTheDocument()
    expect(screen.getByText('Processor')).toBeInTheDocument()
    expect(screen.getByText('A16 Bionic')).toBeInTheDocument()
    expect(screen.getByText('OS')).toBeInTheDocument()
    expect(screen.getByText('iOS 17')).toBeInTheDocument()
  })

  test('renders similar items section', async () => {
    renderDetail()
    await waitFor(() => screen.getByText('SIMILAR ITEMS'))
    expect(
      screen.getByRole('button', { name: 'View iPhone 14 by Apple' })
    ).toBeInTheDocument()
  })

  test('renders back button', async () => {
    renderDetail()
    await waitFor(() => screen.getByRole('button', { name: /back/i }))
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })
})

describe('PhoneDetail — error state', () => {
  test('shows error message when API fails', async () => {
    vi.stubGlobal('fetch', makeFetch(null, false))
    renderDetail()
    await waitFor(() =>
      expect(
        screen.getByText('Could not load phone. Please try again.')
      ).toBeInTheDocument()
    )
    vi.unstubAllGlobals()
  })
})
