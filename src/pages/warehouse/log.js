import React, { Component } from "react";
import { Grid, Notify } from "zent";
import moment from "jalali-moment";

import { fetchWarehouseLog } from "../../services/warehouselogService";
import Block from "../../components/common/block";

class WarehouseLog extends Component {
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

  fetchData = () => {
    fetchWarehouseLog()
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
    if (!e.target.value) return this.fetchData();
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

  render() {
    const { datasets, isLoading } = this.state;
    const columns = [
      {
        title: "نام محصول",
        name: "name",
      },
      {
        title: "تعداد",
        name: "count",
        bodyRender: (data) => {
          return (
            <div
              className={Number(data.status) === 2 ? "level-down" : "level-up"}
            >
              {data.count}
              {Number(data.status) === 2
                ? " از انبار کم شده "
                : " به انبار اضافه شده "}
            </div>
          );
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
    ];
    return (
      <div className="animated fadeIn">
        <Block>
          <h1 className="title">آمار انبار</h1>
        </Block>
        <Grid
          columns={columns}
          datasets={datasets}
          onChange={this.onChange}
          emptyLabel={"هیچ آماری یافت نشده است."}
          loading={isLoading}
        />
      </div>
    );
  }
}

export default WarehouseLog;
