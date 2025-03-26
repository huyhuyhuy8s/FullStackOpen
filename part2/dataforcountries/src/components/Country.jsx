import { useState, useEffect } from "react";

const Country = ({
  country,
  handleCountryShow,
  specified = false,
  weatherServices,
}) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await weatherServices.getAll(country.name.common);
        setWeather(response.data.current);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    if (specified) {
      fetchWeather();
    }
  }, [specified, country.name.common, weatherServices]);

  if (specified) {
    if (!weather) {
      return <div>Loading weather data...</div>;
    }

    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital}</p>
        <p>Area {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.entries(country.languages).map(([code, name]) => (
            <li key={code}>{name}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={`${country.name.common} flag`} />
        <h2>Weather in {country.capital}</h2>
        <p>Temperature {weather.temp_c}°C</p>
        <img src={weather.condition.icon} alt="weather icon" />
        <p>Wind {weather.wind_mph} m/s</p>
      </div>
    );
  }

  return (
    <div>
      <p>
        {country.name.common}
        <button value={country.name.common} onClick={handleCountryShow}>
          Show
        </button>
      </p>
    </div>
  );
};

export default Country;
