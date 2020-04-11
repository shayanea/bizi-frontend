import axios from "../utils/axios";

const fetchTotalProducts = () => axios.get("/products/count");

const fetchTotalOrders = () => axios.get("orders/count");

const fetchTotalCustomers = () => axios.get("/customers/count");

const fetchLatestOrders = () => axios.get("/orders?_limit=5");

export const fetchDashboardData = () => {
  return Promise.all([
    fetchTotalProducts(),
    fetchTotalOrders(),
    fetchLatestOrders(),
    fetchTotalCustomers(),
  ]);
};
