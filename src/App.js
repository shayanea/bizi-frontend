/* eslint-disable react-hooks/exhaustive-deps */
import * as _ from "lodash";
import React from "react";
import styled from "styled-components";
import { Switch, Route, Redirect, Router } from "react-router-dom";
// history
import { history } from "./utils/history";
// State Provider
import { StateProvider } from "./context/state";
// Log
// import LogRocket from "logrocket";
// import setupLogRocketReact from "logrocket-react";
// 404
import NotFoundPage from "./pages/notfound";
// Navbar
import Navbar from "./components/common/navbar";
// Menu
import Menu from "./components/common/menu";
// Auth
import Login from "./pages/auth/login";
import ForgotPassword from "./pages/auth/forgotPassword";
// Dashboard
import Dashboard from "./pages/dashboard";
// Product
import Products from "./pages/products/products";
import AddProduct from "./pages/products/add";
import EditProduct from "./pages/products/edit";
// User
import Users from "./pages/users/users";
import AddUser from "./pages/users/add";
import EditUser from "./pages/users/edit";
// Order
import Orders from "./pages/orders/orders";
import AddOrder from "./pages/orders/add";
import EditOrder from "./pages/orders/edit";
import PrintOrder from "./pages/orders/print";
// Customers
import Customers from "./pages/customers/customers";
// Warehouse Log
import WarehouseLog from "./pages/warehouse/log";
// Transactions
import Transactions from "./pages/transaction/transaction";
import AddTransactions from "./pages/transaction/add";
import EditTransactions from "./pages/transaction/edit";
// Salaries
import Salaries from "./pages/salaries/salaries";
import AddSalaries from "./pages/salaries/add";
// Employee
import Employee from "./pages/employee/employee";
import AddEmployee from "./pages/employee/add";
import EditEmployee from "./pages/employee/edit";
// Reports
import Reports from './pages/reports/reports'

// LogRocket.init("ptczo3/bizi-dashboard");
// setupLogRocketReact(LogRocket);

const isAuthenticated = () => {
	return localStorage.getItem("@token");
};

const PrivateRoute = ({ component: Component, ...rest }) => (
	<MainContainer className="animated fadeIn">
		<Navbar />
		<MenuContainer id="menu">
			<Menu />
		</MenuContainer>
		<Wrapper id="wrapper">
			<Route
				{...rest}
				render={(props) =>
					isAuthenticated() ? (
						<Component {...props} />
					) : (
							<Redirect
								to={{
									pathname: "/login",
								}}
							/>
						)
				}
			/>
		</Wrapper>
	</MainContainer>
);

const NoMatch = () => <NotFoundPage />;

function App() {
	return (
		<StateProvider>
			<Router history={history}>
				<Switch>
					{/* Dashboard */}
					<PrivateRoute exact path="/" component={Dashboard} />
					{/* Products */}
					<PrivateRoute exact path="/products" component={Products} />
					<PrivateRoute exact path="/product/add" component={AddProduct} />
					<PrivateRoute exact path="/product/:id" component={EditProduct} />
					{/* Users */}
					<PrivateRoute exact path="/users" component={Users} />
					<PrivateRoute exact path="/user/add" component={AddUser} />
					<PrivateRoute exact path="/user/:id" component={EditUser} />
					{/* Orders */}
					<PrivateRoute exact path="/orders" component={Orders} />
					<PrivateRoute exact path="/order/add" component={AddOrder} />
					<PrivateRoute exact path="/order/:id" component={EditOrder} />
					<PrivateRoute exact path="/order/print/:id" component={PrintOrder} />
					{/* Customers */}
					<PrivateRoute exact path="/customers" component={Customers} />
					{/* Warehouse */}
					<PrivateRoute exact path="/warehouse-log" component={WarehouseLog} />
					{/* Transaction */}
					<PrivateRoute exact path="/transactions" component={Transactions} />
					<PrivateRoute
						exact
						path="/transaction/add"
						component={AddTransactions}
					/>
					<PrivateRoute
						exact
						path="/transaction/:id"
						component={EditTransactions}
					/>
					{/* Salaries */}
					<PrivateRoute exact path="/salaries" component={Salaries} />
					<PrivateRoute exact path="/salarie/add" component={AddSalaries} />
					{/* Employee */}
					<PrivateRoute exact path="/employee" component={Employee} />
					<PrivateRoute exact path="/employee/add" component={AddEmployee} />
					<PrivateRoute exact path="/employee/:id" component={EditEmployee} />
					{/* Reports */}
					<PrivateRoute exact path="/reports" component={Reports} />
					{/* Authentication */}
					<Route exact path="/login" component={Login} />
					<Route exact path="/forgetpassword" component={ForgotPassword} />
					{/* 404 */}
					<Route component={NoMatch} />
				</Switch>
			</Router>
		</StateProvider>
	);
}

const Wrapper = styled.div`
  display: block;
  margin: 25px 265px 25px 25px;
  @media (max-width: 1024px) {
    margin: 25px 215px 25px 25px;
  }
`;

const MainContainer = styled.div`
  display: block;
  height: 100%;
  width: 100%;
`;

const MenuContainer = styled.div`
  width: 250px;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background-color: #202124;
  border-left: 1px solid #1c2933;
  @media (max-width: 1024px) {
    width: 200px;
  }
`;

