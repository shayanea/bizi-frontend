import axios from "axios";

export const login = data => {
  return axios.post("http://localhost:1337/auth/local", data);
};

export const forgotPassword = data => {
  return axios.post("http://localhost:1337/auth/forgot-password", data);
};

export const fetchProfile = () => {
  return axios.get("http://localhost:1337/users/me");
};
