import axios from "../utils/axios";

export const fetchProducts = (query = "") => {
  let url =
    query !== ""
      ? `/products?_q=${query}&_sort=createdAt:DESC`
      : `/products?_sort=createdAt:DESC`;
  return axios.get(url);
};

export const fetchProductsCount = () => {
  return axios.get("/products/count");
};

export const fetchAllProducts = () => {
  return axios.get("/products?_sort=createdAt:DESC");
};

export const fetchSingleProduct = id => {
  return axios.get(`/products/${id}`);
};

export const addProduct = data => {
  return axios.post("/products", data);
};

export const editProduct = (data, id) => {
  return axios.put(`/products/${id}`, data);
};

export const deleteProduct = id => {
  return axios.delete(`/products/${id}`);
};
