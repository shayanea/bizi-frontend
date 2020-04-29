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
} from "zent";
import Cleave from "cleave.js/react";

import { addSalaries, fetchEmployees } from "../../services/salariesService";
import { addTransaction } from "../../services/transactionService";
import axios from "../../utils/axios";

const AddTransaction = ({ history }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [staffs, setStaffs] = useState([]);
  const [images, setImage] = useState([]);

  useEffect(() => {
    fetchEmployees()
      .then((res) => {
        let result = [];
        res.data.forEach((item) => {
          result.push({ value: item.id, text: item.fullName });
        });
        setStaffs(result);
      })
      .catch((err) => console.log(err));
  }, []);

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

  const renderStaffByName = (id) => {
    let result = staffs.find((item) => item.value === id);
    return result ? result.text : "";
  };

  const submit = () => {
    setLoading(true);
    const {
      staffId,
      depositor,
      bankNumber,
      serialNumber,
      description,
    } = form.getValue();
    addSalaries({
      staffId,
      price,
      depositor,
      bankNumber,
      serialNumber,
      description,
      picture: images,
    })
      .then((res) => {
        addTransaction({
          name: `واریز حقوق ${renderStaffByName(staffId)}`,
          price,
          status: 3,
          description,
        })
          .then((res) => {
            Notify.success("تراکنش مورد نظر با موفقیت ثبت گردید.", 4000);
            return history.replace("/salaries");
          })
          .catch((err) =>
            Notify.error("در ثبت تراکنش جدید مشکل به وجود آمده است.", 4000)
          );
      })
      .catch((err) =>
        Notify.error("در ثبت تراکنش جدید مشکل به وجود آمده است.", 4000)
      );
  };

  return (
    <Container className="animated fadeIn">
      <h1>درج حقوق</h1>
      <Form
        layout={"vertical"}
        form={form}
        onSubmit={submit}
        disableEnterSubmit={false}
      >
        <div className="zent-form-row">
          <FormInputField
            name="serialNumber"
            label="شماره تراکنش بانک"
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[
              Validators.required("شماره تراکنش تراکنش را وارد نمایید."),
            ]}
            required="Required"
          />
          <FormSelectField
            name="staffId"
            label="نام کارمند"
            props={{
              placeholder: "نام کارمند خود را انتخاب کنید",
              data: staffs,
              autoWidth: true,
            }}
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("نوع تراکنش را انتخاب کنید.")]}
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
              />
              {form.state.submitting && !price ? (
                <div className="zent-form-error zent-font-small">
                  مبلغ محصول را وارد نمایید.
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="zent-form-row">
          <FormInputField name="bankNumber" label="شماره بانک" />
          <FormInputField name="depositor" label="واریز کننده" />
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

export default AddTransaction;
