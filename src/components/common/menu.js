import React from "react";
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

import { useStateValue } from "../../context/state";

const Icon = withBaseIcon({ size: 25, style: { color: "#d4d4d4" } });

const Menu = ({ location }) => {
  const [{ profile }] = useStateValue();
  const items = [
    {
      id: 0,
      name: "دشبورد",
      route: "/",
      icon: <Icon icon={grid} />,
      privacy: ["authenticated"],
    },
    {
      id: 1,
      name: "مشتری‌ها",
      route: "/customers",
      icon: <Icon icon={users} />,
      privacy: ["authenticated", "manager"],
    },
    {
      id: 2,
      name: "سفارشات",
      route: "/orders",
      icon: <Icon icon={shoppingBag} />,
      privacy: ["authenticated", "manager"],
    },
    {
      id: 3,
      name: "محصولات",
      route: "/products",
      icon: <Icon icon={iosListOutline} />,
      privacy: ["authenticated", "manager", "staff"],
    },
    {
      id: 4,
      name: "کاربران",
      route: "/users",
      icon: <Icon icon={user} />,
      privacy: ["authenticated", "manager"],
    },
    {
      id: 5,
      name: "آمار انبار",
      route: "/warehouse-log",
      icon: <Icon icon={box} />,
      privacy: ["authenticated", "manager"],
    },
    {
      id: 6,
      name: "تراکنش‌های مالی",
      route: "/transactions",
      icon: <Icon icon={creditCard} />,
      privacy: ["authenticated", "manager"],
    },
    {
      id: 7,
      name: "لیست حقوق‌ها",
      route: "/salaries",
      icon: <Icon icon={clipboard} />,
      privacy: ["authenticated"],
    },
  ];

  return (
    <Container>
      <MenuContainer>
        <Title>پنل پشتیبانی</Title>
        {profile && (
          <div className="menu-router">
            {items.map((item, index) => {
              let result = item.privacy.find((el) => el === profile.role.type);
              if (result) {
                return (
                  <li
                    className="animated bounceIn"
                    style={{ animationDelay: `0.${index}s` }}
                    key={item.id}
                  >
                    <Link
                      className={
                        location.pathname === `${item.route}` ? "active" : ""
                      }
                      to={`${item.route}`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </li>
                );
              }
              return null;
            })}
          </div>
        )}
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
  .menu-router {
    display: block;
    height: 100%;
  }
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
