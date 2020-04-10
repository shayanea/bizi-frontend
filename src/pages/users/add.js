/* eslint-disable no-useless-escape */
import React, { useState } from "react";
import styled from "styled-components";
import {
  FormInputField,
  FormSelectField,
  Form,
  FormStrategy,
  Validators,
  Button,
  Notify
} from "zent";

import { addUser } from "../../services/userService";

const AddUser = ({ history }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    const {
      fullName,
      email,
      mobileNumber,
      username,
      password,
      role
    } = form.getValue();
    addUser({
      fullName,
      email,
      mobileNumber,
      username,
      password,
      role,
      confirmed: true
    })
      .then(res => {
        Notify.success("کاربر مورد نظر با موفقیت ثبت گردید.", 4000);
        return history.replace("/users");
      })
      .catch(err =>
        Notify.error("در ثبت کاربر جدید مشکل به وجود آمده است.", 4000)
      );
  };

  return (
    <Container className="animated fadeIn">
      <h1>درج کاربر</h1>
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
            name="email"
            label="ایمیل"
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[
              Validators.required("ایمیل را وارد نمایید."),
              Validators.email("ایمیل خود را به درستی وارد نمایید.")
            ]}
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
          <FormInputField
            name="username"
            label="نام کاربری"
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("نام کاربری را وارد نمایید.")]}
            required="Required"
          />
          <FormInputField
            name="password"
            label="رمز عبور"
            props={{
              minLength: 6,
              type: "password"
            }}
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[
              Validators.required("رمز عبور را وارد نمایید."),
              Validators.minLength("حداقل ۶ کاراکتر باید وارد کنید.")
            ]}
            // helpDesc="رمز عبور باید دارای ۶ کاراکتر باشد."
            required="Required"
          />
          <FormSelectField
            name="role"
            label="نوع کاربر"
            props={{
              placeholder: "نوع کاربر را انتخاب کنید",
              data: [
                { value: "5e43aad2763550c66de25847", text: "ادمین" },
                { value: "5e4c5e5860810adcb25ae728", text: "عادی" }
              ],
              autoWidth: true
            }}
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("نوع کاربر را وارد نمایید.")]}
            required="Required"
          />
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

export default AddUser;
