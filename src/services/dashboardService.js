import axios from "../utils/axios";

const fetchTotalProducts = () => axios.get("/products/count");

const fetchTotalOrders = () => axios.get("orders/count");

const fetchTotalCustomers = () => axios.get("/customers/count");

const fetchLatestOrders = () =>
  axios.get("/orders?_limit=5&_sort=createdAt:DESC");

const fetchTotalUsers = () => axios.get("/users");

const fetchMostTypeProduct = () => {
  return axios.get(
    `${
      process.env.NODE_ENV === "production"
        ? `http://78.47.89.182:3200/v1`
        : `http://localhost:3200/v1`
    }/products/fetchMostTypeProduct`
  );
};

const fetchMostProfitableProduct = () => {
  return axios.get(
    `${
      process.env.NODE_ENV === "production"
        ? `http://78.47.89.182:3200/v1`
        : `http://localhost:3200/v1`
    }/order/fetchMostProfitableProduct`
  );
};

const fetchTotalIncome = () => {
  return axios.get(
    `${
      process.env.NODE_ENV === "production"
        ? `http://78.47.89.182:3200/v1`
        : `http://localhost:3200/v1`
    }/transactions/fetchTotalIncome`
  );
};

const fetchTotalOutcome = () => {
  return axios.get(
    `${
      process.env.NODE_ENV === "production"
        ? `http://78.47.89.182:3200/v1`
        : `http://localhost:3200/v1`
    }/transactions/fetchTotalOutcome`
  );
};

export const fetchDashboardData = () => {
  return Promise.all([
    fetchTotalProducts(),
    fetchTotalOrders(),
    fetchLatestOrders(),
    fetchTotalCustomers(),
    fetchTotalUsers(),
    fetchMostTypeProduct(),
    fetchMostProfitableProduct(),
    fetchTotalIncome(),
    fetchTotalOutcome(),
  ]);
};
