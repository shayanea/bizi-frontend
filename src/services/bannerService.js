import axios from "../utils/axios";

export const fetchBanner = () => {
	return axios.get("/banners?_sort=createdAt:DESC&_limit=25");
};

export const fetchBannerCount = () => {
	return axios.get("/banners/count");
};

export const fetchSingleBanner = (id) => {
	return axios.get(`/banners/${id}`);
};

export const addBanner = (data) => {
	return axios.post("/banners", data);
};

export const deleteBanner = (id) => {
	return axios.delete(`/banners/${id}`);
};

export const editBanner = (data, id) => {
	return axios.put(`/banners/${id}`, data);
};
