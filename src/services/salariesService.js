import axios from "../utils/axios";

export const fetchSalaries = (query = "", page = 0, start = 0) => {
	let url =
		query !== ""
			? `/salaries?_q=${query}&_sort=createdAt:DESC&_limit=10&_start=${start}`
			: `/salaries?_sort=createdAt:DESC&_limit=10&_start=${start}`;
	return axios.get(url);
};

export const fetchSalariesCount = () => {
	return axios.get("/salaries/count");
};

export const fetchSingleSalaries = (id) => {
	return axios.get(`/salaries/${id}`);
};

export const addSalaries = (data) => {
	return axios.post(`/salaries`, data);
};

export const editSalaries = (data, id) => {
	return axios.put(`/salaries/${id}`, data);
};

export const deleteSalaries = (id) => {
	return axios.delete(`/salaries/${id}`);
};

export const fetchEmployeesTransactionHistory = (id) => {
	let url = `${
		process.env.NODE_ENV === "production"
			? `http://185.88.154.250:3200/v1`
			: `http://localhost:3200/v1`
		}/employee/transactions/${id}`;
	return axios.get(url);
};

export const fetchEmployees = () => {
	return axios.get(`/employees`);
};
