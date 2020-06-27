/* eslint-disable react-hooks/exhaustive-deps */
// import * as _ from "lodash";
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
import InvoiceOrder from "./pages/orders/invoice";
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
// Banner
import Banners from './pages/banners/banners'
import AddBanner from './pages/banners/add'
import EditBanner from './pages/banners/edit'

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
					<Route exact path="/invoice/:id" component={InvoiceOrder} />
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
					{/* Banners */}
					<PrivateRoute exact path="/banners" component={Banners} />
					<PrivateRoute exact path="/banner/add" component={AddBanner} />
					<PrivateRoute exact path="/banner/:id" component={EditBanner} />
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
    margin: 25px;
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
	transition: opacity 280ms ease, visibility 280ms ease, transform 280ms ease;
	overflow: auto;
  @media (max-width: 1024px) {
		opacity: 0;
		visibility: hidden;
		transform: translate(100%, 0);
	}
	@media(max-width: 550px) {
		width: 100%;
	}
	&.is-active {
		opacity: 1;
		visibility: visible;
		transform: translate(0, 0);
		transition: opacity 280ms ease, visibility 280ms ease, transform 280ms ease;
	}
`;

export default App;
