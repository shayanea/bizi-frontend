import axios from "../utils/axios";

export const fetchOrders = (query = "", start = 0, status = null) => {
  let url =
    query !== ""
      ? `/orders?_q=${query}&_sort=createdAt:DESC&_limit=10&_start=${start}`
      : `/orders?_sort=createdAt:DESC&_limit=10&_start=${start}`;
  if (status) {
    url =
      query !== ""
        ? `/orders?_q=${query}&_sort=createdAt:DESC&_limit=10&_start=${start}&status=${status}`
        : `/orders?_sort=createdAt:DESC&_limit=10&_start=${start}&status=${status}`;
  }
  return axios.get(url);
};

export const fetchOrdersCount = (query = "", status = null) => {
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
