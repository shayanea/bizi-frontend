import axios from "../utils/axios";

export const fetchOrders = (query = "") => {
  let url =
    query !== ""
      ? `/orders?_q=${query}&_sort=createdAt:DESC`
      : `/orders?_sort=createdAt:DESC`;
  return axios.get(url);
};

export const fetchOrdersCount = () => {
  return axios.get("/orders/count");
};

export const fetchSingleOrder = id => {
  return axios.get(`/orders/${id}`);
};

export const addOrder = data => {
  return axios.post(`/orders`, data);
};

export const editOrder = (data, id) => {
  return axios.put(`/orders/${id}`, data);
};

export const deleteOrder = id => {
  return axios.delete(`/orders/${id}`);
};
