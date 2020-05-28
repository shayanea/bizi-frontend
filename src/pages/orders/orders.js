import { isEmpty } from 'lodash'
import React, { Component } from "react";
import {
	Grid,
	Notify,
	Input,
	Button,
	Sweetalert,
	Portal,
	BlockHeader,
	Select,
} from "zent";
import { withBaseIcon } from "react-icons-kit";
import { iosInformationOutline } from "react-icons-kit/ionicons/iosInformationOutline";
import { printer } from "react-icons-kit/feather/printer";
import { edit } from "react-icons-kit/feather/edit";
import { trash2 } from "react-icons-kit/feather/trash2";
import { shoppingCart } from 'react-icons-kit/feather/shoppingCart'
import moment from "jalali-moment";

import {
	fetchOrders,
	deleteOrder,
	fetchOrdersCount,
	fetchUsers,
	editOrder
} from "../../services/orderService";
import { deleteTransactionByOrderId, addTransaction, fetchSingleTransactionByOrderId } from "../../services/transactionService";
import Block from "../../components/common/block";

const Icon = withBaseIcon({ size: 18, style: { color: "#fff" } });

class Orders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			datasets: [],
			users: [],
			count: 0,
			searchText: "",
			selectedStatus: null,
			orderItems: null,
			isLoading: true,
			pageInfo: {
				pageSize: 10,
				total: 0,
				current: 0,
				start: 0,
			},
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData = (query = "", page = 0, start = 0, status = null) => {
		let { pageInfo } = this.state;
		Promise.all([
			fetchOrdersCount(query, status),
			fetchOrders(query, start, status),
			fetchUsers(),
		])
			.then((res) => {
				this.setState({
					datasets: res[1].data,
					count: res[0].data,
					users: res[2].data,
					isLoading: false,
					pageInfo: {
						...pageInfo,
						total: res[0].data,
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
		const { selectedStatus } = this.state;
		this.setState(
			{
				isLoading: true,
			},
			this.fetchData(
				"",
				Number(current),
				(current - 2) * 10 + 10,
				selectedStatus
			)
		);
	};

	removeOrder = (id) => {
		Sweetalert.confirm({
			content: `آیا مطمئن به حذف این سفارش هستید؟`,
			title: `توجه`,
			confirmType: "danger",
			confirmText: `حذف`,
			cancelText: `خیر`,
			onConfirm: () =>
				new Promise((resolve) => {
					deleteOrder(id)
						.then(() => {
							this.fetchData();
							deleteTransactionByOrderId(id);
							Notify.success("سفارش مورد نظر حذف گردید.", 5000);
							return resolve();
						})
						.catch((err) => {
							Notify.error("در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
							return resolve();
						});
				}),
		});
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
				return <span className="order-status status2">ارسال برای چاپ</span>;
			case 7:
				return <span className="order-status status2">آماده ارسال</span>;
			default:
				return "";
		}
	};

	onPressEnter = (e) => {
		let { selectedStatus } = this.state;
		this.setState({ isLoading: true, searchText: e.target.value });
		if (e.target.value && e.target.value.trim() !== "") {
			return this.fetchData(e.target.value, 0, 0, selectedStatus);
		}
	};

	renderCourier = (id) => {
		return this.state.users.map((item) => {
			return item.courierId === Number(id) ? item.fullName : "";
		});
	};

	onChangeStatus = (e, item) => {
		this.setState({ selectedStatus: item.id, isLoading: true });
		return this.fetchData(this.state.searchText, 0, 0, item.id);
	};

	renderTotalOrderPrice = (data) => {
		let { priceWithDiscount, price, orderCount } = data;
		if (
			priceWithDiscount &&
			Number(priceWithDiscount) !== 0 &&
			Number(priceWithDiscount) < Number(price)
		) {
			return (Number(priceWithDiscount) * Number(orderCount)).toLocaleString(
				"fa"
			);
		}
		return (Number(price) * Number(orderCount)).toLocaleString(
			"fa"
		);
	};

	renderOrderStatus = (status) => {
		switch (Number(status)) {
			case 1:
				return "آنلاین";
			case 2:
				return "کاستوم";
			case 3:
				return "اینستاگرام";
			case 4:
				return "حضوری";
			default:
				return "";
		}
	};

	renderTotalInvoicePrice = (priceWithDiscount, price) => {
		if (price && Number(price) > 0 && Number(price) < Number(priceWithDiscount)) {
			return price;
		}
		return priceWithDiscount;
	};

	addInvoiceToTransaction = async item => {
		const { orderStatus, priceWithDiscount, price, fullName, id } = item;
		this.setState({ isLoading: true })
		let result = await fetchSingleTransactionByOrderId(id);
		if (isEmpty(result.data)) {
			Sweetalert.confirm({
				content: `آیا مطمئن به حذف این سفارش هستید؟`,
				title: `توجه`,
				confirmType: "danger",
				confirmText: `حذف`,
				cancelText: `خیر`,
				onConfirm: () =>
					new Promise((resolve) => {
						addTransaction({
							name: this.renderOrderStatus(orderStatus),
							price: this.renderTotalInvoicePrice(priceWithDiscount, price),
							status: 2,
							description: `خرید از طرف ${fullName}`,
							picture: [],
							transactionType: 1,
							cutomeDate: null,
							orderId: id,
						})
							.then(() => {
								Notify.success("سفارش مورد نظر با موفقیت  به تراکنش مالی اضافه گردید.", 5000);
								this.setState({ isLoading: false })
								return resolve();
							})
							.catch((err) => {
								Notify.error("در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
								return resolve();
							});
					}),
			});
		}
		return Notify.error("سفارش مورد نظر از قبل در لیست پرداختی‌ها موجود است.", 5000);
	}

	render() {
		const {
			datasets,
			count,
			orderItems,
			pageInfo,
			selectedStatus,
			isLoading,
		} = this.state;
		const { history } = this.props;
		const orders = [
			{
				title: "نام محصول",
				name: "name",
				bodyRender: (data) => {
					return `${data.name}`;
				},
			},
			{
				title: "قیمت",
				bodyRender: (data) => {
					return `${Number(data.price).toLocaleString("fa")} تومان`;
				},
			},
			{
				title: "تعداد",
				bodyRender: (data) => {
					return data.orderCount;
				},
			},
			{
				title: "قیمت کل (تومان)",
				bodyRender: (data) => {
					return this.renderTotalOrderPrice(data);
				},
			},
			{
				title: "",
			},
		];
		const columns = [
			{
				title: "نام و نام خانوادگی",
				bodyRender: (data) => {
					return (
						<div
							style={{ cursor: "pointer" }}
							onClick={() =>
								this.setState({
									orderItems: {
										items: data.orderItems,
										address: data.address,
										price: Number(data.price).toLocaleString("fa"),
									},
								})
							}
						>
							<Icon style={{ marginLeft: 5 }} icon={iosInformationOutline} />
							{data.fullName} ({data.invoiceNumber})
						</div>
					);
				},
			},
			{
				title: "شماره تماس",
				name: "mobileNumber",
			},
			{
				title: "تاریخ",
				name: "createdAt",
				bodyRender: (data) => {
					return moment(data.createdAt).locale("fa").format("YYYY/M/D - HH:mm");
				},
			},
			// {
			//   title: "آدرس",
			//   width: 20,
			//   bodyRender: (data) => {
			//     return <div className="long-content">{data.address}</div>;
			//   },
			// },
			{
				title: "قیمت",
				bodyRender: (data) => {
					return `${Number(data.price).toLocaleString("fa")} تومان`;
				},
			},
			{
				title: "قیمت با تخفیف",
				bodyRender: (data) => {
					return `${Number(data.priceWithDiscount).toLocaleString("fa")} تومان`;
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
				width: "18%",
				bodyRender: (data) => {
					return (
						<div className="table-control__container">
							{data.status !== 2 && <Button
								type="success"
								onClick={() => this.addInvoiceToTransaction(data)}
							>
								<Icon icon={shoppingCart} />
							</Button>}
							<Button
								type="warning"
								onClick={() => history.push(`/order/print/${data.id}`)}
							>
								<Icon icon={printer} />
							</Button>
							<Button
								type="primary"
								onClick={() => history.push(`/order/${data.id}`)}
								style={{ marginRight: data.status !== 2 ? 0 : 10 }}
							>
								<Icon icon={edit} />
							</Button>
							<Button
								type="danger"
								onClick={() => this.removeOrder(data.id)}
								style={{ marginRight: 0 }}
							>
								<Icon icon={trash2} />
							</Button>
						</div>
					);
				},
			},
		];

		return (
			<div className="animated fadeIn">
				<Block>
					<h1 className="title">فهرست سفارش‌ها ({count})</h1>
					<div className="row">
						<Select
							data={[
								{ id: "", name: "وضعیت سفارش‌ها" },
								{ id: 1, name: "ثبت شده" },
								{ id: 2, name: "پرداخت شده" },
								{ id: 3, name: "در حال ارسال" },
								{ id: 4, name: "تحویل داده شده" },
								{ id: 5, name: "لغو" },
							]}
							autoWidth
							optionText="name"
							optionValue="id"
							placeholder="انتخاب نوع وضعیت"
							emptyText="هیچ آیتمی یافت نشده است."
							onChange={this.onChangeStatus}
							value={selectedStatus}
						/>
						<Input
							onPressEnter={this.onPressEnter}
							icon="search"
							placeholder="جستجو ..."
						/>
						<Button
							className="add-btn"
							onClick={() => history.push("/order/add")}
						>
							درج سفارش
            </Button>
					</div>
				</Block>
				<Grid
					pageInfo={pageInfo}
					columns={columns}
					datasets={datasets}
					onChange={this.onChange}
					emptyLabel={"هیچ سفارشی یافت نشده است."}
					loading={isLoading}
				/>
				<Portal
					visible={orderItems ? true : false}
					onClose={() => this.setState({ orderItems: null })}
					className="layer"
					style={{ background: "rgba(0, 0, 0, 0.4)" }}
					useLayerForClickAway
					closeOnClickOutside
					closeOnESC
					blockPageScroll
				>
					{orderItems && (
						<div className="custom-portal__container">
							<Grid
								columns={orders}
								datasets={orderItems.items}
								emptyLabel={"هیچ سفارشی یافت نشده است."}
							/>
							<BlockHeader
								type="minimum"
								title={`آدرس: ${orderItems.address}`}
							></BlockHeader>
							<BlockHeader
								title={`کل مبلغ خرید: ${orderItems.price} تومان`}
							></BlockHeader>
						</div>
					)}
				</Portal>
			</div>
		);
	}
}

export default Orders;
