import axios from "../utils/axios";

export const fetchTransactions = (query = "") => {
  let url =
    query !== ""
      ? `/transactions?_q=${query}&_sort=createdAt:DESC`
      : `/transactions?_sort=createdAt:DESC`;
  return axios.get(url);
};

export const fetchSalaries = (query = "") => {
  let url =
    query !== ""
      ? `/transactions?_q=${query}&_sort=createdAt:DESC&status=3&status=4`
      : `/transactions?_sort=createdAt:DESC&status=3&status=4`;
  return axios.get(url);
};

export const fetchMostPayed = () => {
  return axios.get(`/transactions/mostPayed`);
};

export const fetchSingleTransaction = (id) => {
  return axios.get(`/transactions/${id}`);
};

export const addTransaction = (data) => {
  return axios.post(`/transactions`, data);
};

export const updateTransaction = (data, id) => {
  return axios.put(`/transactions/${id}`, data);
};

export const deleteTransaction = (id) => {
  return axios.delete(`/transactions/${id}`);
};
