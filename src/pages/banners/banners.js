import React, { Component } from "react";
import { Grid, Notify, Button, Sweetalert } from "zent";
import moment from "jalali-moment";
import { withBaseIcon } from "react-icons-kit";
import { edit } from "react-icons-kit/feather/edit";
import { trash2 } from "react-icons-kit/feather/trash2";

import {
	fetchBanner,
	fetchBannerCount,
	deleteBanner,
} from "../../services/bannerService";
import Block from "../../components/common/block";

const Icon = withBaseIcon({ size: 20, style: { color: "#555" } });

class Banners extends Component {
	constructor(props) {
		super(props);
		this.state = {
			datasets: [],
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

	fetchData = () => {
		fetchBanner()
			.then((res) => {
				this.setState({
					datasets: res.data,
					isLoading: false,
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

	removeBanner = (id) => {
		Sweetalert.confirm({
			content: `آیا مطمئن به حذف این بنر هستید؟`,
			title: `توجه`,
			confirmType: "danger",
			confirmText: `حذف`,
			cancelText: `خیر`,
			onConfirm: () =>
				new Promise((resolve) => {
					deleteBanner(id)
						.then(() => {
							this.fetchData();
							Notify.success("بنر مورد نظر حذف گردید.", 5000);
							return resolve();
						})
						.catch((err) => {
							Notify.error("در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
							return resolve();
						});
				}),
		});
	};

	render() {
		const { datasets, pageInfo, isLoading } = this.state;
		const { history } = this.props;
		const columns = [
			{
				title: "عنوان",
				name: "title",
			},
			{
				title: "توضیحات",
				name: "description",
			},
			{
				title: "تاریخ",
				name: "createdAt",
				bodyRender: (data) => {
					return moment(data.createdAt).locale("fa").format("YYYY/M/D - HH:mm");
				},
			},
			{
				title: "",
				bodyRender: (data) => {
					return (
						<div className="table-control__container">
							<Button
								type="primary"
								className="icon"
								onClick={() => history.push(`/banner/${data.id}`)}
							>
								<Icon style={{ marginLeft: 5 }} icon={edit} />
							</Button>
							<Button
								type="danger"
								className="icon"
								onClick={() => this.removeBanner(data.id)}
							>
								<Icon style={{ marginLeft: 5 }} icon={trash2} />
							</Button>
						</div>
					);
				},
			},
		];
		return (
			<div className="animated fadeIn">
				<Block>
					<h1 className="title">فهرست بنر‌ها</h1>
					<div className="row">
						<Button
							className="add-btn"
							onClick={() => history.push("/banner/add")}
						>
							درج بنر
            </Button>
					</div>
				</Block>
				<Grid
					pageInfo={pageInfo}
					columns={columns}
					datasets={datasets}
					onChange={this.onChange}
					emptyLabel={"هیچ بنری یافت نشده است."}
					loading={isLoading}
				/>
			</div>
		);
	}
}

export default Banners;
