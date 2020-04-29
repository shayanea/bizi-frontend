import React, { Component } from "react";
import {
  Grid,
  Notify,
  Input,
  Button,
  Sweetalert,
  Portal,
  BlockHeader,
} from "zent";
import { withBaseIcon } from "react-icons-kit";
import { edit } from "react-icons-kit/feather/edit";
import { trash2 } from "react-icons-kit/feather/trash2";
import { database } from "react-icons-kit/feather/database";
import moment from "jalali-moment";

import {
  fetchSalaries,
  fetchEmployees,
  fetchSalariesCount,
  deleteSalaries,
  fetchEmployeesTransactionHistory,
} from "../../services/salariesService";
import Block from "../../components/common/block";

const Icon = withBaseIcon({ size: 20, style: { color: "#fff" } });

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      transactionsHistory: [],
      orderItems: null,
      isLoading: true,
      pageInfo: {
        pageSize: 10,
        total: 0,
        current: 0,
        start: 0,
      },
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (query = "", page = 0, start = 0) => {
    let { pageInfo } = this.state;
    Promise.all([
      fetchSalaries(query, start),
      fetchSalariesCount(),
      fetchEmployees(),
    ])
      .then((res) => {
        this.setState({
          datasets: res[0].data,
          staffs: res[2].data,
          isLoading: false,
          pageInfo: {
            ...pageInfo,
            total: res[1].data,
            current: page,
          },
        });
      })
      .catch((err) =>
        Notify.error(
          "در برقراری ارتباط مشکلی به وجود آمده است، مجددا تلاش نمایید."
        )
      );
  };

  onChange = ({ current }) => {
    this.setState(
      {
        isLoading: true,
      },
      this.fetchData("", Number(current), (current - 2) * 10 + 10)
    );
  };

  onChangeSearch = (e) => {
    if (!e.target.value) {
      return fetchSalaries(e.target.value)
        .then((res) => {
          this.setState({ datasets: res.data });
        })
        .catch((err) =>
          Notify.error(
            "در برقراری ارتباط مشکلی به وجود آمده است، مجددا تلاش نمایید."
          )
        );
    }
  };

  removeOrder = (id) => {
    Sweetalert.confirm({
      content: `آیا مطمئن به حذف این تراکنش هستید؟`,
      title: `توجه`,
      confirmType: "danger",
      confirmText: `حذف`,
      cancelText: `خیر`,
      onConfirm: () =>
        new Promise((resolve) => {
          deleteSalaries(id)
            .then(() => {
              this.fetchData();
              Notify.success("تراکنش مورد نظر حذف گردید.", 5000);
              return resolve();
            })
            .catch((err) => {
              Notify.error("در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
              return resolve();
            });
        }),
    });
  };

  renderStaffByName = (id) => {
    let result = this.state.staffs.find((item) => item.id === id);
    return result ? result.fullName : "";
  };

  transactionsHistory = (id) => {
    fetchEmployeesTransactionHistory(id)
      .then((res) =>
        this.setState({ transactionsHistory: res.data, orderItems: true })
      )
      .catch((err) =>
        Notify.error("در برقراری ارتباط مشکلی به وجود آمده است.", 5000)
      );
  };

  getTotalPaidSalaries = () => {
    let array = this.state.transactionsHistory,
      total = 0;
    array.forEach((item) => {
      total += item.price;
    });
    return total.toLocaleString("fa");
  };

  render() {
    const {
      datasets,
      pageInfo,
      transactionsHistory,
      orderItems,
      isLoading,
    } = this.state;
    const { history } = this.props;
    const columns = [
      {
        title: "شماره تراکنش",
        name: "serialNumber",
      },
      {
        title: "واریز به",
        bodyRender: (data) => {
          return this.renderStaffByName(data.staffId);
        },
      },
      {
        title: "مبلغ",
        bodyRender: (data) => {
          return `${Number(data.price).toLocaleString("fa")} تومان`;
        },
      },
      {
        title: "تاریخ ثبت",
        bodyRender: (data) => {
          return moment(data.createdAt).locale("fa").format("YYYY/M/D - HH:mm");
        },
      },
      {
        title: "",
        bodyRender: (data) => {
          return <div className="table-control__container"></div>;
        },
      },
      {
        title: "",
        width: "25%",
        bodyRender: (data) => {
          return (
            <div className="table-control__container">
              <Button
                type="warning"
                className="icon"
                onClick={() => this.transactionsHistory(data.staffId)}
              >
                <Icon icon={database} />
              </Button>
              <Button
                type="danger"
                className="icon"
                onClick={() => this.removeOrder(data.id)}
              >
                <Icon icon={trash2} />
              </Button>
            </div>
          );
        },
      },
    ];
    const columns1 = [
      {
        title: "شماره تراکنش",
        name: "serialNumber",
      },
      {
        title: "واریز به",
        bodyRender: (data) => {
          return this.renderStaffByName(data.staffId);
        },
      },
      {
        title: "مبلغ",
        bodyRender: (data) => {
          return `${Number(data.price).toLocaleString("fa")} تومان`;
        },
      },
      {
        title: "تاریخ ثبت",
        bodyRender: (data) => {
          return moment(data.createdAt).locale("fa").format("YYYY/M/D - HH:mm");
        },
      },
      {
        title: "",
        bodyRender: (data) => {
          return <div className="table-control__container"></div>;
        },
      },
      {
        title: "",
        width: "25%",
        bodyRender: (data) => {
          return (
            <div className="table-control__container">
              <Button
                type="primary"
                className="icon"
                onClick={() => history.push(`/salarie/${data.id}`)}
              >
                <Icon icon={edit} />
              </Button>
              <Button
                type="danger"
                className="icon"
                onClick={() => this.removeOrder(data.id)}
              >
                <Icon icon={trash2} />
              </Button>
            </div>
          );
        },
      },
    ];
    return (
      <div className="animated fadeIn">
        <Block>
          <h1 className="title">فهرست حقوق‌ها</h1>
          <div className="row">
            <Input
              onPressEnter={this.onPressEnter}
              onChange={this.onChangeSearch}
              icon="search"
              placeholder="جستجو ..."
            />
            <Button onClick={() => history.push("/salarie/add")}>
              درج حقوق
            </Button>
            <Button onClick={() => history.push("/employee")}>
              لیست کارمندان
            </Button>
          </div>
        </Block>
        <Grid
          pageInfo={pageInfo}
          columns={columns}
          datasets={datasets}
          onChange={this.onChange}
          emptyLabel={"هیچ تراکنشی یافت نشده است."}
          loading={isLoading}
        />
        <Portal
          visible={orderItems ? true : false}
          onClose={() => this.setState({ orderItems: null })}
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
                columns={columns1}
                datasets={transactionsHistory}
                emptyLabel={"هیچ پرداختی یافت نشده است."}
              />
              <BlockHeader
                title={`کل مبلغ پرداختی: ${this.getTotalPaidSalaries()} تومان`}
              ></BlockHeader>
            </div>
          )}
        </Portal>
      </div>
    );
  }
}

export default Transactions;
