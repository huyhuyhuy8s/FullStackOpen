import { useState, useEffect } from "react";
import countriesServices from "./services/countries";
import weatherServices from "./services/weather";
import Countries from "./components/Countries";

function App() {
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    console.log("effect run, the currency is", currency);

    if (currency) {
      console.log("fetching...");
      countriesServices.search().then((response) => {
        setCountries(
          response.data.filter((c) =>
            c.name.common.toUpperCase().includes(currency.toUpperCase())
          )
        );
      });
    }
  }, [currency]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleFormChange = (event) => {
    event.preventDefault();
    setCurrency(value);
  };

  const handleCountryShow = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleFormChange}>
        <div>
          find countries <input onChange={handleChange} value={value} />
        </div>
      </form>
      <Countries
        handleCountryShow={handleCountryShow}
        countries={countries}
        weatherServices={weatherServices}
      />
    </div>
  );
}

export default App;