const array = [
	{
		"orderId": "0",
		"_id": "5ea82c666a3ca97fa3c7c946",
		"name": "بابت سرور به عراقی",
		"price": "114000",
		"status": 1,
		"description": "",
		"createdAt": "2020-04-28T13:15:18.516Z",
		"updatedAt": "2020-05-05T11:47:22.733Z",
		"__v": 0,
		"picture": [],
		"id": "5ea82c666a3ca97fa3c7c946"
	},
	{
		"orderId": "0",
		"_id": "5eb152742ce96a23f8b57005",
		"name": "پیک مشتری",
		"price": "22500",
		"status": 1,
		"description": "",
		"createdAt": "2020-05-05T11:48:04.219Z",
		"updatedAt": "2020-05-05T11:49:24.447Z",
		"__v": 0,
		"picture": [],
		"id": "5eb152742ce96a23f8b57005"
	},
	{
		"orderId": "0",
		"_id": "5eb5b73b2ce96a23f8b57027",
		"name": "فروش اینستاگرام",
		"price": "165000",
		"status": 2,
		"description": "",
		"transactionType": 1,
		"createdAt": "2020-05-08T19:47:07.525Z",
		"updatedAt": "2020-05-08T19:47:07.525Z",
		"__v": 0,
		"picture": [],
		"id": "5eb5b73b2ce96a23f8b57027"
	},
	{
		"orderId": "0",
		"_id": "5eb5bf442ce96a23f8b5702a",
		"name": "اینستاگرام",
		"price": "800000",
		"status": 2,
		"description": "",
		"transactionType": 1,
		"createdAt": "2020-05-08T20:21:24.430Z",
		"updatedAt": "2020-05-08T20:21:24.430Z",
		"__v": 0,
		"picture": [],
		"id": "5eb5bf442ce96a23f8b5702a"
	},
	{
		"orderId": "0",
		"_id": "5eb6e7762ce96a23f8b57089",
		"name": "اینستا",
		"price": "300000",
		"status": 2,
		"description": "",
		"transactionType": 1,
		"createdAt": "2020-05-09T17:25:10.272Z",
		"updatedAt": "2020-05-09T17:25:10.272Z",
		"__v": 0,
		"picture": [],
		"id": "5eb6e7762ce96a23f8b57089"
	},
	{
		"orderId": "0",
		"_id": "5eb6e78f2ce96a23f8b5708a",
		"name": "اینستا",
		"price": "750000",
		"status": 2,
		"description": "",
		"transactionType": 1,
		"createdAt": "2020-05-09T17:25:35.993Z",
		"updatedAt": "2020-05-09T17:25:35.993Z",
		"__v": 0,
		"picture": [],
		"id": "5eb6e78f2ce96a23f8b5708a"
	},
	{
		"orderId": "0",
		"_id": "5eb6e7aa2ce96a23f8b5708b",
		"name": "اینستا",
		"price": "570000",
		"status": 2,
		"description": "",
		"transactionType": 1,
		"createdAt": "2020-05-09T17:26:02.476Z",
		"updatedAt": "2020-05-09T17:26:02.476Z",
		"__v": 0,
		"picture": [],
		"id": "5eb6e7aa2ce96a23f8b5708b"
	},
	{
		"orderId": "0",
		"_id": "5eb6e7cb2ce96a23f8b5708c",
		"name": "اینستا",
		"price": "175000",
		"status": 2,
		"description": "",
		"transactionType": 1,
		"createdAt": "2020-05-09T17:26:35.596Z",
		"updatedAt": "2020-05-09T17:26:35.596Z",
		"__v": 0,
		"picture": [],
		"id": "5eb6e7cb2ce96a23f8b5708c"
	},
	{
		"orderId": "5eb6f9d92ce96a23f8b57096",
		"_id": "5eb82e4d2621363a4d2e2508",
		"name": "آنلاین",
		"price": "170000",
		"status": 2,
		"description": "خرید از طرف احمدرضا نعیمی",
		"transactionType": 1,
		"cutomeDate": "2020-05-10",
		"createdAt": "2020-05-10T16:39:41.944Z",
		"updatedAt": "2020-05-10T16:39:41.944Z",
		"__v": 0,
		"picture": [],
		"id": "5eb82e4d2621363a4d2e2508"
	},
	{
		"orderId": "5eb6cfe72ce96a23f8b57081",
		"_id": "5eb82e842621363a4d2e2509",
		"name": "اینستاگرام",
		"price": "570000",
		"status": 2,
		"description": "خرید از طرف محمد هادی صادقی",
		"transactionType": 1,
		"cutomeDate": "2020-05-10",
		"createdAt": "2020-05-10T16:40:36.475Z",
		"updatedAt": "2020-05-10T16:40:36.475Z",
		"__v": 0,
		"picture": [],
		"id": "5eb82e842621363a4d2e2509"
	},
	{
		"orderId": "5eb6be3d2ce96a23f8b57066",
		"_id": "5eb82ea02621363a4d2e250a",
		"name": "اینستاگرام",
		"price": "750000",
		"status": 2,
		"description": "خرید از طرف نیلوفر ثابت نژاد ",
		"transactionType": 1,
		"cutomeDate": "2020-05-10",
		"createdAt": "2020-05-10T16:41:04.518Z",
		"updatedAt": "2020-05-10T16:41:04.518Z",
		"__v": 0,
		"picture": [],
		"id": "5eb82ea02621363a4d2e250a"
	},
	{
		"orderId": "5eb6ba9f2ce96a23f8b5705b",
		"_id": "5eb82eaf2621363a4d2e250b",
		"name": "اینستاگرام",
		"price": "300000",
		"status": 2,
		"description": "خرید از طرف مهسا شرکتی",
		"transactionType": 1,
		"cutomeDate": "2020-05-10",
		"createdAt": "2020-05-10T16:41:19.926Z",
		"updatedAt": "2020-05-10T16:41:19.926Z",
		"__v": 0,
		"picture": [],
		"id": "5eb82eaf2621363a4d2e250b"
	},
	{
		"orderId": "5eb6b65e2ce96a23f8b57053",
		"_id": "5eb82ebc2621363a4d2e250c",
		"name": "اینستاگرام",
		"price": "175000",
		"status": 2,
		"description": "خرید از طرف عماد جربان",
		"transactionType": 1,
		"cutomeDate": "2020-05-10",
		"createdAt": "2020-05-10T16:41:32.698Z",
		"updatedAt": "2020-05-10T16:41:32.698Z",
		"__v": 0,
		"picture": [],
		"id": "5eb82ebc2621363a4d2e250c"
	},
	{
		"orderId": "5eb5ab382ce96a23f8b57019",
		"_id": "5eb82edc2621363a4d2e250d",
		"name": "اینستاگرام",
		"price": "800000",
		"status": 2,
		"description": "خرید از طرف رحمان تختی",
		"transactionType": 1,
		"cutomeDate": "2020-05-10",
		"createdAt": "2020-05-10T16:42:04.126Z",
		"updatedAt": "2020-05-10T16:42:04.126Z",
		"__v": 0,
		"picture": [],
		"id": "5eb82edc2621363a4d2e250d"
	},
	{
		"orderId": "5eb58b912ce96a23f8b57011",
		"_id": "5eb82ef72621363a4d2e250e",
		"name": "اینستاگرام",
		"price": "160000",
		"status": 2,
		"description": "خرید از طرف غزاله فولادی",
		"transactionType": 1,
		"cutomeDate": "2020-05-10",
		"createdAt": "2020-05-10T16:42:31.415Z",
		"updatedAt": "2020-05-10T16:42:31.415Z",
		"__v": 0,
		"picture": [],
		"id": "5eb82ef72621363a4d2e250e"
	},
	{
		"orderId": "5eb57bf22ce96a23f8b5700d",
		"_id": "5eb82f022621363a4d2e250f",
		"name": "اینستاگرام",
		"price": "165000",
		"status": 2,
		"description": "خرید از طرف خانم حقیقتی",
		"transactionType": 1,
		"cutomeDate": "2020-05-10",
		"createdAt": "2020-05-10T16:42:42.727Z",
		"updatedAt": "2020-05-10T16:42:42.727Z",
		"__v": 0,
		"picture": [],
		"id": "5eb82f022621363a4d2e250f"
	},
	{
		"orderId": "5eb69f8f2ce96a23f8b57030",
		"_id": "5eb98f262ce96a23f8b576b1",
		"name": "کاستوم",
		"price": "190000",
		"status": 2,
		"description": "خرید از طرف محمد وهمنی",
		"transactionType": 1,
		"createdAt": "2020-05-11T17:45:10.133Z",
		"updatedAt": "2020-05-19T09:00:51.525Z",
		"__v": 0,
		"picture": [],
		"id": "5eb98f262ce96a23f8b576b1"
	},
	{
		"orderId": "0",
		"_id": "5ebae7f32ce96a23f8b576d9",
		"name": "پیش پرداخت آقای بهادر فرزانه",
		"price": "3000000",
		"status": 2,
		"description": "",
		"transactionType": 1,
		"createdAt": "2020-05-12T18:16:19.577Z",
		"updatedAt": "2020-05-12T18:16:19.577Z",
		"__v": 0,
		"picture": [],
		"id": "5ebae7f32ce96a23f8b576d9"
	},
	{
		"orderId": "5eb999a62ce96a23f8b576b7",
		"_id": "5ebaec0f2ce96a23f8b576da",
		"name": "",
		"price": "165000",
		"status": 2,
		"description": "خرید از طرف حمید نداف",
		"transactionType": 1,
		"createdAt": "2020-05-12T18:33:51.454Z",
		"updatedAt": "2020-05-19T09:00:36.063Z",
		"__v": 0,
		"picture": [],
		"id": "5ebaec0f2ce96a23f8b576da"
	},
	{
		"orderId": "0",
		"_id": "5ec3e7f32ce96a23f8b5786b",
		"name": "حضوری",
		"price": "300000",
		"status": 2,
		"description": "خرید از طرف ارسلان غنی پور",
		"transactionType": 1,
		"createdAt": "2020-05-19T14:06:43.975Z",
		"updatedAt": "2020-05-20T18:22:56.133Z",
		"__v": 0,
		"picture": [],
		"id": "5ec3e7f32ce96a23f8b5786b"
	},
	{
		"orderId": "0",
		"_id": "5ec574c68c48071b8cf1931e",
		"name": "چاپ ",
		"price": "720000",
		"status": 1,
		"description": "فروش انلاین",
		"transactionType": 1,
		"createdAt": "2020-05-20T18:19:50.708Z",
		"updatedAt": "2020-05-20T18:23:36.649Z",
		"__v": 0,
		"picture": [],
		"id": "5ec574c68c48071b8cf1931e"
	},
	{
		"orderId": "0",
		"_id": "5ec57c748c48071b8cf19326",
		"name": "حضوری",
		"price": "750000",
		"status": 2,
		"description": "خرید از طرف علی درویش",
		"transactionType": 1,
		"createdAt": "2020-05-20T18:52:36.333Z",
		"updatedAt": "2020-05-20T18:52:36.333Z",
		"__v": 0,
		"picture": [],
		"id": "5ec57c748c48071b8cf19326"
	},
	{
		"orderId": "0",
		"_id": "5ec80c798c48071b8cf1936b",
		"name": "اینستاگرام",
		"price": "245000",
		"status": 2,
		"description": "خرید از طرف سارا شیخانی",
		"transactionType": 1,
		"createdAt": "2020-05-22T17:31:37.190Z",
		"updatedAt": "2020-05-22T17:31:37.190Z",
		"__v": 0,
		"picture": [],
		"id": "5ec80c798c48071b8cf1936b"
	},
	{
		"orderId": "5ebfc61c2ce96a23f8b5773c",
		"_id": "5ec034582ce96a23f8b5777b",
		"name": "اینستاگرام",
		"price": "1205000",
		"status": 2,
		"description": "خرید از طرف فرزاد نعم الحبیب",
		"transactionType": 1,
		"createdAt": "2020-05-16T18:43:36.576Z",
		"updatedAt": "2020-05-19T08:56:47.199Z",
		"__v": 0,
		"cutomeDate": "Sun May 17 2020 04:30:00 GMT+0430 (Iran Daylight Time)",
		"picture": [],
		"id": "5ec034582ce96a23f8b5777b"
	},
	{
		"orderId": "0",
		"_id": "5ec0acb92ce96a23f8b57785",
		"name": "واریز حقوق مریم ظهوری خامنه",
		"price": "378000",
		"status": 3,
		"description": "",
		"createdAt": "2020-05-17T03:17:13.225Z",
		"updatedAt": "2020-05-17T03:17:13.225Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0acb92ce96a23f8b57785"
	},
	{
		"orderId": "0",
		"_id": "5ec0ad102ce96a23f8b57787",
		"name": "واریز حقوق حدیث رحمتی",
		"price": "513000",
		"status": 3,
		"description": "",
		"createdAt": "2020-05-17T03:18:40.751Z",
		"updatedAt": "2020-05-17T03:18:40.751Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0ad102ce96a23f8b57787"
	},
	{
		"orderId": "0",
		"_id": "5ec0ad2d2ce96a23f8b57789",
		"name": "واریز حقوق سمیه مهدوی",
		"price": "490000",
		"status": 3,
		"description": "",
		"createdAt": "2020-05-17T03:19:09.655Z",
		"updatedAt": "2020-05-17T03:19:09.655Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0ad2d2ce96a23f8b57789"
	},
	{
		"orderId": "0",
		"_id": "5ec0ad4a2ce96a23f8b5778b",
		"name": "واریز حقوق بهروز رحیمی درینو",
		"price": "593000",
		"status": 3,
		"description": "",
		"createdAt": "2020-05-17T03:19:38.160Z",
		"updatedAt": "2020-05-17T03:19:38.160Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0ad4a2ce96a23f8b5778b"
	},
	{
		"orderId": "0",
		"_id": "5ec0ad692ce96a23f8b5778d",
		"name": "واریز حقوق میلاد",
		"price": "700000",
		"status": 3,
		"description": "",
		"createdAt": "2020-05-17T03:20:09.218Z",
		"updatedAt": "2020-05-17T03:20:09.218Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0ad692ce96a23f8b5778d"
	},
	{
		"orderId": "0",
		"_id": "5ec0adaa2ce96a23f8b5778e",
		"name": "پیک",
		"price": "28000",
		"status": 1,
		"description": "",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:21:14.926Z",
		"updatedAt": "2020-05-17T03:21:14.926Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0adaa2ce96a23f8b5778e"
	},
	{
		"orderId": "0",
		"_id": "5ec0adc32ce96a23f8b5778f",
		"name": "پست ",
		"price": "46000",
		"status": 2,
		"description": "",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:21:39.561Z",
		"updatedAt": "2020-05-17T03:21:39.561Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0adc32ce96a23f8b5778f"
	},
	{
		"orderId": "0",
		"_id": "5ec0aef52ce96a23f8b57790",
		"name": "پارچه نفیس",
		"price": "2700000",
		"status": 1,
		"description": "تسویه پارچه پنبه",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:26:45.307Z",
		"updatedAt": "2020-05-17T03:26:45.307Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0aef52ce96a23f8b57790"
	},
	{
		"orderId": "0",
		"_id": "5ec0af3d2ce96a23f8b57791",
		"name": "رگال و دکور",
		"price": "1350000",
		"status": 1,
		"description": "قفسه و طبقه فلزی شوروم",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:27:57.386Z",
		"updatedAt": "2020-05-17T03:27:57.386Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0af3d2ce96a23f8b57791"
	},
	{
		"orderId": "0",
		"_id": "5ec0af5a2ce96a23f8b57792",
		"name": "پیک",
		"price": "10000",
		"status": 1,
		"description": "",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:28:26.212Z",
		"updatedAt": "2020-05-17T03:28:26.212Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0af5a2ce96a23f8b57792"
	},
	{
		"orderId": "0",
		"_id": "5ec0afa02ce96a23f8b57793",
		"name": "مساعده به خانمرحمتی",
		"price": "300000",
		"status": 1,
		"description": "مساعده ازتنخواه ",
		"transactionType": 3,
		"createdAt": "2020-05-17T03:29:36.508Z",
		"updatedAt": "2020-05-17T03:29:36.508Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0afa02ce96a23f8b57793"
	},
	{
		"orderId": "0",
		"_id": "5ec0afd82ce96a23f8b57794",
		"name": "چاپ ",
		"price": "550000",
		"status": 1,
		"description": "تسویه فاکتور ۴۳۹۲",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:30:32.362Z",
		"updatedAt": "2020-05-17T03:30:32.362Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0afd82ce96a23f8b57794"
	},
	{
		"orderId": "0",
		"_id": "5ec0b0112ce96a23f8b57795",
		"name": "پیک",
		"price": "10000",
		"status": 1,
		"description": "پیک کار آقای مشیری",
		"transactionType": 3,
		"createdAt": "2020-05-17T03:31:29.465Z",
		"updatedAt": "2020-05-17T03:31:29.465Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b0112ce96a23f8b57795"
	},
	{
		"orderId": "0",
		"_id": "5ec0b03c2ce96a23f8b57796",
		"name": "پارچه نفیس",
		"price": "11000000",
		"status": 1,
		"description": "خرید پارچه پنبه ",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:32:12.445Z",
		"updatedAt": "2020-05-17T03:32:12.445Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b03c2ce96a23f8b57796"
	},
	{
		"orderId": "0",
		"_id": "5ec0b0652ce96a23f8b57797",
		"name": "شارژ اسنپ",
		"price": "100000",
		"status": 1,
		"description": "",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:32:53.316Z",
		"updatedAt": "2020-05-17T03:32:53.316Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b0652ce96a23f8b57797"
	},
	{
		"orderId": "0",
		"_id": "5ec0b08c2ce96a23f8b57798",
		"name": "پست ",
		"price": "26000",
		"status": 1,
		"description": "از تنخواه ",
		"transactionType": 3,
		"createdAt": "2020-05-17T03:33:32.081Z",
		"updatedAt": "2020-05-17T03:33:32.081Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b08c2ce96a23f8b57798"
	},
	{
		"orderId": "0",
		"_id": "5ec0b0a82ce96a23f8b57799",
		"name": "شارژ الو پیک",
		"price": "200000",
		"status": 1,
		"description": "",
		"transactionType": 3,
		"createdAt": "2020-05-17T03:34:00.845Z",
		"updatedAt": "2020-05-17T03:34:00.845Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b0a82ce96a23f8b57799"
	},
	{
		"orderId": "0",
		"_id": "5ec0b0cd2ce96a23f8b5779a",
		"name": "چسب ماتیکی",
		"price": "25000",
		"status": 1,
		"description": "ازتنخواه",
		"transactionType": 3,
		"createdAt": "2020-05-17T03:34:37.444Z",
		"updatedAt": "2020-05-17T03:34:37.444Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b0cd2ce96a23f8b5779a"
	},
	{
		"orderId": "0",
		"_id": "5ec0b0fb2ce96a23f8b5779b",
		"name": "پیک ",
		"price": "30000",
		"status": 1,
		"description": "",
		"transactionType": 3,
		"createdAt": "2020-05-17T03:35:23.189Z",
		"updatedAt": "2020-05-17T03:35:23.189Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b0fb2ce96a23f8b5779b"
	},
	{
		"orderId": "0",
		"_id": "5ec0b1202ce96a23f8b5779c",
		"name": "لوازم تحریر",
		"price": "107000",
		"status": 1,
		"description": "شوروم",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:36:00.880Z",
		"updatedAt": "2020-05-17T03:36:00.880Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b1202ce96a23f8b5779c"
	},
	{
		"orderId": "0",
		"_id": "5ec0b14e2ce96a23f8b5779d",
		"name": "پست",
		"price": "23253",
		"status": 1,
		"description": "",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:36:46.189Z",
		"updatedAt": "2020-05-17T03:36:46.189Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b14e2ce96a23f8b5779d"
	},
	{
		"orderId": "0",
		"_id": "5ec0b1872ce96a23f8b5779e",
		"name": "پارچه نفیس",
		"price": "14500000",
		"status": 1,
		"description": "پنبه پرزسوز ",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:37:43.019Z",
		"updatedAt": "2020-05-17T03:37:43.019Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b1872ce96a23f8b5779e"
	},
	{
		"orderId": "0",
		"_id": "5ec0b1ae2ce96a23f8b5779f",
		"name": "پارچه رهبر",
		"price": "6160000",
		"status": 1,
		"description": "",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:38:22.548Z",
		"updatedAt": "2020-05-17T03:38:22.548Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b1ae2ce96a23f8b5779f"
	},
	{
		"orderId": "0",
		"_id": "5ec0b1d72ce96a23f8b577a0",
		"name": "چاپ ",
		"price": "2000000",
		"status": 1,
		"description": "علی الحساب",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:39:03.295Z",
		"updatedAt": "2020-05-17T03:39:03.295Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b1d72ce96a23f8b577a0"
	},
	{
		"orderId": "0",
		"_id": "5ec0b2052ce96a23f8b577a1",
		"name": "ابزار (سانتی متر )",
		"price": "5000",
		"status": 1,
		"description": "",
		"transactionType": 3,
		"createdAt": "2020-05-17T03:39:49.553Z",
		"updatedAt": "2020-05-17T03:39:49.553Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b2052ce96a23f8b577a1"
	},
	{
		"orderId": "0",
		"_id": "5ec0b2322ce96a23f8b577a2",
		"name": "ابزار ",
		"price": "30000",
		"status": 1,
		"description": "۳عددخطکش فلزی",
		"transactionType": 3,
		"createdAt": "2020-05-17T03:40:34.893Z",
		"updatedAt": "2020-05-17T03:40:34.893Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b2322ce96a23f8b577a2"
	},
	{
		"orderId": "0",
		"_id": "5ec0b2662ce96a23f8b577a3",
		"name": "پست ",
		"price": "11300",
		"status": 1,
		"description": "مشهد",
		"transactionType": 3,
		"createdAt": "2020-05-17T03:41:26.620Z",
		"updatedAt": "2020-05-17T03:41:26.620Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b2662ce96a23f8b577a3"
	},
	{
		"orderId": "0",
		"_id": "5ec0b2882ce96a23f8b577a4",
		"name": "شارژ الوپیک",
		"price": "100000",
		"status": 1,
		"description": "",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:42:00.033Z",
		"updatedAt": "2020-05-17T03:42:00.033Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b2882ce96a23f8b577a4"
	},
	{
		"orderId": "0",
		"_id": "5ec0b2d12ce96a23f8b577a5",
		"name": "پارچه نفیس",
		"price": "2500000",
		"status": 1,
		"description": "پنبه",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:43:13.884Z",
		"updatedAt": "2020-05-17T03:43:13.884Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b2d12ce96a23f8b577a5"
	},
	{
		"orderId": "0",
		"_id": "5ec0b3372ce96a23f8b577a6",
		"name": "برداشت بابک",
		"price": "15000000",
		"status": 1,
		"description": "برداشت بابک از صندوق",
		"transactionType": 1,
		"createdAt": "2020-05-17T03:44:55.992Z",
		"updatedAt": "2020-05-17T03:44:55.992Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0b3372ce96a23f8b577a6"
	},
	{
		"orderId": "0",
		"_id": "5ec10b312ce96a23f8b577b9",
		"name": "لوازم بهداشتی ",
		"price": "370000",
		"status": 1,
		"description": "سطل و جاکفش و ....",
		"transactionType": 1,
		"createdAt": "2020-05-17T10:00:17.489Z",
		"updatedAt": "2020-05-17T10:00:17.489Z",
		"__v": 0,
		"picture": [],
		"id": "5ec10b312ce96a23f8b577b9"
	},
	{
		"orderId": "0",
		"_id": "5ec10b752ce96a23f8b577ba",
		"name": "دستکش",
		"price": "15000",
		"status": 1,
		"description": "",
		"transactionType": 3,
		"createdAt": "2020-05-17T10:01:25.301Z",
		"updatedAt": "2020-05-17T10:23:40.508Z",
		"__v": 0,
		"cutomeDate": "2020-05-13T10:23:34.000Z",
		"picture": [],
		"id": "5ec10b752ce96a23f8b577ba"
	},
	{
		"orderId": "5ec0d06f2ce96a23f8b577ac",
		"_id": "5ec1279f2ce96a23f8b577e0",
		"name": "کاستوم",
		"price": "1140000",
		"status": 2,
		"description": "خرید از طرف خانم  وهمنی",
		"transactionType": 1,
		"createdAt": "2020-05-17T12:01:35.486Z",
		"updatedAt": "2020-05-19T08:54:50.393Z",
		"__v": 0,
		"picture": [],
		"id": "5ec1279f2ce96a23f8b577e0"
	},
	{
		"orderId": "5ec252542ce96a23f8b57805",
		"_id": "5ec268b62ce96a23f8b57822",
		"name": "کاستوم",
		"price": "345000",
		"status": 2,
		"description": "خرید از طرف غزاله احمدی",
		"transactionType": 1,
		"createdAt": "2020-05-18T10:51:34.416Z",
		"updatedAt": "2020-05-19T08:53:26.082Z",
		"__v": 0,
		"picture": [],
		"id": "5ec268b62ce96a23f8b57822"
	},
	{
		"orderId": "5ec10d7a2ce96a23f8b577bb",
		"_id": "5ec268da2ce96a23f8b57823",
		"name": "حضوری",
		"price": "200000",
		"status": 2,
		"description": "خرید از طرف فرزاد مشیری",
		"transactionType": 1,
		"createdAt": "2020-05-18T10:52:10.875Z",
		"updatedAt": "2020-05-19T08:53:04.393Z",
		"__v": 0,
		"picture": [],
		"id": "5ec268da2ce96a23f8b57823"
	},
	{
		"orderId": "5ebba7212ce96a23f8b57708",
		"_id": "5ec37ab02ce96a23f8b5782a",
		"name": "کاستوم",
		"price": "1400000",
		"status": 2,
		"description": "خرید از طرف نرگس برغبانی",
		"transactionType": 1,
		"createdAt": "2020-05-19T06:20:32.075Z",
		"updatedAt": "2020-05-19T08:52:18.088Z",
		"__v": 0,
		"picture": [],
		"id": "5ec37ab02ce96a23f8b5782a"
	},
	{
		"orderId": "5ebb94e62ce96a23f8b576f3",
		"_id": "5ec37ae72ce96a23f8b5782b",
		"name": "کاستوم",
		"price": "345000",
		"status": 2,
		"description": "خرید از طرف زهرا ایمانی",
		"transactionType": 1,
		"createdAt": "2020-05-19T06:21:27.743Z",
		"updatedAt": "2020-05-19T08:52:00.282Z",
		"__v": 0,
		"picture": [],
		"id": "5ec37ae72ce96a23f8b5782b"
	},
	{
		"orderId": "5eb6ff8e2ce96a23f8b5709d",
		"_id": "5eb98cce2ce96a23f8b576a7",
		"name": "اینستاگرام",
		"price": "540000",
		"status": 2,
		"description": "خرید از طرف حامد پولادخای",
		"transactionType": 1,
		"createdAt": "2020-05-11T17:35:10.535Z",
		"updatedAt": "2020-05-19T08:36:55.014Z",
		"__v": 0,
		"picture": [],
		"id": "5eb98cce2ce96a23f8b576a7"
	},
	{
		"orderId": "5eb992842ce96a23f8b576b4",
		"_id": "5ec37b3f2ce96a23f8b5782d",
		"name": "اینستاگرام",
		"price": "150000",
		"status": 2,
		"description": "خرید از طرف سمانه زاچکانی",
		"transactionType": 1,
		"createdAt": "2020-05-19T06:22:55.468Z",
		"updatedAt": "2020-05-19T08:51:04.362Z",
		"__v": 0,
		"picture": [],
		"id": "5ec37b3f2ce96a23f8b5782d"
	},
	{
		"orderId": "5ebf803e2ce96a23f8b57731",
		"_id": "5ec3766e2ce96a23f8b57829",
		"name": "اینستاگرام",
		"price": "195000",
		"status": 2,
		"description": "خرید از طرف خانم زاهدی",
		"transactionType": 1,
		"createdAt": "2020-05-19T06:02:22.521Z",
		"updatedAt": "2020-05-19T08:52:41.846Z",
		"__v": 0,
		"picture": [],
		"id": "5ec3766e2ce96a23f8b57829"
	},
	{
		"orderId": "5ec25c1d2ce96a23f8b5780c",
		"_id": "5ec262e32ce96a23f8b5781c",
		"name": "اینستاگرام",
		"price": "340000",
		"status": 2,
		"description": "خرید از طرف سالی مرندی",
		"transactionType": 1,
		"createdAt": "2020-05-18T10:26:43.951Z",
		"updatedAt": "2020-05-19T08:53:42.162Z",
		"__v": 0,
		"picture": [],
		"id": "5ec262e32ce96a23f8b5781c"
	},
	{
		"orderId": "5ebb881f2ce96a23f8b576e5",
		"_id": "5ec128282ce96a23f8b577e2",
		"name": "اینستاگرام",
		"price": "160000",
		"status": 2,
		"description": "خرید از طرف شهرزاد غلام میرزایی ",
		"transactionType": 1,
		"createdAt": "2020-05-17T12:03:52.260Z",
		"updatedAt": "2020-05-19T08:53:56.803Z",
		"__v": 0,
		"picture": [],
		"id": "5ec128282ce96a23f8b577e2"
	},
	{
		"orderId": "5ebfe5662ce96a23f8b57773",
		"_id": "5ec127ba2ce96a23f8b577e1",
		"name": "اینستاگرام",
		"price": "330000",
		"status": 2,
		"description": "خرید از طرف اشکان سهل آبادی",
		"transactionType": 1,
		"createdAt": "2020-05-17T12:02:02.543Z",
		"updatedAt": "2020-05-19T08:54:21.788Z",
		"__v": 0,
		"picture": [],
		"id": "5ec127ba2ce96a23f8b577e1"
	},
	{
		"orderId": "5ec1030c2ce96a23f8b577af",
		"_id": "5ec127872ce96a23f8b577df",
		"name": "اینستاگرام",
		"price": "420000",
		"status": 2,
		"description": "خرید از طرف آرشام زارع",
		"transactionType": 1,
		"createdAt": "2020-05-17T12:01:11.657Z",
		"updatedAt": "2020-05-19T08:55:13.810Z",
		"__v": 0,
		"picture": [],
		"id": "5ec127872ce96a23f8b577df"
	},
	{
		"orderId": "5ebd5d002ce96a23f8b57725",
		"_id": "5ec0a8332ce96a23f8b57783",
		"name": "اینستاگرام",
		"price": "180000",
		"status": 2,
		"description": "خرید از طرف سجاد دائمی مقدم",
		"transactionType": 1,
		"createdAt": "2020-05-17T02:57:55.551Z",
		"updatedAt": "2020-05-19T08:56:20.633Z",
		"__v": 0,
		"picture": [],
		"id": "5ec0a8332ce96a23f8b57783"
	},
	{
		"orderId": "5ebfe9002ce96a23f8b57777",
		"_id": "5ec034492ce96a23f8b5777a",
		"name": "اینستاگرام",
		"price": "150000",
		"status": 2,
		"description": "خرید از طرف لیلی وکیل زاده",
		"transactionType": 1,
		"createdAt": "2020-05-16T18:43:21.569Z",
		"updatedAt": "2020-05-19T08:57:28.707Z",
		"__v": 0,
		"picture": [],
		"id": "5ec034492ce96a23f8b5777a"
	},
	{
		"orderId": "5ebf7d2a2ce96a23f8b5772b",
		"_id": "5ebfe8842ce96a23f8b57776",
		"name": "اینستاگرام",
		"price": "220000",
		"status": 2,
		"description": "خرید از طرف مونا کریمی",
		"transactionType": 1,
		"createdAt": "2020-05-16T13:20:04.916Z",
		"updatedAt": "2020-05-19T08:57:45.157Z",
		"__v": 0,
		"picture": [],
		"id": "5ebfe8842ce96a23f8b57776"
	},
	{
		"orderId": "5ebb8c852ce96a23f8b576ea",
		"_id": "5ebd0d1e2ce96a23f8b57711",
		"name": "اینستاگرام",
		"price": "150000",
		"status": 2,
		"description": "خرید از طرف وحید عامری",
		"transactionType": 1,
		"createdAt": "2020-05-14T09:19:26.117Z",
		"updatedAt": "2020-05-19T08:58:19.320Z",
		"__v": 0,
		"picture": [],
		"id": "5ebd0d1e2ce96a23f8b57711"
	},
	{
		"orderId": "5ebaf3562ce96a23f8b576db",
		"_id": "5ebb99842ce96a23f8b57700",
		"name": "اینستاگرام",
		"price": "165000",
		"status": 2,
		"description": "خرید از طرف آقای دهقانی",
		"transactionType": 1,
		"createdAt": "2020-05-13T06:53:56.936Z",
		"updatedAt": "2020-05-19T08:59:05.046Z",
		"__v": 0,
		"picture": [],
		"id": "5ebb99842ce96a23f8b57700"
	},
	{
		"orderId": "5ebb874b2ce96a23f8b576e2",
		"_id": "5ebb8dc32ce96a23f8b576ee",
		"name": "اینستاگرام",
		"price": "150000",
		"status": 2,
		"description": "خرید از طرف امید معروفی ",
		"transactionType": 1,
		"createdAt": "2020-05-13T06:03:47.411Z",
		"updatedAt": "2020-05-19T08:59:49.986Z",
		"__v": 0,
		"picture": [],
		"id": "5ebb8dc32ce96a23f8b576ee"
	},
	{
		"orderId": "5eb986212ce96a23f8b5769a",
		"_id": "5eb9892e2ce96a23f8b5769f",
		"name": "اینستاگرام",
		"price": "350000",
		"status": 2,
		"description": "خرید از طرف محمد قاسمی",
		"transactionType": 1,
		"createdAt": "2020-05-11T17:19:42.964Z",
		"updatedAt": "2020-05-19T09:01:49.140Z",
		"__v": 0,
		"picture": [],
		"id": "5eb9892e2ce96a23f8b5769f"
	},
	{
		"orderId": "0",
		"_id": "5ec3da612ce96a23f8b57837",
		"name": "اینستاگرام",
		"price": "500000",
		"status": 2,
		"description": "خرید از طرف امیرعلی درافشان",
		"transactionType": 1,
		"createdAt": "2020-05-19T13:08:49.210Z",
		"updatedAt": "2020-05-19T13:49:48.403Z",
		"__v": 0,
		"cutomeDate": "2020-05-09T13:49:43.000Z",
		"picture": [],
		"id": "5ec3da612ce96a23f8b57837"
	},
	{
		"orderId": "0",
		"_id": "5ec406638c48071b8cf1931c",
		"name": "",
		"price": "345000",
		"status": 2,
		"description": "خرید از طرف بابک نیکخواه بهرامی",
		"transactionType": 1,
		"createdAt": "2020-05-19T16:16:36.074Z",
		"updatedAt": "2020-05-19T16:16:36.074Z",
		"__v": 0,
		"picture": [],
		"id": "5ec406638c48071b8cf1931c"
	},
	{
		"orderId": "0",
		"_id": "5ec5748c8c48071b8cf1931d",
		"name": "پارچه غواصی رهبر",
		"price": "1218440",
		"status": 1,
		"description": "غواصی مشکی",
		"transactionType": 1,
		"createdAt": "2020-05-20T18:18:52.625Z",
		"updatedAt": "2020-05-20T18:18:52.625Z",
		"__v": 0,
		"picture": [],
		"id": "5ec5748c8c48071b8cf1931d"
	},
	{
		"orderId": "0",
		"_id": "5ec575e88c48071b8cf19322",
		"name": "",
		"price": "345000",
		"status": 2,
		"description": "خرید از طرف بابک نیکخواه بهرامی",
		"transactionType": 1,
		"createdAt": "2020-05-20T18:24:40.540Z",
		"updatedAt": "2020-05-20T18:24:40.540Z",
		"__v": 0,
		"picture": [],
		"id": "5ec575e88c48071b8cf19322"
	},
	{
		"orderId": "0",
		"_id": "5ec57c168c48071b8cf19323",
		"name": "اینستاگرام",
		"price": "770000",
		"status": 2,
		"description": "خرید از طرف محسن تاجیکی",
		"transactionType": 1,
		"createdAt": "2020-05-20T18:51:02.753Z",
		"updatedAt": "2020-05-20T18:51:02.753Z",
		"__v": 0,
		"picture": [],
		"id": "5ec57c168c48071b8cf19323"
	},
	{
		"orderId": "0",
		"_id": "5ec57c308c48071b8cf19324",
		"name": "حضوری",
		"price": "680000",
		"status": 2,
		"description": "خرید از طرف فائزه  رخ فیروز",
		"transactionType": 1,
		"createdAt": "2020-05-20T18:51:28.238Z",
		"updatedAt": "2020-05-20T18:51:28.238Z",
		"__v": 0,
		"picture": [],
		"id": "5ec57c308c48071b8cf19324"
	},
	{
		"orderId": "0",
		"_id": "5ec57c528c48071b8cf19325",
		"name": "حضوری",
		"price": "1000000",
		"status": 2,
		"description": "خرید از طرف پرهام رضاسلطانی",
		"transactionType": 1,
		"createdAt": "2020-05-20T18:52:02.517Z",
		"updatedAt": "2020-05-20T18:52:02.517Z",
		"__v": 0,
		"picture": [],
		"id": "5ec57c528c48071b8cf19325"
	},
	{
		"orderId": "0",
		"_id": "5ec57cec8c48071b8cf19328",
		"name": "کاستوم",
		"price": "1740000",
		"status": 2,
		"description": "خرید از طرف مهدی رفیعی",
		"transactionType": 1,
		"createdAt": "2020-05-20T18:54:36.108Z",
		"updatedAt": "2020-05-20T18:54:36.108Z",
		"__v": 0,
		"picture": [],
		"id": "5ec57cec8c48071b8cf19328"
	},
	{
		"orderId": "0",
		"_id": "5ec583328c48071b8cf19334",
		"name": "اینستاگرام",
		"price": "210000",
		"status": 2,
		"description": "خرید از طرف آقای شنبه زاده",
		"transactionType": 1,
		"createdAt": "2020-05-20T19:21:22.081Z",
		"updatedAt": "2020-05-20T19:21:22.081Z",
		"__v": 0,
		"picture": [],
		"id": "5ec583328c48071b8cf19334"
	},
	{
		"orderId": "0",
		"_id": "5ec5f8078c48071b8cf19342",
		"name": "کاستوم",
		"price": "180000",
		"status": 2,
		"description": "خرید از طرف نگار نیکخواه",
		"transactionType": 1,
		"createdAt": "2020-05-21T03:39:51.140Z",
		"updatedAt": "2020-05-21T03:39:51.140Z",
		"__v": 0,
		"picture": [],
		"id": "5ec5f8078c48071b8cf19342"
	},
	{
		"orderId": "0",
		"_id": "5ec5f8658c48071b8cf19343",
		"name": "اینستاگرام",
		"price": "180000",
		"status": 2,
		"description": "خرید از طرف مجید رحیمیان",
		"transactionType": 1,
		"createdAt": "2020-05-21T03:41:25.958Z",
		"updatedAt": "2020-05-21T03:41:25.958Z",
		"__v": 0,
		"picture": [],
		"id": "5ec5f8658c48071b8cf19343"
	},
	{
		"orderId": "0",
		"_id": "5ec5f8db8c48071b8cf19344",
		"name": "اینستاگرام",
		"price": "345000",
		"status": 2,
		"description": "خرید از طرف ناصر عباس زاده بندری ",
		"transactionType": 1,
		"createdAt": "2020-05-21T03:43:23.450Z",
		"updatedAt": "2020-05-21T03:43:23.450Z",
		"__v": 0,
		"picture": [],
		"id": "5ec5f8db8c48071b8cf19344"
	},
	{
		"orderId": "0",
		"_id": "5ec5f9388c48071b8cf19346",
		"name": "کاستوم",
		"price": "850000",
		"status": 2,
		"description": "خرید از طرف بهمن نصیحی",
		"transactionType": 1,
		"createdAt": "2020-05-21T03:44:56.891Z",
		"updatedAt": "2020-05-21T03:44:56.891Z",
		"__v": 0,
		"picture": [],
		"id": "5ec5f9388c48071b8cf19346"
	},
	{
		"orderId": "0",
		"_id": "5ec5f94b8c48071b8cf19347",
		"name": "کاستوم",
		"price": "345000",
		"status": 2,
		"description": "خرید از طرف زهرا ایمانی",
		"transactionType": 1,
		"createdAt": "2020-05-21T03:45:15.729Z",
		"updatedAt": "2020-05-21T03:45:15.729Z",
		"__v": 0,
		"picture": [],
		"id": "5ec5f94b8c48071b8cf19347"
	},
	{
		"orderId": "0",
		"_id": "5ec5f9588c48071b8cf19348",
		"name": "کاستوم",
		"price": "150000",
		"status": 2,
		"description": "خرید از طرف درسا فاخری",
		"transactionType": 1,
		"createdAt": "2020-05-21T03:45:28.500Z",
		"updatedAt": "2020-05-21T03:45:28.500Z",
		"__v": 0,
		"picture": [],
		"id": "5ec5f9588c48071b8cf19348"
	},
	{
		"orderId": "0",
		"_id": "5ec7c5848c48071b8cf1934b",
		"name": "حضوری",
		"price": "1000000",
		"status": 2,
		"description": "خرید از طرف پرهام رضاسلطانی",
		"transactionType": 1,
		"createdAt": "2020-05-22T12:28:52.778Z",
		"updatedAt": "2020-05-22T12:28:52.778Z",
		"__v": 0,
		"picture": [],
		"id": "5ec7c5848c48071b8cf1934b"
	},
	{
		"orderId": "0",
		"_id": "5ec7c59b8c48071b8cf1934c",
		"name": "حضوری",
		"price": "680000",
		"status": 2,
		"description": "خرید از طرف فائزه  رخ فیروز",
		"transactionType": 1,
		"createdAt": "2020-05-22T12:29:15.584Z",
		"updatedAt": "2020-05-22T12:29:15.584Z",
		"__v": 0,
		"picture": [],
		"id": "5ec7c59b8c48071b8cf1934c"
	},
	{
		"orderId": "0",
		"_id": "5ec7c5cd8c48071b8cf1934d",
		"name": "اینستاگرام",
		"price": "315000",
		"status": 2,
		"description": "خرید از طرف محمدحسین درگاهی",
		"transactionType": 1,
		"createdAt": "2020-05-22T12:30:05.358Z",
		"updatedAt": "2020-05-22T12:30:05.358Z",
		"__v": 0,
		"picture": [],
		"id": "5ec7c5cd8c48071b8cf1934d"
	},
	{
		"orderId": "0",
		"_id": "5ec7c5ec8c48071b8cf1934e",
		"name": "اینستاگرام",
		"price": "315000",
		"status": 2,
		"description": "خرید از طرف محمد قاسمی",
		"transactionType": 1,
		"createdAt": "2020-05-22T12:30:36.112Z",
		"updatedAt": "2020-05-22T12:30:36.112Z",
		"__v": 0,
		"picture": [],
		"id": "5ec7c5ec8c48071b8cf1934e"
	},
	{
		"orderId": "0",
		"_id": "5ec7c67e8c48071b8cf19350",
		"name": "واریز حقوق بهروز رحیمی درینو",
		"price": "580000",
		"status": 3,
		"description": "",
		"createdAt": "2020-05-22T12:33:02.956Z",
		"updatedAt": "2020-05-22T12:33:02.956Z",
		"__v": 0,
		"picture": [],
		"id": "5ec7c67e8c48071b8cf19350"
	},
	{
		"orderId": "0",
		"_id": "5ec7c69e8c48071b8cf19352",
		"name": "واریز حقوق حدیث رحمتی",
		"price": "200000",
		"status": 3,
		"description": "",
		"createdAt": "2020-05-22T12:33:34.435Z",
		"updatedAt": "2020-05-22T12:33:34.435Z",
		"__v": 0,
		"picture": [],
		"id": "5ec7c69e8c48071b8cf19352"
	},
	{
		"orderId": "0",
		"_id": "5ec7c6be8c48071b8cf19354",
		"name": "واریز حقوق سمیه مهدوی",
		"price": "588000",
		"status": 3,
		"description": "",
		"createdAt": "2020-05-22T12:34:06.085Z",
		"updatedAt": "2020-05-22T12:34:06.085Z",
		"__v": 0,
		"picture": [],
		"id": "5ec7c6be8c48071b8cf19354"
	},
	{
		"orderId": "0",
		"_id": "5ec7c6dd8c48071b8cf19356",
		"name": "واریز حقوق مریم ظهوری خامنه",
		"price": "315000",
		"status": 3,
		"description": "",
		"createdAt": "2020-05-22T12:34:37.455Z",
		"updatedAt": "2020-05-22T12:34:37.455Z",
		"__v": 0,
		"picture": [],
		"id": "5ec7c6dd8c48071b8cf19356"
	},
	{
		"orderId": "0",
		"_id": "5ec7c7068c48071b8cf19358",
		"name": "واریز حقوق ملیحه فیض",
		"price": "5800000",
		"status": 3,
		"description": "",
		"createdAt": "2020-05-22T12:35:18.072Z",
		"updatedAt": "2020-05-22T12:35:18.072Z",
		"__v": 0,
		"picture": [],
		"id": "5ec7c7068c48071b8cf19358"
	},
	{
		"orderId": "0",
		"_id": "5ec7c7398c48071b8cf1935a",
		"name": "واریز حقوق میلاد",
		"price": "2000000",
		"status": 3,
		"description": "",
		"createdAt": "2020-05-22T12:36:09.483Z",
		"updatedAt": "2020-05-22T12:36:09.483Z",
		"__v": 0,
		"picture": [],
		"id": "5ec7c7398c48071b8cf1935a"
	}
];


const counts = _.countBy(array, 'description')
console.log(_.filter(array, x => counts[x.description] > 1 && x.status === 2 && x.description !== ""))

export default App;
