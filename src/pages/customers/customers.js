import React, { Component } from "react";
import { Grid, Notify, Input } from "zent";

import { fetchCustomers } from "../../services/customerService";
import Block from "../../components/common/block";

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetchCustomers()
      .then(res => {
        this.setState({ datasets: res.data });
      })
      .catch(err =>
        Notify.error(
          "در برقراری ارتباط مشکلی به وجود آمده اس، مجددا تلاش نمایید."
        )
      );
  };

  onChange = conf => {
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

  onChangeSearch = e => {
    if (!e.target.value) return this.fetchData();
  };

  onPressEnter = e => {
    fetchCustomers(e.target.value)
      .then(res => {
        this.setState({ datasets: res.data });
      })
      .catch(err =>
        Notify.error(
          "در برقراری ارتباط مشکلی به وجود آمده اس، مجددا تلاش نمایید."
        )
      );
  };

  renderSize = item => {
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

  render() {
    const { datasets, isLoading } = this.state;
    const columns = [
      {
        title: "نام‌ و‌ نام خانوادگی",
        name: "fullName"
      },
      {
        title: "شماره تماس",
        name: "mobileNumber"
      },
      {
        title: "آدرس",
        name: "address"
      },
      {
        title: ""
      }
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
      </div>
    );
  }
}

export default Customers;
