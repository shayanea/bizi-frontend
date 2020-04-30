/* eslint-disable no-useless-escape */
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
} from "zent";

import { fetchSingleUsers, editUser } from "../../services/userService";

const EditUser = ({ history, match }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchSingleUsers(match.params.id).then((res) => {
      const { fullName, email, mobileNumber, blocked, role } = res.data;
      form.patchValue({
        fullName,
        email,
        mobileNumber,
        role: role.type,
        blocked,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const submit = () => {
    setLoading(true);
    const { fullName, email, mobileNumber, blocked, role } = form.getValue();
    editUser({ fullName, email, mobileNumber, blocked, role }, match.params.id)
      .then((res) => {
        Notify.success(
          "کاربر مورد نظر با موفقیت به روز رسانی گردید گردید.",
          4000
        );
        return history.replace("/users");
      })
      .catch((err) =>
        Notify.error("در ثبت کاربر جدید مشکل به وجود آمده است.", 4000)
      );
  };

  return (
    <Container className="animated fadeIn">
      <h1>ویرایش کاربر</h1>
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
            name="email"
            label="ایمیل"
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[
              Validators.required("ایمیل را وارد نمایید."),
              Validators.email("ایمیل خود را به درستی وارد نمایید."),
            ]}
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
          <FormSelectField
            name="role"
            label="نوع کاربر"
            props={{
              placeholder: "نوع کاربر را انتخاب کنید",
              data: [
                { value: "5e43aad2763550c66de25847", text: "ادمین" },
                { value: "5e4c5e5860810adcb25ae728", text: "عادی" },
              ],
              autoWidth: true,
            }}
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("نوع کاربر را وارد نمایید.")]}
            required="Required"
          />
        </div>
        <div className="zent-form-row">
          <FormSwitchField name="blocked" label="بلاک" defaultValue={false} />
        </div>
        <Button htmlType="submit" type="primary" loading={isLoading}>
          به روز رسانی
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

export default EditUser;
