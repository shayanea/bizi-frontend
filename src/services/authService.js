import axios from "axios";

export const login = (data) => {
  return axios.post("https://bizi-dashboard.herokuapp.com/auth/local", data);
};

export const forgotPassword = (data) => {
  return axios.post(
    "https://bizi-dashboard.herokuapp.com/auth/forgot-password",
    data
  );
};

export const fetchProfile = () => {
  return axios.get("https://bizi-dashboard.herokuapp.com/users/me");
};
