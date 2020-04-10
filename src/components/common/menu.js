import React, { Fragment } from "react";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";
import { withBaseIcon } from "react-icons-kit";
import { iosListOutline } from "react-icons-kit/ionicons/iosListOutline";
import { iosSpeedometer } from "react-icons-kit/ionicons/iosSpeedometer";
import { iosCart } from "react-icons-kit/ionicons/iosCart";
import { iosPeople } from "react-icons-kit/ionicons/iosPeople";

const Icon = withBaseIcon({ size: 25, style: { color: "#d4d4d4" } });

const Menu = ({ location }) => {
  return (
    <Fragment>
      <Title>پنل پشتیبانی</Title>
      <Container>
        <li>
          <Link className={location.pathname === "/" ? "active" : ""} to="/">
            <Icon icon={iosSpeedometer} />
            دشبورد
          </Link>
        </li>
        <li>
          <Link to="/customers">
            <Icon icon={iosPeople} />
            مشتری‌ها
          </Link>
        </li>
        <li>
          <Link
            className={location.pathname === "/orders" ? "active" : ""}
            to="/orders"
          >
            <Icon icon={iosCart} />
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
          <Link to="/users">
            <Icon icon={iosPeople} />
            کاربران
          </Link>
        </li>
      </Container>
    </Fragment>
  );
};

const Title = styled.h1`
  color: #fff;
  font-size: 1.4em;
  height: 55px;
  line-height: 55px;
  padding: 0 25px;
`;

const Container = styled.ul`
  list-style: none;
  margin: 50px 0;
  padding: 0;
  li {
    display: block;
    a {
      display: block;
      color: #d4d4d4;
      font-size: 16px;
      border-bottom: 1px solid #1c2933;
      padding: 15px 25px;
      background-color: transparent;
      transition: background-color 0.3s ease;
      :hover {
        background-color: #2c3a46;
        transition: background-color 0.3s ease;
      }
      i {
        margin-left: 15px;
      }
    }
    a.active {
      background-color: #2c3a46;
      transition: background-color 0.3s ease;
    }
  }
`;

export default withRouter(Menu);
