import axios from "../utils/axios";

export const fetchOrders = (query = "", page = 0, start = 0) => {
  let url =
    query !== ""
      ? `/orders?_q=${query}&_sort=createdAt:DESC&_limit=10&_start=${start}`
      : `/orders?_sort=createdAt:DESC&_limit=10&_start=${start}`;
  return axios.get(url);
};

export const fetchOrdersCount = () => {
  return axios.get("/orders/count");
};

export const fetchSingleOrder = (id) => {
  return axios.get(`/orders/${id}`);
};

export const addOrder = (data) => {
  return axios.post(`/orders`, data);
};

export const editOrder = (data, id) => {
  return axios.put(`/orders/${id}`, data);
};

export const deleteOrder = (id) => {
  return axios.delete(`/orders/${id}`);
};

export const fetchUsers = () => {
  return axios.get(`/users`);
};
