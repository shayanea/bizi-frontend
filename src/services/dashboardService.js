import axios from "../utils/axios";
import moment from 'jalali-moment'

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

const fetchTotalIncomeByWeek = () => {
	let startDate = moment().startOf('week').format("YYYY-MM-DD") + "T00:00:00.000Z",
		endDate = moment().endOf('week').format("YYYY-MM-DD") + "T00:00:00.000Z";
	return axios.get(
		`${
		process.env.NODE_ENV === "production"
			? `http://78.47.89.182:3200/v1`
			: `http://localhost:3200/v1`
		}/transactions/fetchTotalIncomeByDate?type=1&startDate=${startDate}&endDate=${endDate}`
	);
}

const fetchTotalIncomeByMonth = () => {
	let startDate = moment().startOf('jMonth').format("YYYY-MM-DD") + "T00:00:00.000Z",
		endDate = moment().endOf('jMonth').format("YYYY-MM-DD") + "T00:00:00.000Z";
	return axios.get(
		`${
		process.env.NODE_ENV === "production"
			? `http://78.47.89.182:3200/v1`
			: `http://localhost:3200/v1`
		}/transactions/fetchTotalIncomeByDate?type=2&startDate=${startDate}&endDate=${endDate}`
	);
}

const fetchTotalIncomeByYear = () => {
	let startDate = moment().startOf('jYear').format("YYYY-MM-DD") + "T00:00:00.000Z",
		endDate = moment().endOf('jYear').format("YYYY-MM-DD") + "T00:00:00.000Z";
	return axios.get(
		`${
		process.env.NODE_ENV === "production"
			? `http://78.47.89.182:3200/v1`
			: `http://localhost:3200/v1`
		}/transactions/fetchTotalIncomeByDate?type=4&startDate=${startDate}&endDate=${endDate}`
	);
}

const fetchTotalIncomeByLastWeek = () => {
	let startDate = moment().subtract(1, 'jMonth').startOf('jMonth').format("YYYY-MM-DD") + "T00:00:00.000Z",
		endDate = moment().subtract(1, 'jMonth').endOf('jMonth').format("YYYY-MM-DD") + "T00:00:00.000Z";
	return axios.get(
		`${
		process.env.NODE_ENV === "production"
			? `http://78.47.89.182:3200/v1`
			: `http://localhost:3200/v1`
		}/transactions/fetchTotalIncomeByDate?type=5&startDate=${startDate}&endDate=${endDate}`
	);
}

export const fetchTotalIncomeByCustomDate = (startDate, endDate) => {
	return axios.get(
		`${
		process.env.NODE_ENV === "production"
			? `http://78.47.89.182:3200/v1`
			: `http://localhost:3200/v1`
		}/transactions/fetchTotalIncomeByCustomDate?startDate=${startDate}&endDate=${endDate}`
	);
}

export const fetchTotalPaidSalariesByCustomDate = (startDate, endDate) => {
	return axios.get(
		`${
		process.env.NODE_ENV === "production"
			? `http://78.47.89.182:3200/v1`
			: `http://localhost:3200/v1`
		}/transactions/fetchTotalPaidSalariesByCustomDate?startDate=${startDate}&endDate=${endDate}`
	);
}


export const fetchTotalIncomeByDate = () => {
	return Promise.all([fetchTotalIncomeByWeek(), fetchTotalIncomeByMonth(), fetchTotalIncomeByYear(), fetchTotalIncomeByLastWeek()])
}

const fetchTotalDept = () => {
	return axios.get(
		`${
		process.env.NODE_ENV === "production"
			? `http://78.47.89.182:3200/v1`
			: `http://localhost:3200/v1`
		}/transactions/fetchTotalDept`
	);
}

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
		fetchTotalDept(),
		fetchTotalPaidSalariesByCustomDate()
	]);
};
