import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPhones } from '../../services/api'
import './PhoneList.scss'

const PhoneList = () => {
  const [phones, setPhones] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = 'Smartphones'
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      setError(null)
      getPhones(search)
        .then(setPhones)
        .catch(() => setError('Could not load phones. Please try again.'))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="phone-list">
      <div className="phone-list__search">
        <input
          type="search"
          placeholder="Search for a smartphone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search for a smartphone"
        />
      </div>
      <span className="phone-list__count">{phones.length} RESULTS</span>

      {loading ? (
        <ul className="phone-list__grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i} className="phone-card phone-card--skeleton">
              <div className="skeleton phone-card__skeleton-image" />
              <div className="phone-card__info">
                <div className="skeleton phone-card__skeleton-brand" />
                <div className="phone-card__name-price">
                  <div className="skeleton phone-card__skeleton-name" />
                  <div className="skeleton phone-card__skeleton-price" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : error ? (
        <p className="phone-list__loading">{error}</p>
      ) : (
        <ul className="phone-list__grid">
          {phones.map((phone) => (
            <li key={phone.id} className="phone-card">
              <Link
                to={`/phone/${phone.id}`}
                className="phone-card__link"
                aria-label={`View ${phone.name} by ${phone.brand}`}
              />
              <div className="phone-card__image-wrapper" aria-hidden="true">
                <img src={phone.imageUrl} alt="" />
              </div>
              <div className="phone-card__info" aria-hidden="true">
                <p className="phone-card__brand">{phone.brand}</p>
                <div className="phone-card__name-price">
                  <p className="phone-card__name">{phone.name}</p>
                  <p className="phone-card__price">{phone.basePrice} EUR</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PhoneList
