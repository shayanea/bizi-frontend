import React, { Component } from "react";
import { Grid, Notify, Portal, Button, Input, Sweetalert } from "zent";
import { withBaseIcon } from "react-icons-kit";
import { edit } from "react-icons-kit/feather/edit";
import { trash2 } from "react-icons-kit/feather/trash2";
import { iosInformationOutline } from "react-icons-kit/ionicons/iosInformationOutline";
import moment from "jalali-moment";

import {
	fetchProducts,
	deleteProduct,
	fetchProductsCount,
	// addProduct,
} from "../../services/productService";
// import { addWarehouseLog } from "../../services/warehouselogService";
import Block from "../../components/common/block";
import { StateContext } from "../../context/state";

const Icon = withBaseIcon({ size: 20, style: { color: "#fff" } });

class Products extends Component {
	static contextType = StateContext;

	constructor(props) {
		super(props);
		this.state = {
			datasets: [],
			count: 0,
			selectedAttributes: [],
			showModal: false,
			isLoading: true,
			searchText: "",
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

	fetchData = (query = "", page = 0, start = 0) => {
		let { pageInfo } = this.state;
		Promise.all([fetchProducts(query, page, start), fetchProductsCount(query, start)])
			.then((res) => {
				this.setState({
					datasets: res[0].data,
					count: res[1].data,
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
			this.fetchData("", Number(current), (current - 2) * 10 + 10)
		);
	};

	removeProduct = (id) => {
		Sweetalert.confirm({
			content: `آیا مطمئن به حذف این آیتم هستید؟`,
			title: `توجه`,
			confirmType: "danger",
			confirmText: `حذف`,
			cancelText: `خیر`,
			onConfirm: () =>
				new Promise((resolve) => {
					deleteProduct(id)
						.then(() => {
							this.fetchData();
							Notify.success("محصول مورد نظر حذف گردید.", 5000);
							return resolve();
						})
						.catch((err) => {
							Notify.error("در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
							return resolve();
						});
				}),
		});
	};

	onPressEnter = (e) => {
		let searchText = e.target.value;
		return fetchProducts(searchText, 0, 0)
			.then((res) => {
				this.setState({ datasets: res.data, searchText });
			})
			.catch((err) =>
				Notify.error(
					"در برقراری ارتباط مشکلی به وجود آمده است، مجددا تلاش نمایید."
				)
			);
	};

	onPressEnter = (e) => {
		if (e.target.value && e.target.value.trim() !== "") {
			this.setState({ isLoading: true, searchText: e.target.value });
			return this.fetchData(e.target.value, 0, 0);
		}
	};

	renderImage = (array) => {
		if (array.length > 0) {
			return process.env.NODE_ENV === "production"
				? `http://185.88.154.250:1337${array[0].url}`
				: `http://localhost:1337${array[0].url}`;
		}
		return "";
	};

	showProductAttributes = (selectedAttributes) => {
		this.setState({ selectedAttributes, showModal: true });
	};

	// searchThroughAttributes = (e) => {
	//   let value = e.target.value;
	// };

	render() {
		const {
			datasets,
			count,
			pageInfo,
			selectedAttributes,
			showModal,
			isLoading,
		} = this.state;
		const { history } = this.props;
		const [{ profile }] = this.context;
		let columns = [];
		if (profile) {
			let result = ["authenticated", "manager"].find(
				(item) => item === profile.role.type
			);
			columns = result
				? [
					{
						title: "نام محصول",
						width: "25%",
						bodyRender: (data) => {
							return (
								<div
									onClick={() => this.showProductAttributes(data.attributes)}
									style={{ display: "inline-flex", alignItems: "center" }}
								>
									<div
										style={{
											width: "50px",
											height: "50px",
											borderRadius: "6px",
											marginLeft: "10px",
											display: "inline-block",
											verticalAlign: "middle",
											backgroundImage: `url(${this.renderImage(data.image)})`,
											backgroundColor: "#ddd",
											backgroundSize: "cover"
										}}
									></div>
									<Icon
										style={{ marginLeft: 5 }}
										icon={iosInformationOutline}
									/>
									{data.name}
								</div>
							);
						},
					},
					{
						title: "قیمت",
						bodyRender: (data) => {
							return `${Number(data.price).toLocaleString("fa")} تومان`;
						},
					},
					{
						title: "قیمت تولید",
						bodyRender: (data) => {
							return `${Number(data.productionCost).toLocaleString(
								"fa"
							)} تومان`;
						},
					},
					{
						title: "تاریخ ثبت",
						bodyRender: (data) => {
							return moment(data.createdAt)
								.locale("fa")
								.format("YYYY/M/D - HH:mm");
						},
					},
					{
						title: "تاریخ به روزرسانی",
						bodyRender: (data) => {
							return moment(data.updatedAt)
								.locale("fa")
								.format("YYYY/M/D - HH:mm");
						},
					},
					{
						title: "",
						bodyRender: (data) => {
							return (
								<div className="table-control__container">
									<Button
										type="primary"
										onClick={() => history.push(`/product/${data.id}`)}
									>
										<Icon icon={edit} />
									</Button>
									<Button
										type="danger"
										onClick={() => this.removeProduct(data.id)}
									>
										<Icon icon={trash2} />
									</Button>
								</div>
							);
						},
					},
				]
				: [
					{
						title: "نام محصول",
						width: "25%",
						bodyRender: (data) => {
							return (
								<div
									onClick={() => this.showProductAttributes(data.attributes)}
								>
									<div
										style={{
											width: "50px",
											height: "50px",
											borderRadius: "6px",
											marginLeft: "10px",
											display: "inline-block",
											verticalAlign: "middle",
											backgroundImage: `url(${this.renderImage(data.image)})`,
											backgroundColor: "#ddd",
										}}
									></div>
									<Icon
										style={{ marginLeft: 5 }}
										icon={iosInformationOutline}
									/>
									{data.name}
								</div>
							);
						},
					},
					{
						title: "تاریخ ثبت",
						bodyRender: (data) => {
							return moment(data.createdAt)
								.locale("fa")
								.format("YYYY/M/D - HH:mm");
						},
					},
					{
						title: "تاریخ به روزرسانی",
						bodyRender: (data) => {
							return moment(data.updatedAt)
								.locale("fa")
								.format("YYYY/M/D - HH:mm");
						},
					},
					{
						title: "",
						bodyRender: (data) => {
							return (
								<div className="table-control__container">
									<Button
										type="primary"
										onClick={() => history.push(`/product/${data.id}`)}
									>
										<Icon icon={edit} />
									</Button>
								</div>
							);
						},
					},
				];
		}
		const attributes = [
			{
				title: "رنگ",
				name: "color",
			},
			{
				title: "سایز",
				bodyRender: (data) => {
					return data.size.label;
				},
			},
			{
				title: "موجودی",
				name: "count",
			},
			{
				title: "",
			},
		];
		return (
			<div className="animated fadeIn">
				<Block>
					<h1 className="title">فهرست محصولات ({count})</h1>
					<div className="row">
						<Input
							onPressEnter={this.onPressEnter}
							icon="search"
							placeholder="جستجو ..."
						/>
						<Button
							className="add-btn"
							onClick={() => history.push("/product/add")}
						>
							درج محصول
            </Button>
					</div>
				</Block>
				{profile && (
					<Grid
						pageInfo={pageInfo}
						columns={columns}
						datasets={datasets}
						onChange={this.onChange}
						emptyLabel={"هیچ محصولی یافت نشده است."}
						loading={isLoading}
					/>
				)}
				<Portal
					visible={showModal ? true : false}
					onClose={() =>
						this.setState({ selectedAttributes: [], showModal: false })
					}
					className="layer"
					style={{ background: "rgba(0, 0, 0, 0.4)" }}
					useLayerForClickAway
					closeOnClickOutside
					closeOnESC
					blockPageScroll
				>
					{showModal && (
						<div
							style={{ minWidth: "50%" }}
							className="custom-portal__container"
						>
							{/* <Input
                onPressEnter={this.searchThroughAttributes}
                icon="search"
                placeholder="جستجو ..." 
              /> */}
							<Grid
								columns={attributes}
								datasets={selectedAttributes}
								emptyLabel={"هیچ سفارشی یافت نشده است."}
							/>
						</div>
					)}
				</Portal>
			</div>
		);
	}
}

export default Products;
