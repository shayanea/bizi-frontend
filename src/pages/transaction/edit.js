import React, { useState, useEffect } from "react";
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
  previewImage,
} from "zent";
import Cleave from "cleave.js/react";

import {
  fetchSingleTransaction,
  updateTransaction,
} from "../../services/transactionService";
import axios from "../../utils/axios";

const EditTransaction = ({ history, match }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [images, setImage] = useState([]);

  useEffect(() => {
    fetchSingleTransaction(match.params.id).then((res) => {
      const { name, price, status, description, picture } = res.data;
      form.patchValue({
        name,
        price,
        status,
        description,
      });
      setPrice(price);
      setImage(picture);
    });
  }, [form]);

  const onUploadChange = (files) => {
    console.log(files);
  };

  const onUpload = (file, report) => {
    let formData = new FormData();
    formData.append("files", file, file.name);
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

  const handlePreview = (e) => {
    let imgArr = images.map((item) => {
      return process.env.NODE_ENV === "production"
        ? `http://78.47.89.182/${item.url}`
        : `http://localhost:1337/${item.url}`;
    });
    previewImage({
      images: imgArr,
      index: imgArr.indexOf(e.target.src),
      parentComponent: this,
      showRotateBtn: false,
      scaleRatio: 3,
    });
  };

  const submit = () => {
    setLoading(true);
    const { name, status, description } = form.getValue();
    updateTransaction(
      {
        name,
        price,
        status,
        description,
      },
      match.params.id
    )
      .then((res) => {
        Notify.success("تراکنش مورد نظر با موفقیت ثبت گردید.", 4000);
        return history.replace("/transactions");
      })
      .catch((err) =>
        Notify.error("در ثبت تراکنش جدید مشکل به وجود آمده است.", 4000)
      );
  };

  return (
    <Container className="animated fadeIn">
      <h1>ویرایش تراکنش</h1>
      <Form
        layout={"vertical"}
        form={form}
        onSubmit={submit}
        disableEnterSubmit={false}
      >
        <div className="zent-form-row">
          <FormInputField
            name="name"
            label="عنوان"
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("عنوان تراکنش را وارد نمایید.")]}
            required="Required"
          />
          <div
            className={`zent-form-control ${
              form.state.submitting && !price ? "has-error" : ""
            }`}
          >
            <label className="zent-form-label zent-form-label-required">
              مبلغ (تومان)
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
                  مبلغ را وارد نمایید.
                </div>
              ) : null}
            </div>
          </div>
          <FormSelectField
            name="status"
            label="نوع تراکنش"
            props={{
              placeholder: "نوع را انتخاب کنید",
              data: [
                { value: 1, text: "پرداختی" },
                { value: 2, text: "دریافتی" },
                { value: 3, text: "حقوق" },
                { value: 4, text: "پاداش" },
              ],
              autoWidth: true,
            }}
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("نوع تراکنش را انتخاب کنید.")]}
            required="Required"
          />
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
        <div className="product-slider">
          {images.map((item) => {
            return (
              <div className="items" key={item.id} onClick={handlePreview}>
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
          <div className="zent-form-control"></div>
          <div className="zent-form-control"></div>
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

export default EditTransaction;
