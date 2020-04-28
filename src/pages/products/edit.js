import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FormInputField,
  FormSelectField,
  FormSwitchField,
  Form,
  FormStrategy,
  Validators,
  Button,
  Notify,
  ImageUpload,
} from "zent";
import Cleave from "cleave.js/react";

import { editProduct, fetchSingleProduct } from "../../services/productService";
import { addWarehouseLog } from "../../services/warehouselogService";
import { renderSize } from "../../utils/services";

const EditProduct = ({ history, match }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);
  const [isContentLoaded, setContentLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [productionCost, setProductionCost] = useState(0);
  const [oldCount, setOldCount] = useState(0);
  const [images, setImage] = useState([]);

  useEffect(() => {
    fetchSingleProduct(match.params.id).then((res) => {
      const {
        name,
        color,
        size,
        material,
        price,
        count,
        description,
        productionCost,
        serialNumber,
        image,
        isAvailable,
      } = res.data;
      form.patchValue({
        name,
        color,
        size,
        material,
        count,
        description,
        serialNumber,
        isAvailable,
      });
      setOldCount(count);
      setPrice(price);
      setProductionCost(productionCost);
      setImage(image);
    });
  }, []);

  const onUploadChange = (files) => {
    console.log(files);
  };

  const onUpload = (file, report) => {
    console.log(file, report);
  };

  const onUploadError = (type, data) => {
    if (type === "overMaxAmount") {
      Notify.error(`حداکثر تعداد آپلود فایل ${data.maxAmount} است.`);
    } else if (type === "overMaxSize") {
      Notify.error(`حداکثر حجم فایل ${data.formattedMaxSize} است.`);
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
      productionCost,
      serialNumber,
      isAvailable,
    } = form.getValue();
    editProduct(
      {
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
        isAvailable,
      },
      match.params.id
    )
      .then((res) => {
        if (oldCount !== count) {
          return addWarehouseLog({
            status: oldCount > count ? 2 : 1,
            name: `${name} (رنگ: ${color} - سایز: ${renderSize(size)})`,
            count:
              count > oldCount
                ? Number(count) - Number(oldCount)
                : Number(oldCount) - Number(count),
            object: [res.data],
            ownerId: res.data.id,
          }).then((res) => {
            Notify.success(
              "محصول مورد نظر با موفقیت به روز رسانی گردید.",
              4000
            );
            return history.replace("/products");
          });
        }
        return (
          Notify.success("محصول مورد نظر با موفقیت به روز رسانی گردید.", 4000),
          history.replace("/products")
        );
      })
      .catch((err) =>
        Notify.error("در به روز رسانی محصول شما مشکل به وجود آمده است.", 4000)
      );
  };

  return (
    <Container className="animated fadeIn">
      <h1>ویرایش محصول</h1>
      {/* {isContentLoaded && ( */}
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
                { value: 7, text: "XXXL" },
              ],
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
                value={price}
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
                onChange={(e) => setPrice(e.target.rawValue)}
                value={productionCost}
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
        <div className="product-slider">
          {images.map((item) => {
            return (
              <div className="items" key={item.id}>
                <img
                  src={`http://localhost:1337/${item.url}`}
                  alt={item.name}
                />
              </div>
            );
          })}
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
        <div className="zent-form-row">
          <FormSwitchField
            name="isAvailable"
            label="موجود در فروشگاه"
            defaultValue={false}
          />
        </div>
        <Button htmlType="submit" type="primary" loading={isLoading}>
          به روز رسانی
        </Button>
      </Form>
      {/* )} */}
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

export default EditProduct;
