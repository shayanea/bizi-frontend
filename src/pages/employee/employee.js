import React, { Component } from "react";
import { Grid, Notify, Input, Button, Sweetalert } from "zent";
import moment from "jalali-moment";

import {
  fetchEmployee,
  fetchEmployeeCount,
  deleteEmployee,
} from "../../services/employeeService";
import Block from "../../components/common/block";

class Employee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
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
    Promise.all([fetchEmployee(query, start), fetchEmployeeCount()])
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
    this.setState(
      {
        isLoading: true,
      },
      this.fetchData("", Number(current), (current - 2) * 10 + 10)
    );
  };

  onPressEnter = (e) => {
    if (!e.target.value) {
      return fetchEmployee(e.target.value)
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

  removeEmploye = (id) => {
    Sweetalert.confirm({
      content: `آیا مطمئن به حذف این کارمند هستید؟`,
      title: `توجه`,
      confirmType: "danger",
      confirmText: `حذف`,
      cancelText: `خیر`,
      onConfirm: () =>
        new Promise((resolve) => {
          deleteEmployee(id)
            .then(() => {
              this.fetchData();
              Notify.success("کارمند مورد نظر حذف گردید.", 5000);
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
    const { datasets, pageInfo, isLoading } = this.state;
    const { history } = this.props;
    const columns = [
      {
        title: "نام و نام خانوادگی",
        name: "fullName",
      },
      {
        title: "آدرس",
        name: "address",
      },
      {
        title: "تاریخ ثبت",
        bodyRender: (data) => {
          return moment(data.createdAt).locale("fa").format("YYYY/M/D - HH:mm");
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
                onClick={() => history.push(`/employee/${data.id}`)}
              >
                ویرایش
              </Button>
              <Button type="danger" onClick={() => this.removeEmploye(data.id)}>
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
          <h1 className="title">فهرست کارمندان</h1>
          <div className="row">
            <Input
              onPressEnter={this.onPressEnter}
              icon="search"
              placeholder="جستجو ..."
            />
            <Button
              className="add-btn"
              onClick={() => history.push("/employee/add")}
            >
              درج کارمند
            </Button>
          </div>
        </Block>
        <Grid
          pageInfo={pageInfo}
          columns={columns}
          datasets={datasets}
          onChange={this.onChange}
          emptyLabel={"هیچ کارمندی یافت نشده است."}
          loading={isLoading}
        />
      </div>
    );
  }
}

export default Employee;
