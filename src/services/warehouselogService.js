import axios from "../utils/axios";

export const fetchWarehouseLog = (start, status = "") => {
  let url = status
    ? `/warehouse-logs?_sort=createdAt:DESC&_limit=10&_start=${start}&status=${status}`
    : `/warehouse-logs?_sort=createdAt:DESC&_limit=10&_start=${start}`;
  return axios.get(url);
};

export const fetchWarehouseCount = () => {
  return axios.get("/warehouse-logs/count");
};

export const addWarehouseLog = (data) => {
  return axios.post(`/warehouse-logs`, data);
};

export const updateWarehouseLog = (id, data) => {
  return axios.put(`/warehouse-logs/${id}`, data);
};
