import axios from "../utils/axios";

export const fetchTransactions = (
	query = "",
	start = 0,
	status = "",
	startDateTime = null,
	endDateTime = null
) => {
	let url =
		query !== ""
			? `/transactions?_q=${query}&_sort=createdAt:DESC&_limit=10`
			: `/transactions?_sort=createdAt:DESC&_limit=10`;
	if (status) {
		url =
			query !== ""
				? `/transactions?_q=${query}&_sort=createdAt:DESC&_limit=10&status=${status}`
				: `/transactions?_sort=createdAt:DESC&_limit=10&status=${status}`;
	}

	if (startDateTime && !endDateTime) {
		url += `&createdAt_gte=${startDateTime}`;
	}

	if (endDateTime && !startDateTime) {
		url += `&createdAt_lte=${endDateTime}`;
	}

	if (startDateTime && endDateTime) {
		url += `&createdAt_gte=${startDateTime}&createdAt_lte=${endDateTime}`;
	}

	url += `&_start=${start}`;

	return axios.get(url);
};

export const fetchTransactionsCount = (
	query = "",
	start = 0,
	status = "",
	startDateTime = null,
	endDateTime = null
) => {
	let url =
		query !== ""
			? `/transactions/count?_q=${query}&_sort=createdAt:DESC&_limit=10`
			: `/transactions/count?_sort=createdAt:DESC&_limit=10`;
	if (status) {
		url =
			query !== ""
				? `/transactions/count?_q=${query}&_sort=createdAt:DESC&_limit=10&status=${status}`
				: `/transactions/count?_sort=createdAt:DESC&_limit=10&status=${status}`;
	}
	if (startDateTime && !endDateTime) {
		url += `&createdAt_gte=${startDateTime}`;
	}

	if (endDateTime && !startDateTime) {
		url += `&createdAt_lte=${endDateTime}`;
	}

	if (startDateTime && endDateTime) {
		url += `&createdAt_gte=${startDateTime}&createdAt_lte=${endDateTime}`;
	}

	url += `&_start=${start}`;

	return axios.get(url);
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

export const fetchSingleTransactionByOrderId = (id) => {
	return axios.get(
		`${
		process.env.NODE_ENV === "production"
			? `http://185.88.154.250:3200/v1`
			: `http://localhost:3200/v1`
		}/transactions/order/${id}`
	);
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

export const deleteTransactionByOrderId = (id) => {
	axios.get(`/transactions?orderId=${id}`).then((res) => {
		if (res.data.length > 0) {
			deleteTransaction(res.data[0].id);
		}
	});
};