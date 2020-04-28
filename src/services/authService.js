import axios from "axios";

const baseURL = `${
  process.env.NODE_ENV === "production"
    ? `http://78.47.89.182:1337`
    : `http://localhost:1337`
}`;

export const login = (data) => {
  return axios.post(`${baseURL}/auth/local`, data);
};

export const forgotPassword = (data) => {
  return axios.post(`${baseURL}/auth/forgot-password`, data);
};

export const fetchProfile = () => {
  return axios.get(`${baseURL}/users/me`);
};
