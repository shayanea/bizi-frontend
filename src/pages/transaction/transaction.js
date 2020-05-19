import React, { Component } from "react";
import { Grid, Notify, Input, Button, Sweetalert, Select } from "zent";
import { withBaseIcon } from "react-icons-kit";
import { edit } from "react-icons-kit/feather/edit";
import { trash2 } from "react-icons-kit/feather/trash2";
import moment from "jalali-moment";
import DatePicker from "react-datepicker2";

import {
  fetchTransactions,
  fetchTransactionsCount,
  deleteTransaction,
} from "../../services/transactionService";
import Block from "../../components/common/block";

const Icon = withBaseIcon({ size: 20, style: { color: "#fff" } }),
  enabledRange = {
    max: moment(),
  };

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      isLoading: true,
      selectedStatus: null,
      searchText: "",
      pageInfo: {
        pageSize: 10,
        total: 0,
        current: 0,
        start: 0,
      },
      startDateTime: null,
      endDateTime: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (
    query = "",
    page = 0,
    start = 0,
    status = null,
    startDateTime = null,
    endDateTime = null
  ) => {
    // fetchMostPayed();
    let { pageInfo } = this.state;
    Promise.all([
      fetchTransactions(query, start, status, startDateTime, endDateTime),
      fetchTransactionsCount(query, start, status, startDateTime, endDateTime),
    ])
      .then((res) => {
        this.setState({
          datasets: res[0].data,
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
    let { selectedStatus, startDateTime, endDateTime, searchText } = this.state;
    this.setState(
      {
        isLoading: true,
      },
      this.fetchData(
        searchText,
        Number(current),
        (current - 2) * 10 + 10,
        selectedStatus,
        startDateTime,
        endDateTime
      )
    );
  };

  onPressEnter = (e) => {
    let { pageInfo, selectedStatus, startDateTime, endDateTime } = this.state;
    if (!e.target.value !== "" && e.target.value) {
      this.setState({ searchText: e.target.value });
    }
    return fetchTransactions(
      e.target.value,
      pageInfo.current,
      selectedStatus,
      startDateTime,
      endDateTime
    )
      .then((res) => {
        this.setState({ datasets: res.data });
      })
      .catch((err) =>
        Notify.error(
          "در برقراری ارتباط مشکلی به وجود آمده است، مجددا تلاش نمایید."
        )
      );
  };

  renderStatus = (status) => {
    switch (Number(status)) {
      case 1:
        return "پرداختی";
      case 2:
        return "دریافتی";
      case 3:
        return "حقوق";
      case 4:
        return "پاداش";
      default:
        return "";
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
          deleteTransaction(id)
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

  renderStatusClass = (type) => {
    switch (type) {
      case 1:
        return "outcome";
      case 2:
        return "income";
      case 3:
        return "salary";
      case 4:
        return "salary";
      default:
        return "";
    }
  };

  renderTransactionType = (type) => {
    switch (Number(type)) {
      case 1:
        return "آقای زرین قبا";
      case 2:
        return "آقای نیک خواه بهرامی";
      case 3:
        return "خانم فیض";
      default:
        return "";
    }
  };

  onChangeStatus = (e, item) => {
    this.setState({ selectedStatus: item.id, isLoading: true });
    return fetchTransactions(this.state.searchText, 0, item.id)
      .then((res) => {
        this.setState({ datasets: res.data, isLoading: false });
      })
      .catch((err) =>
        Notify.error(
          "در برقراری ارتباط مشکلی به وجود آمده است، مجددا تلاش نمایید."
        )
      );
  };

  searchByDate = () => {
    const { startDateTime, endDateTime } = this.state;
    this.fetchData(
      this.state.searchText,
      0,
      0,
      this.state.selectedStatus,
      startDateTime ? moment(startDateTime).format() : null,
      endDateTime ? moment(endDateTime).format() : null
    );
  };

  render() {
    const {
      datasets,
      pageInfo,
      selectedStatus,
      isLoading,
      startDateTime,
      endDateTime,
    } = this.state;
    const { history } = this.props;
    const columns = [
      {
        title: "عنوان",
        name: "name",
      },
      {
        title: "نوع تراکنش",
        width: "10%",
        bodyRender: (data) => {
          return (
            <div
              className={`status-tag ${this.renderStatusClass(
                Number(data.status)
              )}`}
            >
              {this.renderStatus(data.status)}
            </div>
          );
        },
      },
      {
        title: "توسط",
        width: "10%",
        bodyRender: (data) => {
          return this.renderTransactionType(data.transactionType);
        },
      },
      {
        title: "مبلغ",
        bodyRender: (data) => {
          return `${Number(data.price).toLocaleString("fa")} تومان`;
        },
      },
      {
        title: "توضیحات",
        width: "5%",
        bodyRender: (data) => {
          return <div className="long-content">{data.description}</div>;
        },
      },
      {
        title: "تاریخ ثبت",
        bodyRender: (data) => {
          return moment(data.cutomeDate ? data.cutomeDate : data.createdAt)
            .locale("fa")
            .format("YYYY/M/D - HH:mm");
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
        width: "20%",
        bodyRender: (data) => {
          return (
            <div className="table-control__container">
              <Button
                type="primary"
                onClick={() => history.push(`/transaction/${data.id}`)}
              >
                <Icon icon={edit} />
              </Button>
              <Button type="danger" onClick={() => this.removeOrder(data.id)}>
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
          <h1 className="title">فهرست تراکنش‌ها</h1>
          <div className="row with-column">
            <div className="column">
              <Select
                data={[
                  { id: "", name: "همه تراکنش‌ها" },
                  { id: 1, name: "پرداختی" },
                  { id: 2, name: "دریافتی" },
                  { id: 3, name: "حقوق" },
                ]}
                autoWidth
                optionText="name"
                optionValue="id"
                placeholder="انتخاب نوع تراکنش"
                emptyText="هیچ آیتمی یافت نشده است."
                onChange={this.onChangeStatus}
                value={selectedStatus}
              />
              <Input
                onPressEnter={this.onPressEnter}
                icon="search"
                placeholder="جستجو ..."
              />
              <Button
                className="add-btn"
                onClick={() => history.push("/transaction/add")}
              >
                درج تراکنش
              </Button>
            </div>
            <div className="column">
              <div className="zent-form-control">
                <label className="zent-form__control-label">از تاریخ</label>
                <DatePicker
                  max={enabledRange.max}
                  isGregorian={false}
                  timePicker={false}
                  value={startDateTime}
                  onChange={(startDateTime) => this.setState({ startDateTime })}
                  className={"zent-input"}
                  placeholder=""
                />
              </div>
              <div className="zent-form-control">
                <label className="zent-form__control-label">تا تاریخ</label>
                <DatePicker
                  max={enabledRange.max}
                  isGregorian={false}
                  timePicker={false}
                  value={endDateTime}
                  onChange={(endDateTime) => this.setState({ endDateTime })}
                  className={"zent-input"}
                  placeholder=""
                />
              </div>
              <Button
                className="action-btn"
                onClick={() => this.searchByDate()}
              >
                فیلتر
              </Button>
            </div>
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
      </div>
    );
  }
}

export default Transactions;
