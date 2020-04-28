import axios from "../utils/axios";

export const fetchTransactions = (query = "", start = 0, status = "") => {
  let url =
    query !== ""
      ? `/transactions?_q=${query}&_sort=createdAt:DESC&_limit=10&_start=${start}`
      : `/transactions?_sort=createdAt:DESC&_limit=10&_start=${start}`;
  if (status) {
    url =
      query !== ""
        ? `/transactions?_q=${query}&_sort=createdAt:DESC&_limit=10&_start=${start}&status=${status}`
        : `/transactions?_sort=createdAt:DESC&_limit=10&_start=${start}&status=${status}`;
  }
  return axios.get(url);
};

export const fetchTransactionsCount = () => {
  return axios.get("/transactions/count");
};

export const fetchSalaries = (query = "", start = 0) => {
  let url =
    query !== ""
      ? `/transactions?_q=${query}&_sort=createdAt:DESC&status=3&status=4`
      : `/transactions?_sort=createdAt:DESC&status=3&status=4&_limit=10&_start=${start}`;
  return axios.get(url);
};

export const fetchSalariesCount = () => {
  return axios.get("/transactions/count");
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
