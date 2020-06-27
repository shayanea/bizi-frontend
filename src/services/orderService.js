import axios from "../utils/axios";

export const fetchOrders = (query = "", start = 0, status = null, sortType = null) => {
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

	if (sortType) {
		url =
			query !== ""
				? `/orders?_q=${query}&_sort=createdAt:${sortType}&_limit=10&_start=${start}`
				: `/orders?_sort=createdAt:${sortType}&_limit=10&_start=${start}`;
	}
	return axios.get(url);
};

export const fetchOrdersCount = (query = "", status = null) => {
	let url =
		query !== ""
			? `/orders/count?_q=${query}&_sort=createdAt:DESC&_limit=10`
			: `/orders/count?_sort=createdAt:DESC&_limit=10`;
	if (status) {
		url =
			query !== ""
				? `/orders/count?_q=${query}&_sort=createdAt:DESC&_limit=10&status=${status}`
				: `/orders/count?_sort=createdAt:DESC&_limit=10&status=${status}`;
	}
	return axios.get(url);
};

export const fetchSingleOrder = (id) => {
	return axios.get(`/orders/${id}`);
};

export const fetchAllTranscationByOrderId = array => {
	return axios.get(
		`${
		process.env.NODE_ENV === "production"
			? `http://185.88.154.250:3200/v1`
			: `http://localhost:3200/v1`
		}/transactions/getTransactionByArrayOrderId/${array}`
	);
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
