import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Grid, Portal, BlockHeader } from "zent";
import { withBaseIcon } from "react-icons-kit";
import { iosInformationOutline } from "react-icons-kit/ionicons/iosInformationOutline";
import moment from "jalali-moment";

import { fetchDashboardData } from "../services/dashboardService";
import { renderSize } from "../utils/services";

const Icon = withBaseIcon({ size: 20, style: { color: "#555" } });

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    ordersTotal: 0,
    productsTotal: 0,
    customerTotal: 0,
    totalOutcome: 0,
    totalIncome: 0,
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
          mostDuplicateItems: res[5].data,
          // bestCustomers: res[6].data,
          totalIncome: res[7].data.total,
          totalOutcome: res[8].data.total,
          isLoading: false,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const renderStatus = (status) => {
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
        return `${data.name}  ${renderSize(data.size)} - ${data.color})`;
      },
    },
    {
      title: "قیمت",
      bodyRender: (data) => {
        return `${Number(data.price).toLocaleString("fa")} تومان`;
      },
    },
    {
      title: "موجودی",
      name: "count",
    },
    {
      title: "تعداد",
      bodyRender: (data) => {
        return data.orderCount;
      },
    },
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

  const columns3 = [
    {
      title: "نام و نام خانوادگی",
      name: "fullName",
    },
    {
      title: "تعداد تنوع",
      name: "count",
    },
  ];

  console.log(orderItems);

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
            <BlockHeader
              type="minimum"
              title={`آدرس: ${orderItems.address}`}
            ></BlockHeader>
            <BlockHeader
              title={`کل مبلغ خرید: ${orderItems.price} تومان`}
            ></BlockHeader>
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
  }
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  .table-items {
    flex: 1;
    padding: 15px 0;
    margin-left: 15px;
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
