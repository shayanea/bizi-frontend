import axios from "../utils/axios";

export const fetchProducts = (query = "", page = 0, start = 0) => {
  let url =
    query !== ""
      ? `/products?_q=${query}&_sort=createdAt:DESC&_limit=10&_start=${start}`
      : `/products?_sort=createdAt:DESC&_limit=10&_start=${start}`;
  return axios.get(url);
};

export const fetchProductsCount = () => {
  return axios.get("/products/count");
};

export const fetchAllProducts = () => {
  return axios.get("/products?_sort=createdAt:DESC");
};

export const fetchSingleProduct = (id) => {
  return axios.get(`/products/${id}`);
};

export const addProduct = (data) => {
  return axios.post("/products", data);
};

export const editProduct = (data, id) => {
  return axios.put(`/products/${id}`, data);
};

export const deleteProduct = (id) => {
  return axios.delete(`/products/${id}`);
};

export const fetchBrands = () => {
  return axios.get(`/brands`);
};

export const editProductVariant = (count, parentId, id) => {
  return axios.put(
    process.env.NODE_ENV === "production"
      ? `http://78.47.89.182:3200/v1/products/variant/${parentId}/${id}`
      : `http://localhost:3200/v1/products/variant/${parentId}/${id}`,
    count
  );
};
