import React, { Component } from "react";
import { Grid, Notify, Button, Input, Sweetalert } from "zent";
import { withBaseIcon } from "react-icons-kit";
import { edit } from "react-icons-kit/feather/edit";
import { trash2 } from "react-icons-kit/feather/trash2";
import moment from "jalali-moment";

import {
  fetchProducts,
  deleteProduct,
  fetchProductsCount,
  // addProduct,
} from "../../services/productService";
// import { addWarehouseLog } from "../../services/warehouselogService";
import Block from "../../components/common/block";
import { renderSize } from "../../utils/services";

const Icon = withBaseIcon({ size: 20, style: { color: "#fff" } });

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      count: 0,
      isLoading: true,
      searchText: "",
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
    Promise.all([fetchProducts(query, page, start), fetchProductsCount()])
      .then((res) => {
        this.setState({
          datasets: res[0].data,
          count: res[1].data,
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
      this.fetchData("", Number(current), (current - 1) * 10 + 10)
    );
  };

  removeProduct = (id) => {
    Sweetalert.confirm({
      content: `آیا مطمئن به حذف این آیتم هستید؟`,
      title: `توجه`,
      confirmType: "danger",
      confirmText: `حذف`,
      cancelText: `خیر`,
      onConfirm: () =>
        new Promise((resolve) => {
          deleteProduct(id)
            .then(() => {
              this.fetchData();
              Notify.success("محصول مورد نظر حذف گردید.", 5000);
              return resolve();
            })
            .catch((err) => {
              Notify.error("در برقراری ارتباط مشکلی به وجود آمده است.", 5000);
              return resolve();
            });
        }),
    });
  };

  onPressEnter = (e) => {
    if (!e.target.value && e.target.value.trim() !== "") {
      return this.fetchData(e.target.value)
        .then((res) => {
          this.setState({ datasets: res.data, searchText: e.target.value });
        })
        .catch((err) =>
          Notify.error(
            "در برقراری ارتباط مشکلی به وجود آمده است، مجددا تلاش نمایید."
          )
        );
    }
  };

  render() {
    const { datasets, count, pageInfo, isLoading } = this.state;
    const { history } = this.props;
    const columns = [
      {
        title: "نام محصول",
        name: "name",
        // bodyRender: (data) => {
        //   return (
        //     <div>
        //       <div
        //         style={{
        //           widht: "100px",
        //           height: "100px",
        //           backgroundImage: `url(${data.image})`,
        //         }}
        //       ></div>
        //       {data.name}
        //     </div>
        //   );
        // },
      },
      {
        title: "قیمت",
        bodyRender: (data) => {
          return `${Number(data.price).toLocaleString("fa")} تومان`;
        },
      },
      {
        title: "قیمت تولید (تومان)",
        bodyRender: (data) => {
          return Number(data.productionCost).toLocaleString("fa");
        },
      },
      {
        title: "موجودی",
        name: "count",
      },
      {
        title: "تاریخ ثبت",
        bodyRender: (data) => {
          return moment(data.createdAt).locale("fa").format("YYYY/M/D - HH:mm");
        },
      },
      {
        title: "سایز",
        bodyRender: (data) => renderSize(data.size),
      },
      {
        title: "رنگ",
        bodyRender: (data) => {
          return data.color;
        },
      },
      {
        title: "",
        bodyRender: (data) => {
          return (
            <div className="table-control__container">
              <Button
                type="primary"
                onClick={() => history.push(`/product/${data.id}`)}
              >
                <Icon icon={edit} />
              </Button>
              <Button type="danger" onClick={() => this.removeProduct(data.id)}>
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
          <h1 className="title">فهرست محصولات ({count})</h1>
          <div className="row">
            <Input
              onPressEnter={this.onPressEnter}
              icon="search"
              placeholder="جستجو ..."
            />
            <Button onClick={() => history.push("/product/add")}>
              درج محصول
            </Button>
          </div>
        </Block>
        <Grid
          pageInfo={pageInfo}
          columns={columns}
          datasets={datasets}
          onChange={this.onChange}
          emptyLabel={"هیچ محصولی یافت نشده است."}
          loading={isLoading}
        />
      </div>
    );
  }
}

export default Products;
