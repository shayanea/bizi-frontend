import React, { Component } from "react";
import { Grid, Notify, Input, Button, Sweetalert } from "zent";
import moment from "jalali-moment";

import {
  fetchSalaries,
  deleteTransaction,
} from "../../services/transactionService";
import Block from "../../components/common/block";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (query = "") => {
    fetchSalaries(query)
      .then((res) => {
        this.setState({
          datasets: res.data,
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
    if (!e.target.value) {
      return fetchSalaries(e.target.value)
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

  render() {
    const { datasets, isLoading } = this.state;
    const { history } = this.props;
    const columns = [
      {
        title: "عنوان",
        name: "name",
      },
      {
        title: "هزینه",
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
                onClick={() => history.push(`/transaction/${data.id}`)}
              >
                ویرایش
              </Button>
              <Button type="danger" onClick={() => this.removeOrder(data.id)}>
                حذف
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
            <Button onClick={() => history.push("/transaction/add")}>
              درج حقوق
            </Button>
          </div>
        </Block>
        <Grid
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
