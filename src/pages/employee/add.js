import React, { useState } from "react";
import styled from "styled-components";
import {
  FormInputField,
  Form,
  FormStrategy,
  Validators,
  Button,
  Notify,
  ImageUpload,
} from "zent";

import { addEmployee } from "../../services/employeeService";
import axios from "../../utils/axios";

const AddEmployee = ({ history }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);
  const [images, setImage] = useState([]);

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

  const submit = () => {
    setLoading(true);
    const { fullName, address, phoneNumber } = form.getValue();
    addEmployee({
      fullName,
      address,
      picture: images,
      phoneNumber,
    })
      .then((res) => {
        Notify.success("کارمند مورد نظر با موفقیت ثبت گردید.", 4000);
        return history.replace("/employee");
      })
      .catch((err) =>
        Notify.error("در ثبت کارمند جدید مشکل به وجود آمده است.", 4000)
      );
  };

  return (
    <Container className="animated fadeIn">
      <h1>درج کارمند</h1>
      <Form
        layout={"vertical"}
        form={form}
        onSubmit={submit}
        disableEnterSubmit={false}
      >
        <div className="zent-form-row">
          <FormInputField
            name="fullName"
            label="نام و نام خانوادگی"
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[
              Validators.required("نام و نام خانوادگی را وارد نمایید."),
            ]}
            required="Required"
          />
        </div>
        <div className="zent-form-row">
          <FormInputField name="phoneNumber" label="شماره تماس" />
        </div>
        <div className="zent-form-row">
          <FormInputField
            name="address"
            label="آدرس"
            props={{
              type: "textarea",
              rows: "5",
            }}
          />
        </div>
        <div className="zent-form-row">
          <div className="zent-form-control">
            <label className="zent-form-label">عکس کارت ملی</label>
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

export default AddEmployee;
