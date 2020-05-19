/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Input,
  FormInputField,
  FormSelectField,
  FormCheckboxField,
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
// import moment from "jalali-moment";

import axios from "../../utils/axios";
import { addOrder, fetchUsers } from "../../services/orderService";
import {
  fetchAllProducts,
  editProductVariant,
  fetchBrands,
} from "../../services/productService";
import { addCustomer } from "../../services/customerService";
import { addWarehouseLog } from "../../services/warehouselogService";
import { addTransaction } from "../../services/transactionService";

const AddOrder = ({ history }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selected, setSelected] = useState("");
  const [orderCount, setOrderCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [nameSuggestion, setSuggestions] = useState([]);

  let inputRef = null;

  useEffect(() => {
    form.patchValue({
      status: 1,
    });
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = () => {
    Promise.all([fetchAllProducts(), fetchUsers(), fetchBrands()]).then(
      (res) => {
        let items = [];
        res[0].data.forEach((item) => {
          item.attributes.forEach((el) => {
            if (el.size && el.color) {
              return items.push({
                id: el.id,
                name: `${item.name} (${el.size.label} - ${el.color})`,
                count: el.count,
                price: item.price,
                size: el.size,
                parentId: item.id,
              });
            }
          });
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
        setBrands(res[2].data);
      }
    );
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

  const onPressEnter = (e) => {
    let value = e.target.value;
    if (value.length > 2) {
      setCustomerName(value);
      axios
        .get(`/customers?_q=${value}`)
        .then((res) => {
          setSuggestions(res.data);
        })
        .catch((err) => console.log(err));
    }
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
      let result = selectedProducts.map((item) => {
        if (item.id === selected.id) {
          item.count = Number(item.count) - Number(orderCount);
          item.orderCount = Number(item.orderCount) + Number(orderCount);
          item["dateObject"] = new Date().getTime();
          return item;
        }
        return item;
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
    } else if (Number(orderCount) > Number(selected.count)) {
      return Notify.error(`تعداد موجود این کالا ${selected.count} است.`, 4000);
    } else {
      return Notify.error(4000, "هیچ محصولی انتخاب نکرده‌اید.");
    }
  };

  const changeProductCount = (id, value, itemCount) => {
    if (Number(value) <= Number(itemCount)) {
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

  const invoiceNumber = () => {
    return "xxxxxxxx-xxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const renderOrderStatus = (status) => {
    switch (Number(status)) {
      case 1:
        return "آنلاین";
      case 2:
        return "کاستوم";
      case 3:
        return "اینستاگرام";
      case 4:
        return "حضوری";
      default:
        return "";
    }
  };

  const renderTotalOrderPrice = (total, price) => {
    if (price && Number(price) > 0 && Number(price) < Number(total)) {
      return price;
    }
    return total;
  };

  const setCustomerInformation = (item) => {
    setCustomerName(item.fullName);
    setSuggestions([]);
    inputRef.input.value = item.fullName;
    return form.patchValue({
      address: item.address,
      mobileNumber: item.mobileNumber,
    });
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
      brandId,
      status,
      courier,
      description,
      orderStatus,
      hasDeliverCost,
    } = form.getValue();
    addOrder({
      fullName: customerName,
      address,
      mobileNumber,
      price: total,
      priceWithDiscount: price,
      status,
      shippingCost: Number(shippingCost),
      courier,
      products: [],
      // selectedProducts
      orderItems: selectedProducts,
      orderStatus: Number(orderStatus),
      invoiceNumber: invoiceNumber(),
      description,
      brandId,
      hasDeliverCost,
    })
      .then((res) => {
        Notify.success("سفارش مورد نظر با موفقیت ثبت گردید.", 4000);
        selectedProducts.forEach((item) => {
          let result = products.find((el) => el.id === item.id);
          editProductVariant(
            { count: result.count },
            result.parentId,
            result.id
          )
            .then((res) => true)
            .catch((err) => true);
          return addWarehouseLog({
            status: 2,
            name: `${item.name}`,
            count:
              Number(item.count) > Number(result.count)
                ? Number(item.count) - Number(result.count)
                : Number(result.count) - Number(item.count),
            object: [res.data],
            ownerId: res.data.id,
          }).then((res) => {
            return history.replace("/orders");
          });
        });
        if (
          Number(status) === 2 ||
          Number(status) === 3 ||
          Number(status) === 4
        ) {
          addTransaction({
            name: renderOrderStatus(orderStatus),
            price: renderTotalOrderPrice(total, price),
            status: 2,
            description: `خرید از طرف ${customerName}`,
            picture: [],
            transactionType: 1,
            cutomeDate: null,
            orderId: res.data.id,
          })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => console.log(err));
        }
        addCustomer({
          fullName,
          address,
          mobileNumber,
          orders: [res.data.id],
        })
          .then((res) => {
            return history.replace("/orders");
          })
          .catch((err) => {
            return history.replace("/orders");
          });
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
        return `${data.name}`;
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
            min={0}
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
      <h1>درج سفارش</h1>
      <Form
        layout={"vertical"}
        form={form}
        onSubmit={submit}
        disableEnterSubmit={false}
      >
        <div className="zent-form-row">
          <div
            className={`zent-form-control ${
              form.state.submitting && !customerName ? "has-error" : ""
            }`}
            style={{ position: "relative" }}
          >
            <label className="zent-form-label zent-form-label-required">
              نام‌ و‌ نام خانوادگی
            </label>
            <div className="zent-form-control-content">
              <Input
                ref={(ref) => (inputRef = ref)}
                onChange={onPressEnter}
                defaultValue={customerName}
              />
              {nameSuggestion.length > 0 && (
                <Suggestions>
                  {nameSuggestion.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="items"
                        onClick={() => setCustomerInformation(item)}
                      >
                        {item.fullName}
                      </div>
                    );
                  })}
                </Suggestions>
              )}
              {form.state.submitting && !customerName ? (
                <div className="zent-form-error zent-font-small">
                  نام‌ و‌ نام خانوادگی را وارد نمایید.
                </div>
              ) : null}
            </div>
          </div>
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
              maxLength: 11,
              minLength: 11,
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
              onChange={(value) => setOrderCount(value)}
              showStepper
              value={orderCount}
              min={0}
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
            rowKey={"dateObject"}
            emptyLabel={"هیچ محصولی یافت نشده است."}
          />
        </div>
        <div className="zent-form-row">
          <FormSelectField
            name="brandId"
            label="برند"
            props={{
              placeholder: "برند را انتخاب کنید",
              data: brands,
              autoWidth: true,
              optionText: "name",
              optionValue: "id",
            }}
            // validateOccasion={
            //   Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            // }
            // validators={[Validators.required("برند محصول را وارد نمایید.")]}
            // required="Required"
          />
          <FormSelectField
            name="orderStatus"
            label="نوع سفارش"
            props={{
              placeholder: "نوع سفارش را انتخاب کنید",
              data: [
                { id: 1, name: "آنلاین" },
                { id: 2, name: "کاستوم" },
                { id: 3, name: "اینستاگرام" },
                { id: 4, name: "حضوری" },
              ],
              autoWidth: true,
              optionText: "name",
              optionValue: "id",
            }}
          />
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
                  numeralThousandsGroupStyle: "thousand",
                }}
                onChange={(e) => setPrice(e.target.rawValue)}
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
        <FormCheckboxField
          name="hasDeliverCost"
          label="هزینه ارسال به عهده مشتری"
        >
          بله
        </FormCheckboxField>
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

const Suggestions = styled.div`
  position: absolute;
  top: 70px;
  right: 0;
  left: 0;
  max-height: 250px;
  overflow: auto;
  max-width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #ddd;
  z-index: 10;
  .items {
    display: block;
    padding: 8px 10px;
    border-bottom: 1px solid #eee;
    font-size: 13px;
    font-weight: bold;
    color: #444;
    transition: color 280ms ease-in background-color 280ms ease-in;
    cursor: pointer;
    :hover {
      background-color: #eee;
      color: #222;
      transition: color 280ms ease-in background-color 280ms ease-in;
    }
    :last-child {
      border-bottom: 0;
    }
  }
`;

export default AddOrder;
