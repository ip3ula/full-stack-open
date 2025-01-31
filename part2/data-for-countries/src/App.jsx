import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryData = ({ country,capital, setCapital, weather }) => {
    setCapital(country.capital[0].toLowerCase())
    const imgUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  return (
    <table>
      <tbody>
        <tr>
          <th>Common name:</th>
          <td>{country.name.common}</td>
        </tr>
        <tr>
          <td>Official name:</td>
          <td>{country.name.official}</td>
        </tr>
        <tr>
          <td>Capital:</td>
          <td>{capital}</td>
        </tr>
        <tr>
          <td>Region:</td>
          <td>{country.region}</td>
        </tr>
        <tr>
          <td>Languages:</td>
          <td>
            {Object.values(country.languages).map((language, index) => (
              <p key={index}>{language}</p>
            ))}
          </td>
        </tr>
        <tr>
          <td>Population:</td>
          <td>{country.population.toLocaleString('en-US')}</td>
        </tr>
        <tr>
          <td>Flag:</td>
          <td style={{ fontSize: '5em' }}>{country.flag}</td>
        </tr>
        <tr>
          <td style={{fontSize: '25px'}}>wheather in {country.name.common}</td>
        </tr>
      {weather.main && (
  <tr>
    <td>Temperature: {weather.main.temp}°C</td>
  </tr>
)}
<tr>
  <td>
   <img src={imgUrl}/>
  </td>
</tr>
<tr>
  <td>
    wind {weather.wind.speed} m/s
  </td>
</tr>
      </tbody>
    </table>
  )
}

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [message, setMessage] = useState('too many matches or no matches at all')
 const [capital, setCapital] = useState('')
 const [weather, setWeather] = useState({})
  const baseURL = 'https://restcountries.com/v3.1/all'
 
  useEffect(() => {
    axios.get(baseURL)
      .then(response => setCountries(response.data))
      .catch(error => console.error('Error fetching countries:', error))
  }, [])
 useEffect(() => {
  if (capital) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?appid=b8c5378e497a0304e5b98617bfdd6a3e&q=${capital}&units=metric`
    axios.get(weatherUrl)
      .then(response => setWeather(response.data))
      .catch(error => console.error('Error fetching weather:', error))
  }
}, [capital])
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const filterCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <label>
        Find countries: 
        <input value={search} onChange={handleSearchChange} />
      </label>
      <div>
        {filterCountries.length > 10 ? (
          <p>{message}</p>
        ) : filterCountries.map((country, index) => ( 
        
          <div key={index}>
            
            {filterCountries.length === 1 ? (
              <CountryData country={country} capital={capital} setCapital={setCapital} weather={weather} />
            ) : (
              <div>
                <span>{country.name.common}</span>
                <button onClick={() => {
                setSelectedCountry(country)
                  setSearch('')
                  setMessage('')
                }}>
                  
                  Show
                </button>
              </div>
            )}
          </div>
        ))}
        {selectedCountry && <CountryData country={selectedCountry} capital={capital} setCapital={setCapital} weather={weather} />}
      </div>
    </>
  )
}

export default App