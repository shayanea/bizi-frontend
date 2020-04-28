import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FormInputField,
  Form,
  FormStrategy,
  Validators,
  Button,
  Notify,
} from "zent";

import {
  fetchSingleEmployee,
  editEmployee,
} from "../../services/employeeService";

const EditEmployee = ({ history, match }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);
  // const [contentLoaded, setContentLoaded] = useState(true);

  useEffect(() => {
    fetchSingleEmployee(match.params.id).then((res) => {
      const { fullName, address } = res.data;
      form.patchValue({
        fullName,
        address,
      });
      // setContentLoaded(false);
    });
  }, [form]);

  const submit = () => {
    setLoading(true);
    const { fullName, address } = form.getValue();
    editEmployee(
      {
        fullName,
        address,
      },
      match.params.id
    )
      .then((res) => {
        Notify.success("کارمند مورد نظر با موفقیت به روز رسانی گردید.", 4000);
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
          به روز رسانی
        </Button>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
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

export default EditEmployee;
