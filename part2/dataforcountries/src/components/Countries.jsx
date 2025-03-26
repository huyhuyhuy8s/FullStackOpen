import Country from "./Country";

const Countries = ({ countries, handleCountryShow, weatherServices }) => {
  let c = countries;
  if (Object.keys(c).length === 1) {
    return (
      <Country
        key={countries[0].index}
        country={countries[0]}
        specified={true}
        weatherServices={weatherServices}
        // weather={}
      />
    );
  }
  if (Object.keys(c).length <= 10) {
    return c.map((country, index) => {
      return (
        <Country
          handleCountryShow={handleCountryShow}
          key={index}
          country={country}
        />
      );
    });
  } else return <p>Too many matches, specify another filter</p>;
};

export default Countries;
