import axios from "axios";
import { history } from "./history";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:1337/",
  baseURL: `${
    process.env.NODE_ENV === "production"
      ? `http://78.47.89.182:1337/`
      : `http://localhost:1337/`
  }`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("@token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  axios.defaults.headers.common["Content-Type"] = "application/json";
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // if (typeof error.response === "undefined") {
    //   return history.replace("/login");
    // }
    if (error.response.status === 401) {
      return history.replace("/login");
    }
    return Promise.reject(error.response);
  }
);

export default axiosInstance;
