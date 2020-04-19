import axios from "../utils/axios";

export const fetchWarehouseLog = (data) => {
  return axios.get(`/warehouse-logs?_sort=createdAt:DESC`);
};

export const addWarehouseLog = (data) => {
  return axios.post(`/warehouse-logs`, data);
};

export const updateWarehouseLog = (id, data) => {
  return axios.put(`/warehouse-logs/${id}`, data);
};
