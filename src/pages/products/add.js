import React, { useState } from "react";
import styled from "styled-components";
import {
  FormInputField,
  FormSelectField,
  Form,
  FormStrategy,
  Validators,
  Button,
  Notify,
  ImageUpload,
} from "zent";
import Cleave from "cleave.js/react";

import { addProduct } from "../../services/productService";
import { addWarehouseLog } from "../../services/warehouselogService";
import axios from "../../utils/axios";

const AddProduct = ({ history }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [productionCost, setProductionCost] = useState(0);
  const [images, setImage] = useState([]);

  const onUploadChange = (files) => {
    console.log(files);
  };

  const onUpload = (file, report) => {
    let formData = new FormData();
    formData.append("files", file, file.name);
    console.log(file, report);
    return axios
      .post("/upload/", formData, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        images.push(res.data[0]);
        setImage(images);
      });
  };

  const onUploadError = (type, data) => {
    if (type === "overMaxAmount") {
      Notify.error(`حداکثر تعداد آپلود فایل ${data.maxAmount} است.`);
    } else if (type === "overMaxSize") {
      Notify.error(`حداکثر حجم فایل ${data.formattedMaxSize} است.`);
    }
  };

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

  const submit = () => {
    setLoading(true);
    const {
      name,
      color,
      size,
      material,
      count,
      description,
      serialNumber,
    } = form.getValue();
    addProduct({
      name,
      color,
      size,
      material,
      price,
      count,
      image: images,
      description,
      productionCost,
      serialNumber,
    })
      .then((res) => {
        return addWarehouseLog({
          name: `${name} (رنگ: ${color} - سایز: ${size.map(
            (item) => ` ${renderSize(item)} `
          )})`,
          count,
          status: 1,
          object: [res.data],
          ownerId: res.data.id,
        }).then((res) => {
          Notify.success("محصول مورد نظر با موفقیت ثبت گردید.", 4000);
          return history.replace("/products");
        });
      })
      .catch((err) =>
        Notify.error("در ثبت محصول جدید مشکل به وجود آمده است.", 4000)
      );
  };

  return (
    <Container className="animated fadeIn">
      <h1>درج محصول</h1>
      <Form
        layout={"vertical"}
        form={form}
        onSubmit={submit}
        disableEnterSubmit={false}
      >
        <div className="zent-form-row">
          <FormInputField
            name="name"
            label="نام"
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("نام محصول را وارد نمایید.")]}
            required="Required"
          />
          <FormInputField
            name="color"
            label="رنگ"
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("رنگ محصول را وارد نمایید.")]}
            required="Required"
          />
          <FormSelectField
            name="size"
            label="سایز"
            props={{
              placeholder: "سایز را انتخاب کنید",
              data: [
                { value: 1, text: "XS" },
                { value: 2, text: "S" },
                { value: 3, text: "M" },
                { value: 4, text: "L" },
                { value: 5, text: "XL" },
                { value: 6, text: "XXL" },
              ],
              tags: true,
              autoWidth: true,
            }}
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("سایز محصول را وارد نمایید.")]}
            required="Required"
          />
        </div>
        <div className="zent-form-row">
          <FormInputField
            name="material"
            label="جنس"
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("جنس محصول را وارد نمایید.")]}
            required="Required"
          />
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
              />
              {form.state.submitting && !price ? (
                <div className="zent-form-error zent-font-small">
                  قیمت محصول را وارد نمایید.
                </div>
              ) : null}
            </div>
          </div>
          <FormInputField
            name="count"
            label="موجودی"
            props={{ type: "number" }}
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("موجودی محصول را وارد نمایید.")]}
            required="Required"
          />
        </div>
        <div className="zent-form-row">
          <FormInputField name="serialNumber" label="شماره سریال" />
          <div
            className={`zent-form-control ${
              form.state.submitting && !price ? "has-error" : ""
            }`}
          >
            <label className="zent-form-label zent-form-label-required">
              قیمت تولید (تومان)
            </label>
            <div className="zent-form-control-content">
              <Cleave
                className="zent-input  numeric-input"
                options={{
                  numeral: true,
                  numeralThousandsGroupStyle: "thousand",
                }}
                onChange={(e) => setProductionCost(e.target.rawValue)}
              />
              {form.state.submitting && !price ? (
                <div className="zent-form-error zent-font-small">
                  قیمت محصول را وارد نمایید.
                </div>
              ) : null}
            </div>
          </div>
          <FormInputField
            name="description"
            label="توضحیات"
            props={{
              type: "textarea",
              rows: "5",
            }}
          />
        </div>
        <div className="zent-form-row">
          <div className="zent-form-control">
            <label className="zent-form-label zent-form-label-required">
              عکس
            </label>
            <ImageUpload
              className="zent-image-upload-demo"
              maxSize={2 * 1024 * 1024}
              maxAmount={9}
              multiple
              onChange={onUploadChange}
              onUpload={onUpload}
              onError={onUploadError}
            />
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

export default AddProduct;
