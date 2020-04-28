import React, { Component } from "react";
import { Grid, Notify, Button, Input, Sweetalert } from "zent";

import { fetchUsers, deleteUser } from "../../services/userService";
import Block from "../../components/common/block";

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (query = "") => {
    fetchUsers(query)
      .then((res) => {
        this.setState({ datasets: res.data });
      })
      .catch((err) =>
        Notify.error(
          "در برقراری ارتباط مشکلی به وجود آمده است، مجددا تلاش نمایید."
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

  removeUser = (id) => {
    Sweetalert.confirm({
      content: `آیا مطمئن به حذف این کاربر هستید؟`,
      title: `توجه`,
      confirmType: "danger",
      confirmText: `حذف`,
      cancelText: `خیر`,
      onConfirm: () =>
        new Promise((resolve) => {
          deleteUser(id)
            .then(() => {
              this.fetchData();
              Notify.success("کاربر مورد نظر حذف گردید.", 5000);
              return resolve();
            })
            .catch((err) => {
              Notify.error("در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
              return resolve();
            });
        }),
    });
  };

  onChangeSearch = (e) => {
    if (!e.target.value && e.target.value.trim() !== "") {
      return this.fetchData(e.target.value)
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

  onPressEnter = (e) => {
    fetchUsers(e.target.value)
      .then((res) => {
        this.setState({ datasets: res.data });
      })
      .catch((err) =>
        Notify.error(
          "در برقراری ارتباط مشکلی به وجود آمده است، مجددا تلاش نمایید."
        )
      );
  };

  render() {
    const { datasets, isLoading } = this.state;
    const { history } = this.props;
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
        title: "ایمیل",
        name: "email",
      },
      {
        title: "سطح دسترسی",
        bodyRender: (data) => {
          return data.role.type === "authenticated" ? "ادمین" : "عادی";
        },
      },
      {
        title: "",
        bodyRender: (data) => {
          return (
            <div className="table-control__container">
              <Button
                type="primary"
                onClick={() => history.push(`/user/${data.id}`)}
              >
                ویرایش
              </Button>
              <Button type="danger" onClick={() => this.removeUser(data.id)}>
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
          <h1 className="title">فهرست کاربران</h1>

          <div className="row">
            <Input
              onPressEnter={this.onPressEnter}
              onChange={this.onChangeSearch}
              icon="search"
              placeholder="جستجو ..."
            />
            <Button onClick={() => history.push("/user/add")}>درج کاربر</Button>
          </div>
        </Block>
        <Grid
          columns={columns}
          datasets={datasets}
          onChange={this.onChange}
          emptyLabel={"هیچ کاربری یافت نشده است."}
          loading={isLoading}
        />
      </div>
    );
  }
}

export default Products;
