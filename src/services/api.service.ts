import axios, { Axios } from "axios";

console.log("Service on %s", process.env.REACT_APP_API_URL);

const apiService = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const cancelToken = axios.CancelToken.source();

export { apiService, cancelToken };
