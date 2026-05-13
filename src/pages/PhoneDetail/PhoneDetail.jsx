import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPhoneById } from '../../services/api'
import { useCart } from '../../hooks/useCart'
import './PhoneDetail.scss'

const PhoneDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [phone, setPhone] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedStorage, setSelectedStorage] = useState(null)
  const [hoveredColor, setHoveredColor] = useState(null)
  const sliderRef = useRef(null)
  const [thumbLeft, setThumbLeft] = useState(0)
  const [thumbWidth, setThumbWidth] = useState(100)
  const isDragging = useRef(false)
  const hasDragged = useRef(false)
  const dragStartX = useRef(0)
  const dragScrollLeft = useRef(0)

  const handleSliderScroll = () => {
    const el = sliderRef.current
    if (!el) return
    const w = (el.clientWidth / el.scrollWidth) * 100
    const l = (el.scrollLeft / el.scrollWidth) * 100
    setThumbWidth(w)
    setThumbLeft(l)
  }

  const handleMouseDown = (e) => {
    const el = sliderRef.current
    if (!el) return
    isDragging.current = true
    hasDragged.current = false
    dragStartX.current = e.pageX - el.offsetLeft
    dragScrollLeft.current = el.scrollLeft
    el.style.cursor = 'grabbing'
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current) return
    const el = sliderRef.current
    if (!el) return
    e.preventDefault()
    const x = e.pageX - el.offsetLeft
    if (Math.abs(x - dragStartX.current) > 5) hasDragged.current = true
    el.scrollLeft = dragScrollLeft.current - (x - dragStartX.current)
  }

  const stopDragging = () => {
    isDragging.current = false
    if (sliderRef.current) sliderRef.current.style.cursor = 'grab'
  }

  const handleClickCapture = (e) => {
    if (hasDragged.current) {
      e.stopPropagation()
      hasDragged.current = false
    }
  }

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    handleSliderScroll()
  }, [phone])

  useEffect(() => {
    getPhoneById(id).then((data) => {
      setPhone(data)
      setLoading(false)
    })
  }, [id])

  const currentPrice = selectedStorage?.price ?? phone?.basePrice
  const currentImage =
    selectedColor?.imageUrl ?? phone?.colorOptions?.[0]?.imageUrl ?? ''
  const canAddToCart = selectedColor && selectedStorage

  const handleAddToCart = () => {
    if (!canAddToCart) return
    addToCart({
      id: phone.id,
      name: phone.name,
      brand: phone.brand,
      image: currentImage,
      color: selectedColor.name,
      storage: selectedStorage.capacity,
      price: currentPrice,
    })
  }

  if (loading) return <p className="detail__loading">Cargando...</p>
  if (!phone) return <p className="detail__loading">Teléfono no encontrado</p>

  return (
    <div className="detail">
      <button className="detail__back" onClick={() => navigate(-1)}>
        &lt; BACK
      </button>

      <div className="detail__container">
        <div className="detail__main">
          <div className="detail__image-wrap">
            <img
              src={currentImage}
              alt={phone.name}
              className="detail__image"
            />
          </div>

          <div className="detail__info">
            <div className="detail__header">
              <h1 className="detail__name">{phone.name}</h1>
              <p className="detail__price">From {currentPrice} EUR</p>
            </div>

            {/* Selector de almacenamiento */}
            <div className="detail__section">
              <h2 className="detail__section-title">
                STORAGE ¿HOW MUCH SPACE DO YOU NEED?
              </h2>
              <div className="detail__options">
                {phone.storageOptions.map((opt) => (
                  <button
                    key={opt.capacity}
                    className={`detail__option-btn ${selectedStorage?.capacity === opt.capacity ? 'detail__option-btn--active' : ''}`}
                    onClick={() => setSelectedStorage(opt)}
                    aria-pressed={selectedStorage?.capacity === opt.capacity}
                  >
                    {opt.capacity}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de color */}
            <div className="detail__section">
              <h2 className="detail__section-title">
                COLOR. PICK YOUR FAVOURITE.
              </h2>
              <div className="detail__colors">
                {phone.colorOptions.map((col) => (
                  <div key={col.name} className="detail__color-row">
                    <button
                      className="detail__color-btn"
                      style={{
                        backgroundColor: col.hexCode,
                        boxShadow:
                          selectedColor?.name === col.name
                            ? '0 0 0 1px #fff, 0 0 0 2px #000'
                            : hoveredColor?.name === col.name
                              ? `0 0 0 1px #fff, 0 0 0 2px ${col.hexCode}`
                              : 'none',
                      }}
                      onClick={() => setSelectedColor(col)}
                      onMouseEnter={() => setHoveredColor(col)}
                      onMouseLeave={() => setHoveredColor(null)}
                      aria-label={col.name}
                      aria-pressed={selectedColor?.name === col.name}
                    />
                  </div>
                ))}
              </div>
              <p
                className="detail__color-label"
                style={{ color: (hoveredColor ?? selectedColor) ? '#000' : '#fff' }}
              >
                {(hoveredColor ?? selectedColor)?.name ?? ' '}
              </p>
            </div>

            <button
              className="detail__add-btn"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              aria-disabled={!canAddToCart}
            >
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Especificaciones */}
        <div className="detail__specs">
          <h2 className="detail__specs-title">SPECIFICATIONS</h2>
          <table className="detail__specs-table">
            <tbody>
              {Object.entries({
                Brand: phone.brand,
                Name: phone.name,
                Description: phone.description,
                Screen: phone.specs.screen,
                Resolution: phone.specs.resolution,
                Processor: phone.specs.processor,
                'Main Camera': phone.specs.mainCamera,
                'Selfie Camera': phone.specs.selfieCamera,
                Battery: phone.specs.battery,
                OS: phone.specs.os,
                'Screen Refresh Rate': phone.specs.screenRefreshRate,
              }).map(([key, val]) => (
                <tr key={key}>
                  <td className="detail__specs-key">{key}</td>
                  <td className="detail__specs-val">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Productos similares */}
        {phone.similarProducts?.length > 0 && (
          <div className="detail__similar">
            <h2 className="detail__similar-title">SIMILAR ITEMS</h2>
            <ul
              className="detail__similar-grid"
              ref={sliderRef}
              onScroll={handleSliderScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={stopDragging}
              onMouseLeave={stopDragging}
              onClickCapture={handleClickCapture}
            >
              {phone.similarProducts.map((p) => (
                <li
                  key={p.id}
                  className="phone-card"
                  onClick={() => navigate(`/phone/${p.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && navigate(`/phone/${p.id}`)
                  }
                  aria-label={`View ${p.name}`}
                >
                  <div className="phone-card__image-wrapper">
                    <img src={p.imageUrl} alt={p.name} draggable={false} />
                  </div>
                  <div className="phone-card__info">
                    <p className="phone-card__brand">{p.brand}</p>
                    <div className="phone-card__name-price">
                      <p className="phone-card__name">{p.name}</p>
                      <p className="phone-card__price">{p.basePrice} EUR</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="detail__similar-track">
              <div
                className="detail__similar-thumb"
                style={{ left: `${thumbLeft}%`, width: `${thumbWidth}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhoneDetail
