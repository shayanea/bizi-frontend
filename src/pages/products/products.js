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
import { StateContext } from "../../context/state";

const Icon = withBaseIcon({ size: 20, style: { color: "#fff" } });

class Products extends Component {
  static contextType = StateContext;

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
      this.fetchData("", Number(current), (current - 2) * 10 + 10)
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

  renderImage = (array) => {
    if (array.length > 0) {
      return process.env.NODE_ENV === "production"
        ? `http://78.47.89.182/${array[0].url}`
        : `http://localhost:1337/${array[0].url}`;
    }
    return "";
  };

  render() {
    const { datasets, count, pageInfo, isLoading } = this.state;
    const { history } = this.props;
    const [{ profile }] = this.context;
    let columns = [];
    if (profile) {
      let result = ["authenticated", "manager"].find(
        (item) => item === profile.role.type
      );
      columns = result
        ? [
            {
              title: "نام محصول",
              width: "25%",
              bodyRender: (data) => {
                return (
                  <div>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "6px",
                        marginLeft: "10px",
                        display: "inline-block",
                        verticalAlign: "middle",
                        backgroundImage: `url(${this.renderImage(data.image)})`,
                        backgroundColor: "#eee",
                      }}
                    ></div>
                    {data.name}
                  </div>
                );
              },
            },
            {
              title: "قیمت",
              bodyRender: (data) => {
                return `${Number(data.price).toLocaleString("fa")} تومان`;
              },
            },
            {
              title: "قیمت تولید",
              bodyRender: (data) => {
                return `${Number(data.productionCost).toLocaleString(
                  "fa"
                )} تومان`;
              },
            },
            {
              title: "تاریخ ثبت",
              bodyRender: (data) => {
                return moment(data.createdAt)
                  .locale("fa")
                  .format("YYYY/M/D - HH:mm");
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
                    <Button
                      type="danger"
                      onClick={() => this.removeProduct(data.id)}
                    >
                      <Icon icon={trash2} />
                    </Button>
                  </div>
                );
              },
            },
          ]
        : [
            {
              title: "نام محصول",
              name: "name",
            },
            {
              title: "موجودی",
              name: "count",
            },
            {
              title: "تاریخ ثبت",
              bodyRender: (data) => {
                return moment(data.createdAt)
                  .locale("fa")
                  .format("YYYY/M/D - HH:mm");
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
                  </div>
                );
              },
            },
          ];
    }
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
        {profile && (
          <Grid
            pageInfo={pageInfo}
            columns={columns}
            datasets={datasets}
            onChange={this.onChange}
            emptyLabel={"هیچ محصولی یافت نشده است."}
            loading={isLoading}
          />
        )}
      </div>
    );
  }
}

export default Products;
