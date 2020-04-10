import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Grid, Portal } from "zent";
import { withBaseIcon } from "react-icons-kit";
import { iosInformationOutline } from "react-icons-kit/ionicons/iosInformationOutline";

import { fetchDashboardData } from "../services/dashboardService";

const Icon = withBaseIcon({ size: 20, style: { color: "#555" } });

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    ordersTotal: 0,
    productsTotal: 0,
    customerTotal: 0,
    orders: []
  });
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    fetchDashboardData().then(res => {
      setDashboardData({
        ordersTotal: res[0].data,
        productsTotal: res[1].data,
        customerTotal: res[3].data,
        orders: res[2].data
      });
    });
  }, []);

  const renderStatus = status => {
    switch (Number(status)) {
      case 1:
        return "ثبت شده";
      case 2:
        return "پرداخت شده";
      case 3:
        return "در حال ارسال";
      case 4:
        return "تحویل داده شده";
      case 5:
        return "لغو";
      default:
        return "";
    }
  };

  const renderCourier = id => {
    switch (Number(id)) {
      case 1:
        return "بابک";
      case 2:
        return "شایان";
      default:
        return "";
    }
  };

  const renderSize = item => {
    switch (Number(item)) {
      case 1:
        return "XS";
      case 2:
        return "S";
      case 3:
        return "M";
      case 4:
        return "L";
      case 5:
        return "XL";
      case 6:
        return "XXL";
      default:
        return "";
    }
  };

  const orders = [
    {
      title: "نام محصول",
      name: "name",
      bodyRender: data => {
        return `${data.name} (${data.size.map(
          item => ` ${renderSize(item)} `
        )} - ${data.color})`;
      }
    },
    {
      title: "قیمت (تومان)",
      bodyRender: data => {
        return Number(data.price).toLocaleString("fa");
      }
    },
    {
      title: "موجودی",
      name: "count"
    },
    {
      title: "تعداد",
      bodyRender: data => {
        return data.orderCount;
      }
    },
    {
      title: "قیمت کل (تومان)",
      bodyRender: data => {
        return (Number(data.price) * Number(data.orderCount)).toLocaleString(
          "fa"
        );
      }
    },
    {
      title: ""
    }
  ];

  const columns = [
    {
      title: "نام و نام خانوادگی",
      bodyRender: data => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setOrderItems(data.orderItems)}
          >
            <Icon style={{ marginLeft: 5 }} icon={iosInformationOutline} />
            {data.fullName}
          </div>
        );
      }
    },
    {
      title: "شماره تماس",
      name: "mobileNumber"
    },
    {
      title: "آدرس",
      bodyRender: data => {
        return <div className="long-content">{data.address}</div>;
      }
    },
    {
      title: "وضعیت",
      bodyRender: data => {
        return renderStatus(data.status);
      }
    },
    {
      title: "فرستنده",
      bodyRender: data => {
        return renderCourier(data.courier);
      }
    },
    {
      title: ""
    }
  ];

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
      <h2>لیست آخرین سفارشات</h2>
      <Grid
        columns={columns}
        datasets={dashboardData.orders}
        emptyLabel={"هیچ سفارشی یافت نشده است."}
      />
      <Portal
        visible={orderItems.length > 0 ? true : false}
        onClose={() => setOrderItems([])}
        className="layer"
        style={{ background: "rgba(0, 0, 0, 0.4)" }}
        useLayerForClickAway
        closeOnClickOutside
        closeOnESC
        blockPageScroll
      >
        <div className="custom-portal__container">
          <Grid
            columns={orders}
            datasets={orderItems}
            emptyLabel={"هیچ سفارشی یافت نشده است."}
          />
        </div>
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
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  .col-items {
    flex: 1;
    padding: 15px;
    min-height: 100px;
    border-radius: 10px;
    background-color: #fff;
    text-align: right;
    margin-left: 15px;
    :last-child {
      margin-left: 0;
    }
    h3 {
      font-size: 1.5em;
      font-weight: bold;
      margin-bottom: 15px;
      color: #333;
    }
    span {
      font-size: 2em;
      color: #000;
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
