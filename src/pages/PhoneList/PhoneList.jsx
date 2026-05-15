import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPhones } from '../../services/api'
import './PhoneList.scss'

const PhoneList = () => {
  const [phones, setPhones] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      setError(null)
      getPhones(search)
        .then(setPhones)
        .catch(() => setError('No se pudieron cargar los teléfonos. Inténtalo de nuevo.'))
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
          aria-label="Buscar teléfonos"
        />
      </div>
      <span className="phone-list__count">{phones.length} RESULTS</span>

      {loading ? (
        <p className="phone-list__loading">Cargando...</p>
      ) : error ? (
        <p className="phone-list__loading">{error}</p>
      ) : (
        <ul className="phone-list__grid">
          {phones.map((phone) => (
            <li
              key={phone.id}
              className="phone-card"
              onClick={() => navigate(`/phone/${phone.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === 'Enter' && navigate(`/phone/${phone.id}`)
              }
              aria-label={`Ver detalle de ${phone.name}`}
            >
              <div className="phone-card__image-wrapper">
                <img src={phone.imageUrl} alt={phone.name} />
              </div>
              <div className="phone-card__info">
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
