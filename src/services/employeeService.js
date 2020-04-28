import axios from "../utils/axios";

export const fetchEmployee = (query = "", page = 0, start = 0) => {
  let url =
    query !== ""
      ? `/employees?_q=${query}&_sort=createdAt:DESC&_limit=10&_start=${start}`
      : `/employees?_sort=createdAt:DESC&_limit=10&_start=${start}`;
  return axios.get(url);
};

export const fetchEmployeeCount = () => {
  return axios.get("/employees/count");
};

export const fetchSingleEmployee = (id) => {
  return axios.get(`/employees/${id}`);
};

export const addEmployee = (data) => {
  return axios.post(`/employees`, data);
};

export const editEmployee = (data, id) => {
  return axios.put(`/employees/${id}`, data);
};

export const deleteEmployee = (id) => {
  return axios.delete(`/employees/${id}`);
};

export const fetchUsers = () => {
  return axios.get(`/users`);
};
