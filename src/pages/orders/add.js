/* eslint-disable no-useless-escape */
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
  Notify
} from "zent";
import Cleave from "cleave.js/react";

import { addOrder } from "../../services/orderService";
import { fetchAllProducts } from "../../services/productService";
import { addCustomer } from "../../services/customerService";

const AddOrder = ({ history }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selected, setSelected] = useState("");
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    form.patchValue({
      status: 1
    });
    fetchProducts();
  }, [form]);

  const renderSize = item => {
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
    fetchAllProducts().then(res => {
      let items = res.data.map(item => {
        item.name = `${item.name} (${renderSize(item.size[0])} - ${
          item.color
        })`;
        return item;
      });
      setProducts(items);
    });
  };

  const getTotalPrice = () => {
    let total = 0;
    selectedProducts.forEach(
      item => (total += Number(item.price) * Number(item.orderCount))
    );
    if (Number(shippingCost) > 0) {
      total += Number(shippingCost);
    }
    return total.toLocaleString("fa");
  };

  const removeSelected = id => {
    let result = selectedProducts.filter(item => item.id !== id);
    return setSelectedProducts(result);
  };

  const addRow = () => {
    if (selected && orderCount) {
      return setSelectedProducts([
        ...selectedProducts,
        { ...selected, orderCount: Number(orderCount) }
      ]);
    }
    return null;
  };

  const submit = () => {
    setLoading(true);
    let total = 0;
    selectedProducts.forEach(
      item => (total += Number(item.price) * Number(item.orderCount))
    );
    if (Number(shippingCost) > 0) {
      total += Number(shippingCost);
    }
    const {
      fullName,
      address,
      mobileNumber,
      status,
      courier
    } = form.getValue();
    addOrder({
      fullName,
      address,
      mobileNumber,
      price: price !== 0 || !price ? total : price,
      status,
      shippingCost,
      courier,
      products: selectedProducts.map(item => item.id),
      orderItems: selectedProducts
    })
      .then(res => {
        Notify.success("سفارش مورد نظر با موفقیت ثبت گردید.", 4000);
        addCustomer({
          fullName,
          address,
          mobileNumber,
          orders: [res.data.id]
        })
          .then(res => {
            return history.replace("/orders");
          })
          .catch(err => {
            return history.replace("/orders");
          });
      })
      .catch(err =>
        Notify.error("در ثبت سفارش جدید مشکل به وجود آمده است.", 4000)
      );
  };

  const columns = [
    {
      title: "نام محصول",
      name: "name",
      bodyRender: data => {
        return `${data.name} (${data.size.map(
          item => ` ${renderSize(item)} `
        )} - ${data.color})`;
      }
    },
    {
      title: "قیمت (تومان)",
      bodyRender: data => {
        return Number(data.price).toLocaleString("fa");
      }
    },
    {
      title: "موجودی",
      name: "count"
    },
    {
      title: "تعداد",
      bodyRender: data => {
        return data.orderCount;
      }
    },
    {
      title: "قیمت کل (تومان)",
      bodyRender: data => {
        return (Number(data.price) * Number(data.orderCount)).toLocaleString(
          "fa"
        );
      }
    },
    {
      title: "",
      bodyRender: data => {
        return (
          <div className="table-control__container">
            <Button type="danger" onClick={() => removeSelected(data.id)}>
              حذف
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <Container className="animated fadeIn">
      <h1>درج سفارش</h1>
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
              Validators.required("نام‌ و‌ نام خانوادگی را وارد نمایید.")
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
              type: "tel"
            }}
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[
              Validators.required("شماره تماس را وارد نمایید."),
              Validators.pattern(/^([0-9\(\)\/\+ \-]*)$/)
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
                  numeralThousandsGroupStyle: "thousand"
                }}
                onChange={e => setShippingCost(e.target.rawValue)}
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
                { value: 5, text: "لغو" }
              ],
              autoWidth: true
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
              data: [
                { value: 1, text: "بابک" },
                { value: 2, text: "شایان" }
              ],
              autoWidth: true
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
              form.state.submitting && !selectedProducts ? "has-error" : ""
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
              onChange={value => setOrderCount(value)}
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
              form.state.submitting && price === 0 ? "has-error" : ""
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
                  numeralThousandsGroupStyle: "thousand"
                }}
                onChange={e => setPrice(e.target.rawValue)}
                value={price}
              />
              {form.state.submitting && price === 0 ? (
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
        <Button htmlType="submit" type="primary" loading={isLoading}>
          ثبت
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

export default AddOrder;
