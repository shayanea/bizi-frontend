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

import {
  fetchSingleTransaction,
  updateTransaction,
} from "../../services/transactionService";

const EditTransaction = ({ history, match }) => {
  const form = Form.useForm(FormStrategy.View);
  const [isLoading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    fetchSingleTransaction(match.params.id).then((res) => {
      const { name, price, status, description } = res.data;
      form.patchValue({
        name,
        price,
        status,
        description,
      });
      setPrice(price);
    });
  }, [form]);

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
              هزینه (تومان)
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
                  هزینه محصول را وارد نمایید.
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
