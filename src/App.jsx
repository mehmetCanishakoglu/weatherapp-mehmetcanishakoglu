import React, { useState, useEffect } from 'react';
import { fetchWeather } from './api/fetchWeather';
import logo from './assets/logo.png';
import './App.css';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    return savedSearches ? JSON.parse(savedSearches) : [];
  });

  useEffect(() => {
    console.log('Loaded searches from localStorage:', recentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const fetchData = async (e) => {
    if (e.key === 'Enter') {
      setLoading(true);
      try {
        const data = await fetchWeather(cityName);
        setWeatherData(data);
        setRecentSearches((prevSearches) => {
          const updatedSearches = [...prevSearches, cityName];
          if (updatedSearches.length > 5) {
            updatedSearches.shift();
          }
          console.log('Updated searches:', updatedSearches);
          return updatedSearches;
        });
        setCityName('');
        setError(null);
      } catch (error) {
        setError('City not found');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRecentSearchClick = async (city) => {
    setLoading(true);
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      setError(null);
    } catch (error) {
      setError('City not found');
    } finally {
      setLoading(false);
    }
  };

  console.log('Recent searches state:', recentSearches);

  return (
    <div className="container">
      <div className="app">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Welcome to the Weather App</h1>
        <input
          className="input"
          type="text"
          placeholder="Enter city name..."
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          onKeyDown={fetchData}
        />
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {weatherData && (
          <div className="weather-info">
            <h2>
              {weatherData.location.name}, {weatherData.location.region},{' '}
              {weatherData.location.country}
            </h2>
            <p>
              Temperature: {weatherData.current.temp_c} °C / {weatherData.current.temp_f} °F
            </p>
            <p>Condition: {weatherData.current.condition.text}</p>
            <img
              src={weatherData.current.condition.icon}
              alt={weatherData.current.condition.text}
            />
            <p>Humidity: {weatherData.current.humidity} %</p>
            <p>Pressure: {weatherData.current.pressure_mb} mb</p>
            <p>Visibility: {weatherData.current.vis_km} km</p>
          </div>
        )}
        {recentSearches.length > 0 && (
          <div className="recent-searches">
            <h3>Recent Searches:</h3>
            <ul>
              {recentSearches.map((city, index) => (
                <li key={index} onClick={() => handleRecentSearchClick(city)}>
                  {city}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
