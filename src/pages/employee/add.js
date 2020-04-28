import React, { useState } from "react";
import styled from "styled-components";
import {
  FormInputField,
  Form,
  FormStrategy,
  Validators,
  Button,
  Notify,
} from "zent";

import { addEmployee } from "../../services/employeeService";

const AddEmployee = ({ history }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    const { fullName, address } = form.getValue();
    addEmployee({
      fullName,
      address,
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
          <FormInputField
            name="address"
            label="آدرس"
            props={{
              type: "textarea",
              rows: "5",
            }}
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

export default AddEmployee;
