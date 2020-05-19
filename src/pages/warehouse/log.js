import React, { Component } from "react";
import { Grid, Notify, Select } from "zent";
import moment from "jalali-moment";

import {
  fetchWarehouseLog,
  fetchWarehouseCount,
} from "../../services/warehouselogService";
import Block from "../../components/common/block";

class WarehouseLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      isLoading: true,
      selectedStatus: null,
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

  fetchData = (page = 0, start = 0) => {
    let { pageInfo } = this.state;
    Promise.all([fetchWarehouseLog(start), fetchWarehouseCount()])
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

  onChangeStatus = (e) => {
    this.setState({ isLoading: true });
    fetchWarehouseLog(0, e.target.value)
      .then((res) => this.setState({ datasets: res.data, isLoading: false }))
      .catch((err) => {
        Notify.error(
          "در برقراری ارتباط مشکلی به وجود آمده است، مجددا تلاش نمایید."
        );
      });
  };

  render() {
    const { datasets, selectedStatus, pageInfo, isLoading } = this.state;
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
          <div className="row">
            <Select
              data={[
                { id: "", name: "همه وضعیت‌ها" },
                { id: 1, name: "ورودی" },
                { id: 2, name: "خروجی" },
              ]}
              autoWidth
              optionText="name"
              optionValue="id"
              placeholder="انتخاب نوع وضعیت"
              emptyText="هیچ آیتمی یافت نشده است."
              onChange={this.onChangeStatus}
              value={selectedStatus}
              style={{ marginLeft: 0 }}
            />
          </div>
        </Block>
        <Grid
          pageInfo={pageInfo}
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
