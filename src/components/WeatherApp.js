import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './WeatherApp.module.css';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ca3e2813aeb87cb214342e97cb74a8c6`
      );
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      setWeatherData(null);
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  useEffect(() => {
    if (!weatherData) return;

    const weatherId = weatherData.weather[0].id;

    if (weatherId >= 200 && weatherId < 600) {
      setBackgroundColor('#4a4a4a'); // Rainy weather
    } else if (weatherId >= 600 && weatherId < 700) {
      setBackgroundColor('#f2f2f2'); // Snowy weather
    } else if (weatherId === 800) {
      setBackgroundColor('#74c0fc'); // Clear sky
    } else {
      setBackgroundColor('#d9d9d9'); // Other weather conditions
    }
  }, [weatherData]);

  const convertToCelsius = (temp) => {
    return (temp - 273.15).toFixed(1);
  };

  return (
    <div className={styles.weatherApp} style={{backgroundColor: backgroundColor}}>
      <h1 className={styles.title}>Weather App</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.button}>
          Search
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {weatherData && (
        <div className={styles.weatherContainer}>
          <h2 className={styles.city}>{weatherData.name}</h2>
          <p className={styles.temperature}>
            Temperature: {convertToCelsius(weatherData.main.temp)}°C
          </p>
          <p className={styles.weather}>
            Weather: {weatherData.weather[0].description}
          </p>
          <p className={styles.info}>
            Visibility: {weatherData.visibility} meters
          </p>
          <p className={styles.info}>
            Wind Speed: {weatherData.wind.speed} m/s
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;

