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
} from "zent";
import Cleave from "cleave.js/react";

import { addSalaries, fetchEmployees } from "../../services/salariesService";
import { addTransaction } from "../../services/transactionService";

const AddTransaction = ({ history }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [staffs, setStaffs] = useState([]);

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
