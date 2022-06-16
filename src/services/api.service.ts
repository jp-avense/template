import axios, { Axios } from "axios";

console.log("Service on %s", process.env.REACT_APP_BASE_URL);

const apiService = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export { apiService };
