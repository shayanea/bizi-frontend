import axios from "../utils/axios";

export const fetchProfile = () => {
  return axios.get("/users/me");
};

export const fetchUsers = (query = "") => {
  let url =
    query !== ""
      ? `/users?_q=${query}&_sort=createdAt:DESC&_limit=25`
      : `/users?_sort=createdAt:DESC&_limit=25`;
  return axios.get(url);
};

export const fetchUsersCount = () => {
  return axios.get("/users/count");
};

export const fetchSingleUsers = (id) => {
  return axios.get(`/users/${id}`);
};

export const addUser = (data) => {
  return axios.post("/users", data);
};

export const deleteUser = (id) => {
  return axios.delete(`/users/${id}`);
};

export const editUser = (data, id) => {
  return axios.put(`/users/${id}`, data);
};
