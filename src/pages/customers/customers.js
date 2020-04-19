import React, { Component } from "react";
import { Grid, Notify, Input, Button, Portal } from "zent";
import moment from "jalali-moment";

import {
  fetchCustomers,
  fetchUsers,
  fetchOrdersByMobileNumber,
  fetchBestBuyest,
} from "../../services/customerService";
import Block from "../../components/common/block";

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      users: [],
      orderItems: null,
      showModal: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (query = "") => {
    Promise.all([fetchCustomers(query), fetchUsers(), fetchBestBuyest()])
      .then((res) => {
        this.setState({
          datasets: res[0].data,
          users: res[1].data,
          isLoading: false,
        });
      })
      .catch((err) =>
        Notify.error(
          "در برقراری ارتباط مشکلی به وجود آمده اس، مجددا تلاش نمایید."
        )
      );
  };

  onChange = (conf) => {
    console.log(conf, "conf");
    // const { sortType, sortBy } = conf;
    // const { datasets } = this.state;
    // let sortDatasets = datasets;
    // if (sortType === 'asc') {
    //   sortDatasets = datasets.sort((a, b) => a[sortBy] - b[sortBy]);
    // } else if (sortType === 'desc') {
    //   sortDatasets = datasets.sort((a, b) => b[sortBy] - a[sortBy]);
    // }
    // this.setState(assign({}, this.state, conf, { datasets: sortDatasets }));
  };

  onChangeSearch = (e) => {
    if (!e.target.value && e.target.value.trim() !== "") {
      return this.fetchData()
        .then((res) => {
          this.setState({ datasets: res.data });
        })
        .catch((err) =>
          Notify.error(
            "در برقراری ارتباط مشکلی به وجود آمده اس، مجددا تلاش نمایید."
          )
        );
    }
  };

  onPressEnter = (e) => {
    fetchCustomers(e.target.value)
      .then((res) => {
        this.setState({ datasets: res.data });
      })
      .catch((err) =>
        Notify.error(
          "در برقراری ارتباط مشکلی به وجود آمده اس، مجددا تلاش نمایید."
        )
      );
  };

  renderSize = (item) => {
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

  renderStatus = (status) => {
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

  renderCourier = (id) => {
    return this.state.users.map((item) => {
      return item.courierId === Number(id) ? item.fullName : "";
    });
  };

  getCustomerOrders = (query) => {
    this.setState({ showModal: true });
    fetchOrdersByMobileNumber(query).then((res) => {
      return this.setState({ orderItems: res.data });
    });
  };

  render() {
    const { datasets, orderItems, showModal, isLoading } = this.state;
    const orders = [
      {
        title: "نام و نام خانوادگی",
        name: "fullName",
      },
      {
        title: "شماره تماس",
        name: "mobileNumber",
      },
      {
        title: "تاریخ",
        name: "createdAt",
        bodyRender: (data) => {
          return moment(data.createdAt).locale("fa").format("YYYY/M/D");
        },
      },
      // {
      //   title: "آدرس",
      //   width: 20,
      //   bodyRender: (data) => {
      //     return <div className="long-content">{data.address}</div>;
      //   },
      // },
      {
        title: "قیمت",
        bodyRender: (data) => {
          return `${Number(data.price).toLocaleString("fa")} تومان`;
        },
      },
      {
        title: "وضعیت",
        bodyRender: (data) => {
          return this.renderStatus(data.status);
        },
      },
      {
        title: "فرستنده",
        bodyRender: (data) => {
          return this.renderCourier(data.courier);
        },
      },
      {
        title: "",
        bodyRender: (data) => {
          return <div></div>;
        },
      },
    ];
    const columns = [
      {
        title: "نام‌ و‌ نام خانوادگی",
        name: "fullName",
      },
      {
        title: "شماره تماس",
        name: "mobileNumber",
      },
      {
        title: "آدرس",
        name: "address",
      },
      {
        title: "تاریخ عضویت",
        name: "createdAt",
        bodyRender: (data) => {
          return moment(data.createdAt).locale("fa").format("YYYY/M/D");
        },
      },
      {
        title: "",
        bodyRender: (data) => {
          return (
            <Button
              type="primary"
              onClick={() => this.getCustomerOrders(data.fullName)}
            >
              مشاهده سفارشات
            </Button>
          );
        },
      },
      {
        title: "",
        bodyRender: () => {
          return <div className="table-control__container"></div>;
        },
      },
    ];
    return (
      <div className="animated fadeIn">
        <Block>
          <h1 className="title">فهرست مشتری‌ها</h1>
          <div className="row">
            <Input
              onPressEnter={this.onPressEnter}
              onChange={this.onChangeSearch}
              icon="search"
              placeholder="جستجو ..."
              style={{ marginLeft: 0 }}
            />
          </div>
        </Block>
        <Grid
          columns={columns}
          datasets={datasets}
          onChange={this.onChange}
          emptyLabel={"هیچ مشتری یافت نشده است."}
          loading={isLoading}
        />
        <Portal
          visible={showModal}
          onClose={() => this.setState({ showModal: false, orderItems: null })}
          className="layer"
          style={{ background: "rgba(0, 0, 0, 0.4)" }}
          useLayerForClickAway
          closeOnClickOutside
          closeOnESC
          blockPageScroll
        >
          <div className="custom-portal__container">
            {orderItems && (
              <Grid
                columns={orders}
                datasets={orderItems}
                emptyLabel={"هیچ سفارشی یافت نشده است."}
              />
            )}
          </div>
        </Portal>
      </div>
    );
  }
}

export default Customers;
