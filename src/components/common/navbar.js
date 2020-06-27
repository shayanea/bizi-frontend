import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { withBaseIcon } from "react-icons-kit";
import { iosContact } from "react-icons-kit/ionicons/iosContact";
import { logOut } from "react-icons-kit/ionicons/logOut";
import { menu } from 'react-icons-kit/feather/menu'
import OutsideClickHandler from 'react-outside-click-handler';
import { Sweetalert } from "zent";
// import LogRocket from "logrocket";

import { history } from "../../utils/history";
import { useStateValue } from "../../context/state";
import { fetchProfile } from "../../services/userService";

const Icon = withBaseIcon({ size: 18, style: { color: "#fff" } });

const Navbar = () => {
	const [result, setResult] = useState(null);
	// eslint-disable-next-line no-unused-vars
	const [{ profile }, dispatch] = useStateValue();

	const windowWidth = window.innerWidth;

	const fetchProfileApi = () => {
		return fetchProfile()
			.then((res) => {
				setResult(res.data);
				dispatch({
					type: "updateProfile",
					profile: res.data,
				});
			})
			.catch((err) => console.log(err.response));
	};

	useEffect(() => {
		fetchProfileApi();
	}, []);

	const renderName = () => {
		if (result.fullName) {
			return result.fullName;
		}

		if (result.email) {
			return result.email;
		}

		if (result.username) {
			return result.username;
		}
	};

	const logOutAction = () => {
		Sweetalert.confirm({
			confirmType: "success",
			confirmText: "بله",
			cancelText: "خیر",
			content: "آیا مطمئن به خارج شدن از پنل خود هستید ؟",
			title: "توجه",
			className: "custom-sweetalert",
			maskClosable: true,
			parentComponent: this,
			onConfirm: () => {
				localStorage.removeItem("@token");
				history.push("/login");
			},
		});
	};

	const toggleMenu = () => {
		let status = document.getElementById("menu").classList;
		if (status.contains("is-active")) {
			document.getElementById("menu").classList.remove("is-active");
			return document.getElementById("navbar").classList.remove("is-active");
		}
		document.getElementById("menu").classList.add("is-active");
		return document.getElementById("navbar").classList.add("is-active");
	}

	const closeMenu = () => {
		document.getElementById("menu").classList.remove("is-active");
		return document.getElementById("navbar").classList.remove("is-active");
	}

	return (
		<OutsideClickHandler
			onOutsideClick={closeMenu}
		>
			<Container id="navbar">
				<span className="name">
					<div className="menu-btn" onClick={toggleMenu}>
						{windowWidth <= 1024 && <Icon icon={menu}></Icon>}
					</div>
					<Icon icon={iosContact}></Icon>
					{result && renderName()}
				</span>
				<div className="logout-btn" onClick={logOutAction}>
					<span>خروج</span>
					<Icon icon={logOut} />
				</div>
			</Container>
		</OutsideClickHandler>
	);
};

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #202124;
  padding: 0 25px 0 0;
  height: 55px;
  margin-right: 250px;
	border-bottom: 1px solid #1c2933;
	transition: margin-right 280ms ease;
	&.is-active {
		margin-right: 250px;
		transition: margin-right 280ms ease;
	}
  @media (max-width: 1024px) {
    margin-right: 0;
	}
  .name {
    color: #fff;
		font-size: 13px;
		display: inline-flex;
		align-items: center;
		justify-content: flex-start;
		flex-direction: row;
    i {
      vertical-align: bottom;
      margin-left: 5px;
		}
		.menu-btn {
			margin-left: 20px;
		}
  }
  .logout-btn {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 80px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
    :hover {
      background-color: #2c3a46;
      transition: background-color 0.3s ease;
    }
    span {
      margin-left: 5px;
      font-size: 13px;
    }
  }
`;

export default Navbar;
