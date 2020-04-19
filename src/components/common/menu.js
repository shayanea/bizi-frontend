import React, { Fragment } from "react";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";
import { withBaseIcon } from "react-icons-kit";
import { iosListOutline } from "react-icons-kit/ionicons/iosListOutline";
import { grid } from "react-icons-kit/feather/grid";
import { shoppingBag } from "react-icons-kit/feather/shoppingBag";
import { users } from "react-icons-kit/feather/users";
import { user } from "react-icons-kit/feather/user";
import { box } from "react-icons-kit/feather/box";
import { creditCard } from "react-icons-kit/feather/creditCard";
import { clipboard } from "react-icons-kit/feather/clipboard";

const Icon = withBaseIcon({ size: 25, style: { color: "#d4d4d4" } });

const Menu = ({ location }) => {
  return (
    <Container>
      <MenuContainer>
        <Title>پنل پشتیبانی</Title>
        <li>
          <Link className={location.pathname === "/" ? "active" : ""} to="/">
            <Icon icon={grid} />
            دشبورد
          </Link>
        </li>
        <li>
          <Link to="/customers">
            <Icon icon={users} />
            مشتری‌ها
          </Link>
        </li>
        <li>
          <Link
            className={location.pathname === "/orders" ? "active" : ""}
            to="/orders"
          >
            <Icon icon={shoppingBag} />
            سفارشات
          </Link>
        </li>
        <li>
          <Link
            className={location.pathname === "/products" ? "active" : ""}
            to="/products"
          >
            <Icon icon={iosListOutline} />
            محصولات
          </Link>
        </li>
        <li>
          <Link
            className={location.pathname === "/users" ? "active" : ""}
            to="/users"
          >
            <Icon icon={user} />
            کاربران
          </Link>
        </li>
        <li>
          <Link
            className={location.pathname === "/warehouse-log" ? "active" : ""}
            to="/warehouse-log"
          >
            <Icon icon={box} />
            آمار انبار
          </Link>
        </li>
        <li>
          <Link
            className={location.pathname === "/transactions" ? "active" : ""}
            to="/transactions"
          >
            <Icon icon={creditCard} />
            تراکنش‌های مالی
          </Link>
        </li>
        <li>
          <Link
            className={location.pathname === "/salaries" ? "active" : ""}
            to="/salaries"
          >
            <Icon icon={clipboard} />
            لیست حقوق‌ها
          </Link>
        </li>
      </MenuContainer>
    </Container>
  );
};

const Title = styled.h1`
  color: #fff;
  font-size: 1.4em;
  height: 55px;
  line-height: 55px;
  padding: 0 25px;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  text-align: right;
`;

const Container = styled.div`
  display: block;
  padding: 15px;
`;

const MenuContainer = styled.ul`
  list-style: none;
  margin: 50px 0;
  padding: 0 15px;
  li {
    display: block;
    margin-bottom: 25px;
    a {
      display: block;
      color: #d4d4d4;
      font-size: 16px;
      padding: 10px;
      border-radius: 8px;
      background-color: transparent;
      box-shadow: 0 5px 10px 2px rgba(0, 176, 117, 0);
      transition: background-color 0.3s ease, color 0.3s ease,
        box-shadow 0.3s ease;
      :hover {
        background-color: #00b075;
        color: #fff;
        box-shadow: 0 5px 10px 2px rgba(0, 176, 117, 0.4);
        transition: background-color 0.3s ease, color 0.3s ease,
          box-shadow 0.3s ease;
      }
      i {
        margin-left: 15px;
      }
    }
    a.active {
      background-color: #00b075;
      color: #fff;
      box-shadow: 0 5px 10px 2px rgba(0, 176, 117, 0.4);
      transition: background-color 0.3s ease, color 0.3s ease,
        box-shadow 0.3s ease;
    }
  }
`;
export default withRouter(Menu);
