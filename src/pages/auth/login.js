import React, { useState } from "react";
import styled from "styled-components";
import { login } from "../../services/authService";

import bg from "../../assets/img/bg.jpeg";
import {
  FormInputField,
  Form,
  FormStrategy,
  Validators,
  Button,
  Notify,
} from "zent";

const Login = ({ history }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    login(form.getValue())
      .then((res) => {
        localStorage.setItem("@token", res.data.jwt);
        localStorage.setItem("@userInfo", res.data.user);
        if (res.data.user.role.type === "manager") {
          return history.push("/orders");
        }
        if (res.data.user.role.type === "staff") {
          return history.push("/products");
        }
        if (res.data.user.role.type === "authenticated") {
          return history.push("/");
        }
        return history.push("/");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 400) {
          Notify.error("نام کاربری یا رمز عبور شما اشتباه است.", 4000);
        } else {
          Notify.error("در برقراری ارتباط مشکلی به وجود آمده است.", 4000);
        }
      });
  };

  return (
    <BackgroundContainer className="animated fadeIn">
      <FormContainer className="animated fadeIn">
        <h1>ورود به سامانه</h1>
        <Form
          layout={"vertical"}
          form={form}
          onSubmit={submit}
          disableEnterSubmit={false}
        >
          <FormInputField
            name="identifier"
            label="نام کاربری"
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("نام کاربری خود را وارد نمایید.")]}
            required="Required"
          />
          <FormInputField
            name="password"
            props={{
              type: "password",
            }}
            label="رمز عبور"
            validateOccasion={
              Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
            }
            validators={[Validators.required("رمز عبور خود را وارد نمایید.")]}
            required="Required"
          />
          <Button htmlType="submit" type="primary" loading={isLoading}>
            ورود
          </Button>
        </Form>
      </FormContainer>
    </BackgroundContainer>
  );
};

const BackgroundContainer = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  ::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 5;
  }
  ::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url(${bg});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
`;

const FormContainer = styled.div`
  position: relative;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
  width: 300px;
  padding: 25px;
  z-index: 10;
  h1 {
    font-size: 2em;
    color: #444;
    margin-bottom: 25px;
    text-align: center;
  }
  .zent-input--size-normal {
    width: 100%;
    border-radius: 6px;
  }
  .zent-btn {
    border-radius: 6px;
    background-color: #000;
    border-color: #000;
    color: #fff;
  }
`;

export default Login;
