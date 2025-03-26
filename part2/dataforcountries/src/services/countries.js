import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const search = () => {
    const request = axios.get(`${baseUrl}/all`);
    return request;
}

export default { search, };
