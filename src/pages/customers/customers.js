import React, { Component } from "react";
import { Grid, Notify, Input, Button, Portal, BlockHeader } from "zent";
import moment from "jalali-moment";

import {
	fetchCustomers,
	fetchCustomersCount,
	fetchUsers,
	fetchOrdersByMobileNumber,
	fetchBestBuyest,
} from "../../services/customerService";
import Block from "../../components/common/block";

class Customers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			datasets: [],
			users: [],
			orderItems: null,
			showModal: false,
			isLoading: true,
			pageInfo: {
				pageSize: 10,
				total: 0,
				current: 0,
				start: 0,
			},
			searchText: "",
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData = (query = "", page = 0, start = 0) => {
		let { pageInfo } = this.state;
		Promise.all([
			fetchCustomers(query, start),
			fetchCustomersCount(),
			fetchUsers(),
			fetchBestBuyest(),
		])
			.then((res) => {
				this.setState({
					datasets: res[0].data,
					users: res[2].data,
					isLoading: false,
					pageInfo: {
						...pageInfo,
						total: res[1].data,
						current: page,
					},
				});
			})
			.catch((err) =>
				Notify.error(
					"در برقراری ارتباط مشکلی به وجود آمده است، مجددا تلاش نمایید."
				)
			);
	};

	onChange = ({ current }) => {
		this.setState(
			{
				isLoading: true,
			},
			this.fetchData(
				this.start.searchText,
				Number(current),
				(current - 2) * 10 + 10
			)
		);
	};

	onPressEnter = (e) => {
		this.setState({ isLoading: true, searchText: e.target.value });
		if (e.target.value && e.target.value.trim() !== "") {
			return this.fetchData(e.target.value, 0, 0);
		}
	};

	renderStatus = (status) => {
		switch (Number(status)) {
			case 1:
				return <span className="order-status status1">ثبت شده</span>;
			case 2:
				return <span className="order-status status2">پرداخت شده</span>;
			case 3:
				return <span className="order-status status3">در حال ارسال</span>;
			case 4:
				return <span className="order-status status4">تحویل داده شده</span>;
			case 5:
				return <span className="order-status status5">لغو</span>;
			case 6:
				return <span className="order-status status6">ارسال برای چاپ</span>;
			case 7:
				return <span className="order-status status7">آماده ارسال</span>;
			default:
				return "";
		}
	};

	renderCourier = (id) => {
		return this.state.users.map((item) => {
			return item.courierId === Number(id) ? item.fullName : "";
		});
	};

	getCustomerOrders = (query) => {
		this.setState({ showModal: true });
		fetchOrdersByMobileNumber(query).then((res) => {
			return this.setState({ orderItems: res.data });
		});
	};

	getTotalOrders = () => {
		let total = 0,
			items = this.state.orderItems;
		items.forEach((item) => {
			total += item.price;
		});
		return `${total.toLocaleString("fa")} تومان`;
	};

	render() {
		const { datasets, orderItems, pageInfo, showModal, isLoading } = this.state;
		const orders = [
			{
				title: "تاریخ",
				name: "createdAt",
				bodyRender: (data) => {
					return moment(data.createdAt).locale("fa").format("YYYY/M/D");
				},
			},
			{
				title: "قیمت",
				bodyRender: (data) => {
					return `${Number(data.price).toLocaleString("fa")} تومان`;
				},
			},
			{
				title: "وضعیت",
				bodyRender: (data) => {
					return this.renderStatus(data.status);
				},
			},
			{
				title: "فرستنده",
				bodyRender: (data) => {
					return this.renderCourier(data.courier);
				},
			},
			{
				title: "",
				bodyRender: (data) => {
					return <div></div>;
				},
			},
		];
		const columns = [
			{
				title: "نام‌ و‌ نام خانوادگی",
				name: "fullName",
			},
			{
				title: "شماره تماس",
				name: "mobileNumber",
			},
			{
				title: "آدرس",
				name: "address",
			},
			{
				title: "تاریخ عضویت",
				name: "createdAt",
				bodyRender: (data) => {
					return moment(data.createdAt).locale("fa").format("YYYY/M/D");
				},
			},
			{
				title: "",
				bodyRender: (data) => {
					return (
						<Button
							type="primary"
							onClick={() => this.getCustomerOrders(data.mobileNumber)}
						>
							سفارشات
						</Button>
					);
				},
			},
		];
		return (
			<div className="animated fadeIn">
				<Block>
					<h1 className="title">فهرست مشتری‌ها</h1>
					<div className="row">
						<Input
							onPressEnter={this.onPressEnter}
							icon="search"
							placeholder="جستجو ..."
							style={{ marginLeft: 0 }}
						/>
					</div>
				</Block>
				<Grid
					pageInfo={pageInfo}
					columns={columns}
					datasets={datasets}
					onChange={this.onChange}
					emptyLabel={"هیچ مشتری یافت نشده است."}
					loading={isLoading}
					ellipsis={true}
				/>
				<Portal
					visible={showModal}
					onClose={() => this.setState({ showModal: false, orderItems: null })}
					className="layer"
					style={{ background: "rgba(0, 0, 0, 0.4)" }}
					useLayerForClickAway
					closeOnClickOutside
					closeOnESC
					blockPageScroll
				>
					<div className="custom-portal__container">
						{orderItems && (
							<div>
								<Grid
									columns={orders}
									datasets={orderItems}
									emptyLabel={"هیچ سفارشی یافت نشده است."}
								/>
								<BlockHeader
									title={`کل مبلغ خرید: ${this.getTotalOrders()} تومان`}
								></BlockHeader>
							</div>
						)}
					</div>
				</Portal>
			</div>
		);
	}
}

export default Customers;
