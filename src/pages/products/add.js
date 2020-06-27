import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
	FormInputField,
	FormSelectField,
	FormSwitchField,
	Input,
	NumberInput,
	Form,
	FormStrategy,
	Validators,
	Button,
	Notify,
	ImageUpload,
	Sweetalert,
	Affix,
} from "zent";
import Select from "react-select";

import { withBaseIcon } from "react-icons-kit";
import { plus } from "react-icons-kit/feather/plus";
import { trash2 } from "react-icons-kit/feather/trash2";
import Cleave from "cleave.js/react";

import { addProduct, fetchBrands } from "../../services/productService";
import { addWarehouseLog } from "../../services/warehouselogService";
import axios from "../../utils/axios";
import { sizeArrayForSelect } from "../../utils/services";
import { useStateValue } from "../../context/state";

const Icon = withBaseIcon({ size: 20, style: { color: "#fff" } });

const uuidv4 = () => {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

const AddProduct = ({ history, ...rest }) => {
	const [{ profile }] = useStateValue();
	const form = Form.useForm(FormStrategy.View);
	const [isLoading, setLoading] = useState(false);
	const [price, setPrice] = useState(0);
	const [brands, setBrands] = useState([]);
	const [productionCost, setProductionCost] = useState(0);
	const [images, setImage] = useState([]);
	const [attributes, setAttributes] = useState([]);
	const [newRow, setNewRow] = useState({
		id: uuidv4(),
		size: 0,
		color: "",
		count: 0,
	});

	useEffect(() => {
		fetchBrands()
			.then((res) => setBrands(res.data))
			.catch((err) => console.log(err));
	}, []);

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

	const addAttributes = (type, value) => {
		if (value) {
			switch (Number(type)) {
				case 1:
					newRow["color"] = value;
					return setNewRow(newRow);
				case 2:
					newRow["size"] = value;
					return setNewRow(newRow);
				case 3:
					newRow["count"] = value;
					return setNewRow(newRow);
				default:
					return null;
			}
		}
	};

	const addRow = () => {
		attributes.push(newRow);
		setAttributes(attributes);
		setNewRow({ id: uuidv4(), color: "", size: 0, count: 0 });
	};

	const updateAttributes = (id, type, value) => {
		if (value) {
			let result = null;
			switch (Number(type)) {
				case 1:
					result = attributes.find((item) => item.id === id);
					result["color"] = value;
					return setAttributes(attributes);
				case 2:
					result = attributes.find((item) => item.id === id);
					result["size"] = value;
					return setAttributes(attributes);
				case 3:
					result = attributes.find((item) => item.id === id);
					result["count"] = value;
					return setAttributes(attributes);
				default:
					return null;
			}
		}
	};

	const removeRow = (id) => {
		Sweetalert.confirm({
			confirmType: "success",
			confirmText: "بله",
			cancelText: "خیر",
			content: "آیا از حذف این آیتم مطمئن هستید ؟",
			title: "توجه",
			className: "custom-sweetalert",
			maskClosable: true,
			parentComponent: this,
			onConfirm: () => {
				let items = attributes.filter((item) => item.id !== id);
				return setAttributes(items);
			},
		});
	};

	const haveAccess = () => {
		if (profile) {
			let result = ["authenticated", "manager"].find(
				(item) => item === profile.role.type
			);
			return result ? true : false;
		}
		return false;
	};

	const submit = () => {
		if (attributes.length > 0) {
			setLoading(true);
			const {
				name,
				material,
				description,
				serialNumber,
				isAvailable,
				brandId,
				gender,
				isComingSoon,
			} = form.getValue();
			addProduct({
				name,
				material,
				price,
				image: images,
				description,
				productionCost,
				serialNumber,
				isAvailable,
				brandId,
				gender,
				isComingSoon,
				attributes,
			})
				.then((res) => {
					attributes.forEach((item) => {
						return addWarehouseLog({
							name: `${name} (رنگ: ${item.color} - سایز: ${item.size.label})`,
							count: item.count,
							status: 1,
							object: [res.data],
							ownerId: res.data.id,
						}).then((res) => {
							return history.replace("/products");
						});
					});
				})
				.catch((err) =>
					Notify.error("در ثبت محصول جدید مشکل به وجود آمده است.", 4000)
				);
		} else {
			Notify.error("مشخصات محصول را وارد نمایید.", 4000);
		}
	};

	return (
		<Container className="animated fadeIn">
			<h1>درج محصول</h1>
			<Form
				layout={"vertical"}
				form={form}
				onSubmit={submit}
				disableEnterSubmit={false}
			>
				<div className="zent-form-row">
					<FormInputField
						name="name"
						label="نام"
						validateOccasion={
							Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
						}
						validators={[Validators.required("نام محصول را وارد نمایید.")]}
						required="Required"
					/>
					<FormInputField
						name="material"
						label="جنس"
						validateOccasion={
							Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
						}
						validators={[Validators.required("جنس محصول را وارد نمایید.")]}
						required="Required"
					/>
					{/* {haveAccess() && ( */}
					<div
						className={`zent-form-control ${
							form.state.submitting && !price ? "has-error" : ""
							}`}
					>
						<label className="zent-form-label zent-form-label-required">
							قیمت (تومان)
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
									قیمت محصول را وارد نمایید.
								</div>
							) : null}
						</div>
					</div>
					{/* )} */}
				</div>
				<div className="zent-form-row">
					<FormInputField name="serialNumber" label="شماره سریال" />
					{haveAccess() && (
						<div
							className={`zent-form-control ${
								form.state.submitting && !price ? "has-error" : ""
								}`}
						>
							<label className="zent-form-label zent-form-label-required">
								قیمت تولید (تومان)
              </label>
							<div className="zent-form-control-content">
								<Cleave
									className="zent-input  numeric-input"
									options={{
										numeral: true,
										numeralThousandsGroupStyle: "thousand",
									}}
									onChange={(e) => setProductionCost(e.target.rawValue)}
								/>
								{form.state.submitting && !price ? (
									<div className="zent-form-error zent-font-small">
										قیمت محصول را وارد نمایید.
									</div>
								) : null}
							</div>
						</div>
					)}
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
					<FormSelectField
						name="gender"
						label="جنسیت"
						props={{
							placeholder: "جنسیت را انتخاب کنید",
							data: [
								{ id: 1, name: "مردانه" },
								{ id: 2, name: "زنانه" },
								{ id: 3, name: "یونیسکس" },
							],
							autoWidth: true,
							optionText: "name",
							optionValue: "id",
						}}
					/>
					<FormSelectField
						name="brandId"
						label="برند"
						props={{
							placeholder: "برند را انتخاب کنید",
							data: brands,
							autoWidth: true,
							optionText: "name",
							optionValue: "id",
						}}
						validateOccasion={
							Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
						}
						validators={[Validators.required("برند محصول را وارد نمایید.")]}
						required="Required"
					/>
					{haveAccess() && (
						<FormSwitchField
							name="isAvailable"
							label="موجود در فروشگاه"
							defaultValue={false}
						/>
					)}
					{haveAccess() && (
						<FormSwitchField
							name="isComingSoon"
							label="به زودی"
							defaultValue={false}
						/>
					)}
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
				<div className="zent-form-row">
					<div className="zent-form-control">
						<label className="zent-form-label zent-form-label-required">
							رنگ
            </label>
						<Input
							type="text"
							onChange={(e) => addAttributes(1, e.target.value)}
						/>
					</div>
					<div className="zent-form-control">
						<label className="zent-form-label zent-form-label-required">
							سایز
            </label>
						<Select
							className="zent-select"
							placeholder="سایز را انتخاب کنید"
							options={sizeArrayForSelect}
							onChange={(e) => addAttributes(2, e)}
						/>
					</div>
					<div className="zent-form-control">
						<label className="zent-form-label zent-form-label-required">
							تعداد
            </label>
						<NumberInput
							onChange={(value) => addAttributes(3, value)}
							showStepper
							min={0}
						/>
					</div>
					<Plus onClick={addRow}>
						<Icon icon={plus} />
					</Plus>
				</div>
				<Affix offsetTop={5}>
					<div className="zent-form-row" style={{ backgroundColor: "#fff" }}>
						<div className="zent-form-control">
							<label className="zent-form-label zent-form-label-required">
								رنگ
              </label>
						</div>
						<div className="zent-form-control">
							<label className="zent-form-label zent-form-label-required">
								سایز
              </label>
						</div>
						<div className="zent-form-control">
							<label className="zent-form-label zent-form-label-required">
								تعداد
              </label>
						</div>
					</div>
				</Affix>
				{attributes.map((item, index) => {
					console.log(item);
					return (
						<div
							className="zent-form-row"
							style={{ marginBottom: "15px" }}
							key={item.id}
						>
							<div className="zent-form-control">
								<Input
									name="color"
									type="text"
									onChange={(e) => updateAttributes(item.id, 1, e.target.value)}
									value={item.color}
								/>
							</div>
							<div className="zent-form-control">
								<Select
									className="zent-select"
									placeholder="سایز را انتخاب کنید"
									options={sizeArrayForSelect}
									onChange={(e) => updateAttributes(item.id, 2, e)}
									value={item.size}
								/>
							</div>
							<div className="zent-form-control">
								<NumberInput
									onChange={(value) => updateAttributes(item.id, 3, value)}
									showStepper
									min={0}
									value={item.count}
								/>
							</div>
							<Delete onClick={() => removeRow(item.id)}>
								<Icon icon={trash2} />
							</Delete>
						</div>
					);
				})}
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

const Plus = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: #444;
  margin-top: 30px;
  cursor: pointer;
`;

const Delete = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: #df4545;
  cursor: pointer;
`;

export default AddProduct;
