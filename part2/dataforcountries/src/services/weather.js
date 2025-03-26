import axios from "axios";
const api_key = import.meta.env.VITE_SOME_KEY
const baseUrl = `http://api.weatherapi.com/v1/current.json?key=${api_key}`;

const getAll = (location) => {
    const request = axios.get(`${baseUrl}&q=${location}&aqi=yes`)
    return request
}

export default { getAll };
