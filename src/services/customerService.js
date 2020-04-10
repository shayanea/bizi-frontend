import axios from "../utils/axios";

export const fetchCustomers = (query = "") => {
  let url =
    query !== "" && query
      ? `/customers?_q=${query}&_sort=createdAt:DESC`
      : "/customers?_sort=createdAt:DESC";
  return axios.get(url);
};

export const fetchCustomersCount = () => {
  return axios.get("/customers/count");
};

export const editCustomer = (data, id) => {
  return axios.put(`/customers/${id}`, data);
};

export const addCustomer = data => {
  return axios.post(`/customers`, data);
};
