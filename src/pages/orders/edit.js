/* eslint-disable no-useless-escape */
import _ from "lodash";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FormInputField,
  FormSelectField,
  FormControl,
  FormStrategy,
  Form,
  NumberInput,
  Select,
  Grid,
  Validators,
  Button,
  Notify,
} from "zent";
import Cleave from "cleave.js/react";

import {
  editOrder,
  fetchSingleOrder,
  fetchUsers,
} from "../../services/orderService";
import { fetchAllProducts } from "../../services/productService";
// import { addWarehouseLog } from "../../services/warehouselogService";

const EditOrder = ({ history, match }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedOldProducts, setSelectedOldProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    fetchSingleOrder(match.params.id).then((res) => {
      const {
        fullName,
        address,
        mobileNumber,
        courier,
        price,
        shippingCost,
        orderItems,
        description,
      } = res.data;
      form.patchValue({
        status: 1,
        fullName: fullName,
        address: address,
        mobileNumber: mobileNumber,
        courier: courier,
        description: description,
      });
      setSelectedProducts(orderItems);
      setSelectedOldProducts(orderItems);
      setShippingCost(shippingCost);
      setPrice(price);
      // setTotalPrice(price);
    });
    fetchProducts();
  }, [form]);

  const renderSize = (item) => {
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

  const fetchProducts = () => {
    Promise.all([fetchAllProducts(), fetchUsers()]).then((res) => {
      let items = res[0].data.map((item) => {
        item.name = `${item.name} (${renderSize(item.size[0])} - ${
          item.color
        })`;
        return item;
      });
      let usersList = res[1].data.map((item) => {
        let obj = {
          value: item.courierId,
          text: item.fullName,
        };
        return obj;
      });
      setProducts(items);
      setUsers(usersList);
    });
  };

  const getTotalPrice = () => {
    let total = 0;
    selectedProducts.forEach(
      (item) => (total += Number(item.price) * Number(item.orderCount))
    );
    if (Number(shippingCost) > 0) {
      total += Number(shippingCost);
    }
    return total.toLocaleString("fa");
  };

  const removeSelected = (id) => {
    let result = selectedProducts.filter((item) => item.id !== id);
    return setSelectedProducts(result);
  };

  const addRow = () => {
    if (
      selected &&
      orderCount &&
      Number(orderCount) <= Number(selected.count)
    ) {
      selected["dateObject"] = new Date().getTime();
      // find product by id and update count
      let productsArray = products.map((item) => {
        if (item.id === selected.id) {
          item.count = Number(item.count) - Number(orderCount);
          return item;
        }
        return item;
      });
      // check for duplicate entry
      let result = [];
      selectedProducts.forEach((item) => {
        if (item.id === selected.id) {
          item.count = Number(item.count) - Number(orderCount);
          item.orderCount = Number(item.orderCount) + Number(orderCount);
          item["dateObject"] = new Date().getTime();
          return result.push(item);
        }
      });
      if (result.length > 0) {
        return Notify.error(`این ایتم در لیست خرید ها موجود است.`, 4000);
      } else {
        setSelectedProducts([
          ...selectedProducts,
          { ...selected, orderCount: Number(orderCount) },
        ]);
        setProducts(productsArray);
        return setOrderCount(0);
      }
    } else {
      return Notify.error(`تعداد موجود این کالا ${selected.count} است.`, 4000);
    }
  };

  const changeProductCount = (id, value, itemCount) => {
    if (Number(value) <= itemCount) {
      let array = selectedProducts.map((item) => {
        if (item.id === id) {
          item.orderCount = value;
          item.count = Number(item.count) - Number(value);
          return item;
        }
        return item;
      });
      let result = products.map((item) => {
        if (item.id === id) {
          item.count = Number(item.count) - Number(value);
          return item;
        }
        return item;
      });
      setProducts(result);
      return setSelectedProducts(array);
    } else {
      return Notify.error(`تعداد موجود این کالا ${itemCount} است.`, 4000);
    }
  };

  const submit = () => {
    setLoading(true);
    let total = 0;
    selectedProducts.forEach(
      (item) => (total += Number(item.price) * Number(item.orderCount))
    );
    if (Number(shippingCost) > 0) {
      total += Number(shippingCost);
    }
    const {
      fullName,
      address,
      mobileNumber,
      status,
      courier,
      description,
    } = form.getValue();
    let result = _.differenceBy(selectedProducts, selectedOldProducts, ["id"]);
    console.log(result);
    editOrder(
      {
        fullName,
        address,
        mobileNumber,
        price: total,
        priceWithDiscount: price,
        status,
        shippingCost,
        courier,
        products: selectedProducts.map((item) => item.id),
        orderItems: selectedProducts,
        orderStatus: 1,
        description,
      },
      match.params.id
    )
      .then((res) => {
        // selectedProducts.map((item) => {
        //   return addWarehouseLog({
        //     status: 2,
        //     name: item.name,
        //     count: item.count,
        //     ownerId: item.id,
        //   });
        // });
        Notify.success("سفارش مورد نظر با موفقیت به روز رسانی گردید.", 4000);
        return history.replace("/orders");
      })
      .catch((err) =>
        Notify.error("در ثبت سفارش جدید مشکل به وجود آمده است.", 4000)
      );
  };

  const columns = [
    {
      title: "نام محصول",
      name: "name",
      bodyRender: (data) => {
        return `${data.name} (${data.size.map(
          (item) => ` ${renderSize(item)} `
        )} - ${data.color})`;
      },
    },
    {
      title: "قیمت",
      bodyRender: (data) => {
        return `${Number(data.price).toLocaleString("fa")} تومان`;
      },
    },
    {
      title: "تعداد",
      bodyRender: (data) => {
        return (
          <NumberInput
            onChange={(value) => changeProductCount(data.id, value, data.count)}
            showStepper
            value={data.orderCount}
          />
        );
      },
    },
    {
      title: "قیمت کل (تومان)",
      bodyRender: (data) => {
        return (Number(data.price) * Number(data.orderCount)).toLocaleString(
          "fa"
        );
      },
    },
    {
      title: "",
      bodyRender: (data) => {
        return (
          <div className="table-control__container">
            <Button type="danger" onClick={() => removeSelected(data.id)}>
              حذف
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Container className="animated fadeIn">
      <h1>ویرایش سفارش</h1>
      <Form
        layout={"vertical"}
        form={form}
        onSubmit={submit}
        disableEnterSubmit={false}
      >
        <div className="zent-form-row">
          <FormInputField
            name="fullName"
            label="نام‌ و‌ نام خانوادگی"
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[
              Validators.required("نام‌ و‌ نام خانوادگی را وارد نمایید."),
            ]}
            required="Required"
          />
          <FormInputField
            name="address"
            label="آدرس"
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("آدرس را وارد نمایید.")]}
            required="Required"
          />
          <FormInputField
            name="mobileNumber"
            label="شماره تماس"
            props={{
              type: "tel",
            }}
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[
              Validators.required("شماره تماس را وارد نمایید."),
              Validators.pattern(/^([0-9\(\)\/\+ \-]*)$/),
            ]}
            required="Required"
          />
        </div>
        <div className="zent-form-row">
          <div
            className={`zent-form-control ${
              form.state.submitting && !shippingCost ? "has-error" : ""
            }`}
          >
            <label className="zent-form-label zent-form-label-required">
              هزینه ارسال (تومان)
            </label>
            <div className="zent-form-control-content">
              <Cleave
                className="zent-input  numeric-input"
                options={{
                  numeral: true,
                  numeralThousandsGroupStyle: "thousand",
                }}
                onChange={(e) => setShippingCost(e.target.rawValue)}
                value={shippingCost}
              />
              {form.state.submitting && !shippingCost ? (
                <div className="zent-form-error zent-font-small">
                  هزینه ارسال سفارش را وارد نمایید.
                </div>
              ) : null}
            </div>
          </div>
          <FormSelectField
            name="status"
            label="وضعیت"
            props={{
              placeholder: "وضعیت را انتخاب کنید",
              data: [
                { value: 1, text: "ثبت شده" },
                { value: 2, text: "پرداخت شده" },
                { value: 3, text: "در حال ارسال" },
                { value: 4, text: "تحویل داده شده" },
                { value: 5, text: "لغو" },
              ],
              autoWidth: true,
            }}
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("وضعیت سفارش را وارد نمایید.")]}
            required="Required"
          />
          <FormSelectField
            name="courier"
            label="فرستنده"
            props={{
              placeholder: "فرستنده را انتخاب کنید",
              data: users,
              autoWidth: true,
            }}
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("فرستنده را وارد نمایید.")]}
            required="Required"
          />
        </div>
        <div
          className="zent-form-row"
          style={{ alignItems: "flex-end", marginBottom: 25 }}
        >
          <div
            className={`zent-form-control ${
              form.state.submitting && !price ? "has-error" : ""
            }`}
            style={{ marginBottom: 0 }}
          >
            <label className="zent-form-label zent-form-label-required">
              فهرست محصولات
            </label>
            <Select
              data={products}
              autoWidth
              optionText="name"
              optionValue="id"
              placeholder="انتخاب محصول"
              emptyText="هیچ آیتمی یافت نشده است."
              onChange={(e, item) => {
                setSelected(item);
              }}
              filter={(item, keyword) => item.name.indexOf(keyword) > -1}
              value={selected}
            />
          </div>
          <FormControl label="تعداد" style={{ marginBottom: 0 }}>
            <NumberInput
              onChange={(value) => setOrderCount(value)}
              showStepper
              value={orderCount}
            />
          </FormControl>
          <Button type="primary" onClick={() => addRow()}>
            درج
          </Button>
        </div>
        <div style={{ marginBottom: 15 }}>
          <Grid
            columns={columns}
            datasets={selectedProducts}
            emptyLabel={"هیچ محصولی یافت نشده است."}
          />
        </div>
        <div className="zent-form-row">
          <div
            className={`zent-form-control ${
              form.state.submitting && !price ? "has-error" : ""
            }`}
          >
            <label className="zent-form-label zent-form-label-required">
              قیمت (تومان)
            </label>
            <div className="zent-form-control-content">
              <Cleave
                className="zent-input  numeric-input"
                options={{
                  numeral: true,
                  numeralThousandsGroupStyle: "thousand",
                }}
                onChange={(e) => setPrice(e.target.rawValue)}
                value={price}
              />
              {form.state.submitting && !price ? (
                <div className="zent-form-error zent-font-small">
                  قیمت سفارش را وارد نمایید.
                </div>
              ) : null}
            </div>
          </div>
          <div className="zent-form-control">
            قیمت کل فاکتور: {getTotalPrice()} تومان
          </div>
        </div>
        <div className="zent-form-row">
          <FormInputField
            name="description"
            label="توضحیات"
            props={{
              type: "textarea",
              rows: "5",
            }}
          />
        </div>
        <Button htmlType="submit" type="primary" loading={isLoading}>
          به روزرسانی
        </Button>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  background-color: #fff;
  padding: 35px 35px 35px 20px;
  border-radius: 6px;
  h1 {
    font-size: 2em;
    font-weight: bold;
    color: #222;
    margin-bottom: 30px;
  }
`;

export default EditOrder;
