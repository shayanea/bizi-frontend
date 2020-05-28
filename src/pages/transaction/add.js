import React, { useState } from "react";
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
import moment from "jalali-moment";
import DatePicker from "react-datepicker2";

import { addTransaction } from "../../services/transactionService";
import axios from "../../utils/axios";

const AddTransaction = ({ history }) => {
	const form = Form.useForm(FormStrategy.View);
	const [isLoading, setLoading] = useState(false);
	const [price, setPrice] = useState(0);
	const [images, setImage] = useState([]);
	const [startDateTime, setStartDateTime] = useState(moment());
	const enabledRange = {};

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
		const {
			name,
			status,
			description,
			images,
			transactionType,
		} = form.getValue();
		addTransaction({
			name,
			price,
			status,
			description,
			picture: images,
			transactionType,
			cutomeDate: startDateTime,
			orderId: "0",
		})
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
			<h1>درج تراکنش</h1>
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
							/>
							{form.state.submitting && !price ? (
								<div className="zent-form-error zent-font-small">
									مبلغ را وارد نمایید.
								</div>
							) : null}
						</div>
					</div>
				</div>
				<div className="zent-form-row">
					<FormSelectField
						name="transactionType"
						label="توسط"
						props={{
							placeholder: "نوع را انتخاب کنید",
							data: [
								{ value: 1, text: "آقای زرین قبا" },
								{ value: 2, text: "آقای نیک خواه بهرامی" },
								{ value: 3, text: "خانم فیض" },
							],
							autoWidth: true,
						}}
					/>
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
					<div className="zent-form-control">
						<label className="zent-form-label">تاریخ ثبت</label>
						<DatePicker
							min={enabledRange.min}
							isGregorian={false}
							timePicker={false}
							value={startDateTime}
							onChange={(startDateTime) => setStartDateTime(startDateTime)}
							className={"zent-input"}
						/>
					</div>
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
