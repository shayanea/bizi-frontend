import React, { useEffect, useState } from "react";
import { orderBy } from "lodash";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Grid, Portal, BlockHeader } from "zent";
import { withBaseIcon } from "react-icons-kit";
import { iosInformationOutline } from "react-icons-kit/ionicons/iosInformationOutline";
import moment from "jalali-moment";

import { fetchDashboardData } from "../services/dashboardService";

const Icon = withBaseIcon({ size: 20, style: { color: "#555" } });

const Dashboard = () => {
	const [dashboardData, setDashboardData] = useState({
		ordersTotal: 0,
		productsTotal: 0,
		customerTotal: 0,
		totalOutcome: 0,
		totalIncome: 0,
		totalDept: 0,
		orders: [],
		users: [],
		mostDuplicateItems: [],
		bestCustomers: [],
		isLoading: true,
	});
	const [orderItems, setOrderItems] = useState(null);

	useEffect(() => {
		fetchDashboardData()
			.then((res) => {
				setDashboardData({
					ordersTotal: res[1].data,
					productsTotal: res[0].data,
					customerTotal: res[3].data,
					orders: res[2].data,
					users: res[4].data,
					mostDuplicateItems: orderBy(res[5].data, "count", "desc").slice(0, 5),
					// bestCustomers: res[6].data,
					totalIncome: res[7].data.total,
					totalOutcome: res[8].data.total,
					totalDept: res[9].data.total,
					isLoading: false,
				});
			})
			.catch((err) => console.log(err));
	}, []);

	const renderStatus = (status) => {
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

	const renderCourier = (id) => {
		return dashboardData.users.map((item) => {
			return item.courierId === Number(id) ? item.fullName : "";
		});
	};

	const orders = [
		{
			title: "نام محصول",
			name: "name",
			bodyRender: (data) => {
				return `${data.name}`;
			},
		},
		{
			title: "تعداد",
			bodyRender: (data) => {
				return data.orderCount;
			},
		},
		{
			title: "قیمت",
			bodyRender: (data) => {
				return `${Number(data.price).toLocaleString("fa")} تومان`;
			},
		},
		// {
		//   title: "موجودی",
		//   name: "count",
		// },

		{
			title: "قیمت کل (تومان)",
			bodyRender: (data) => {
				return (Number(data.price) * Number(data.orderCount)).toLocaleString(
					"fa"
				);
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
							setOrderItems({
								items: data.orderItems,
								address: data.address,
								price: Number(data.price).toLocaleString("fa"),
								fullName: data.fullName,
								mobileNumber: data.mobileNumber
							})
						}
					>
						<Icon style={{ marginLeft: 5 }} icon={iosInformationOutline} />
						{data.fullName}
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
				return renderStatus(data.status);
			},
		},
		{
			title: "فرستنده",
			bodyRender: (data) => {
				return renderCourier(data.courier);
			},
		},
		{
			title: "",
		},
	];

	const columns2 = [
		{
			title: "نام محصول",
			name: "name",
		},
		{
			title: "تعداد تنوع",
			name: "count",
		},
	];

	// const columns3 = [
	//   {
	//     title: "نام و نام خانوادگی",
	//     name: "fullName",
	//   },
	//   {
	//     title: "تعداد تنوع",
	//     name: "count",
	//   },
	// ];

	return (
		<Container className="animated fadeIn">
			<Row>
				<div className="col-items">
					<div>
						<h3>کل سفارشات</h3>
						<span>{dashboardData.ordersTotal}</span>
					</div>
					<Link to="/orders">مشاهده</Link>
				</div>
				<div className="col-items">
					<div>
						<h3>کل محصولات</h3>
						<span>{dashboardData.productsTotal}</span>
					</div>
					<Link to="/products">مشاهده</Link>
				</div>
				<div className="col-items">
					<div>
						<h3>کل مشتری‌ها</h3>
						<span>{dashboardData.customerTotal}</span>
					</div>
					<Link to="/customers">مشاهده</Link>
				</div>
			</Row>
			<Row style={{ marginTop: "25px" }}>
				<div className="col-items">
					<div>
						<h3>کل مبلغ پرداختی</h3>
						<span>{dashboardData.totalOutcome.toLocaleString("fa")} تومان</span>
					</div>
				</div>
				<div className="col-items">
					<div>
						<h3>کل مبلغ دریافتی</h3>
						<span>{dashboardData.totalIncome.toLocaleString("fa")} تومان</span>
					</div>
				</div>
				<div className="col-items">
					<div>
						<h3>کل مبلغ بستانکار</h3>
						<span>{dashboardData.totalDept.toLocaleString("fa")} تومان</span>
					</div>
				</div>
			</Row>
			<h2>لیست آخرین سفارشات</h2>
			<Grid
				columns={columns}
				datasets={dashboardData.orders}
				loading={dashboardData.isLoading}
				emptyLabel={"هیچ سفارشی یافت نشده است."}
			/>
			<Row style={{ marginTop: "20px" }}>
				<div className="table-items">
					<h2>بیشترین تنوع محصول</h2>
					<Grid
						pageInfo={{ pageSize: 5, total: 5, current: 0, start: 0 }}
						columns={columns2}
						datasets={dashboardData.mostDuplicateItems}
						loading={dashboardData.isLoading}
						emptyLabel={"هیچ آیتمی یافت نشده است."}
					/>
				</div>
				<div className="table-items">
					{/* <h2>بیشترین خرید</h2>
          <Grid
            columns={columns3}
            datasets={dashboardData.bestCustomers}
            loading={dashboardData.isLoading}
            emptyLabel={"هیچ آیتمی یافت نشده است."}
          /> */}
				</div>
			</Row>
			<Portal
				visible={orderItems ? true : false}
				onClose={() => setOrderItems(null)}
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
						<div className="inovice-information">
							<span>نام و نام خانوادگی: {orderItems.fullName}</span>
							<span>شماره تماس: {orderItems.mobileNumber}</span>
							<span>آدرس: {orderItems.address}</span>
							<span>کل مبلغ خرید: {orderItems.price} تومان</span>
						</div>
					</div>
				)}
			</Portal>
		</Container>
	);
};

const Container = styled.div`
  position: relative;
  h2 {
    margin: 25px 0;
    color: #fff;
    font-size: 2em;
		@media(max-width: 550px) {
			font-size: 1.5em;
		}
  }
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
	@media(max-width: 550px) {
		flex-direction: column;
	}
  .table-items {
    flex: 1;
    padding: 15px 0;
    margin-left: 15px;
		@media(max-width: 550px) {
			width: 100%;
		}
    :last-child {
      margin-left: 0;
    }
  }
  .col-items {
    flex: 1;
    padding: 15px;
    min-height: 100px;
    border-radius: 10px;
    background-color: #fff;
    text-align: right;
    margin-left: 15px;
		@media(max-width: 550px) {
			width: calc(100% - 30px);
			margin-bottom: 20px;
		}
    :last-child {
      margin-left: 0;
    }
    h3 {
      font-size: 1.5em;
      font-weight: bold;
      margin-bottom: 15px;
      color: #333;
			@media(max-width: 550px) {
				font-size: 1.2em;
			}
    }
    span {
      font-size: 2em;
      color: #000;
			@media(max-width: 550px) { 
				font-size: 1.5em;
			}
    }
    a {
      display: block;
      text-align: left;
      color: #999;
      font-size: 13px;
      font-weight: bold;
      transition: color 0.3s ease;
      :hover {
        color: #444;
        transition: color 0.3s ease;
      }
    }
  }
`;

export default Dashboard;
