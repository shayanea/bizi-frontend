import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { withBaseIcon } from "react-icons-kit";
import { iosContact } from "react-icons-kit/ionicons/iosContact";
import { logOut } from "react-icons-kit/ionicons/logOut";
import { Sweetalert } from "zent";
import LogRocket from "logrocket";

import { history } from "../../utils/history";
import { fetchProfile } from "../../services/userService";

const Icon = withBaseIcon({ size: 18, style: { color: "#fff" } });

const Navbar = () => {
  const [result, setResutl] = useState(null);

  const fetchProfileApi = () => {
    return fetchProfile()
      .then((res) => {
        setResutl(res.data);
        LogRocket.identify("ptczo3/bizi-dashboard", {
          name: res.data.fullName,
          email: res.data.email,

          // Add your own custom user variables here, ie:
          subscriptionType: "admin",
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

  return (
    <Container id="navbar">
      <span className="name">
        <Icon icon={iosContact}></Icon>
        {result && renderName()}
      </span>
      <div className="logout-btn" onClick={logOutAction}>
        <span>خروج</span>
        <Icon icon={logOut} />
      </div>
    </Container>
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
  .name {
    color: #fff;
    font-size: 13px;
    i {
      vertical-align: bottom;
      margin-left: 5px;
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
