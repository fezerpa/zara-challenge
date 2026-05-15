import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import PhoneList from '../pages/PhoneList/PhoneList'

const mockPhones = [
  { id: 'APL-I15', name: 'iPhone 15', brand: 'Apple', basePrice: 999, imageUrl: 'https://example.com/i15.webp' },
  { id: 'SAM-S24', name: 'Galaxy S24', brand: 'Samsung', basePrice: 849, imageUrl: 'https://example.com/s24.webp' },
]

const makeFetch = (data, ok = true) =>
  vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(data),
  })

const renderPhoneList = () =>
  render(
    <CartContext.Provider value={{ cart: [] }}>
      <MemoryRouter>
        <PhoneList />
      </MemoryRouter>
    </CartContext.Provider>
  )

describe('PhoneList', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', makeFetch(mockPhones))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('sets page title to "Smartphones"', async () => {
    renderPhoneList()
    await waitFor(() => expect(document.title).toBe('Smartphones'))
  })

  test('shows skeleton loaders while loading', () => {
    renderPhoneList()
    expect(document.querySelector('.skeleton')).toBeInTheDocument()
  })

  test('renders phone cards after data loads', async () => {
    renderPhoneList()
    await waitFor(() => expect(screen.getByText('iPhone 15')).toBeInTheDocument())
    expect(screen.getByText('Galaxy S24')).toBeInTheDocument()
  })

  test('shows result count', async () => {
    renderPhoneList()
    await waitFor(() => expect(screen.getByText('2 RESULTS')).toBeInTheDocument())
  })

  test('renders accessible link for each phone card', async () => {
    renderPhoneList()
    await waitFor(() => screen.getByText('iPhone 15'))
    expect(screen.getByRole('link', { name: 'View iPhone 15 by Apple' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View Galaxy S24 by Samsung' })).toBeInTheDocument()
  })

  test('shows phone brand and price', async () => {
    renderPhoneList()
    await waitFor(() => screen.getByText('Apple'))
    expect(screen.getByText('999 EUR')).toBeInTheDocument()
    expect(screen.getByText('Samsung')).toBeInTheDocument()
    expect(screen.getByText('849 EUR')).toBeInTheDocument()
  })

  test('renders accessible search input', () => {
    renderPhoneList()
    expect(
      screen.getByRole('searchbox', { name: 'Search for a smartphone' })
    ).toBeInTheDocument()
  })

  test('calls API with search term in URL after debounce', async () => {
    const fetchMock = makeFetch(mockPhones)
    vi.stubGlobal('fetch', fetchMock)
    renderPhoneList()
    await waitFor(() => screen.getByText('iPhone 15'))

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Search for a smartphone' }),
      { target: { value: 'iphone' } }
    )

    await waitFor(
      () => {
        const urls = fetchMock.mock.calls.map(([url]) => url)
        expect(urls.some((url) => url.includes('search=iphone'))).toBe(true)
      },
      { timeout: 1000 }
    )
  })

  test('calls API on initial load', async () => {
    const fetchMock = makeFetch(mockPhones)
    vi.stubGlobal('fetch', fetchMock)
    renderPhoneList()
    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
    expect(fetchMock.mock.calls[0][0]).toContain('/products')
  })

  test('shows error message when API fails', async () => {
    vi.stubGlobal('fetch', makeFetch(null, false))
    renderPhoneList()
    await waitFor(() =>
      expect(
        screen.getByText('Could not load phones. Please try again.')
      ).toBeInTheDocument()
    )
  })

  test('shows 0 RESULTS after data loads with no matches', async () => {
    vi.stubGlobal('fetch', makeFetch([]))
    renderPhoneList()
    await waitFor(() => {
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    })
    expect(screen.getByText('0 RESULTS')).toBeInTheDocument()
  })
})
