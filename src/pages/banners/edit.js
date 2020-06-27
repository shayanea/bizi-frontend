import React, { useState, useEffect } from "react";
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

import { editBanner, fetchSingleBanner } from "../../services/bannerService";
import axios from "../../utils/axios";

const AddTransaction = ({ history, match }) => {
	const form = Form.useForm(FormStrategy.View);
	const [isLoading, setLoading] = useState(false);
	const [images, setImage] = useState([]);

	useEffect(() => {
		fetchSingleBanner(match.params.id).then((res) => {
			const { title, description, image } = res.data;
			form.patchValue({
				title,
				description,
			});
			setImage(image);
		});
	}, [form]);

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
			title,
			description,
		} = form.getValue();
		editBanner({
			title,
			image: images,
			description,
		}, match.params.id)
			.then((res) => {
				Notify.success("بنر مورد نظر با موفقیت به روز رسانی گردید.", 4000);
				return history.replace("/banners");
			})
			.catch((err) =>
				Notify.error("در به روز رسانی بنر جدید مشکل به وجود آمده است.", 4000)
			);
	};

	return (
		<Container className="animated fadeIn">
			<h1>ویرایش بنر</h1>
			<Form
				layout={"vertical"}
				form={form}
				onSubmit={submit}
				disableEnterSubmit={false}
			>
				<div className="zent-form-row">
					<FormInputField
						name="title"
						label="عنوان"
						validateOccasion={
							Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
						}
						validators={[
							Validators.required("عنوان را وارد نمایید."),
						]}
						required="Required"
					/>
					<FormInputField
						name="description"
						label="توضیخات"
						props={{
							type: "textarea",
							autoWidth: true,
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

export default AddTransaction;
