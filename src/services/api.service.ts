import axios, { Axios } from "axios";

console.log("Service on %s", process.env.REACT_APP_BASE_URL);

export abstract class ApiService {
  protected axios: Axios = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });
}
