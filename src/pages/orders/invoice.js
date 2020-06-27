import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Grid, Notify, BlockHeader } from "zent";
import { fetchSingleOrder } from "../../services/orderService";
import moment from "jalali-moment";

import Logo1 from "../../assets/img/bizi-logo.png";
import Logo2 from "../../assets/img/snb-logo.png";

const Print = ({ match, history }) => {
	const [items, setItems] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [owner, setOwner] = useState("");
	const owners = [
		{
			id: 1,
			name: "___bizi___",
		},
		{
			id: 2,
			name: "___snb___",
		},
	];



	useEffect(() => {
		let result = owners.find(item => item.id === Number(getParameterByName("q")));
		fetchSingleOrder(match.params.id)
			.then((res) => {
				setItems(res.data);
				setOwner(result ? result : "")
				setLoading(false);
			})
			.catch((err) => {
				Notify.error(
					"در برقراری ارتباط مشکلی به وجود آمده است، مجددا تلاش نمایید."
				);
			});
	}, []);

	const getParameterByName = (name, url) => {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	const renderTotalPrice = () => {
		let total = 0;
		items.orderItems.forEach(
			(item) => (total += Number(item.price) * Number(item.orderCount))
		);
		if (Number(items.shippingCost) > 0) {
			total += Number(items.shippingCost);
		}
		return total.toLocaleString("fa");
	};

	const renderPhoneNumber = () => {
		if (!isLoading) {
			let text = items.mobileNumber.toString();
			return text.charAt(0) === "9" ? `0${text}` : text;
		}
	};

	const renderLogo = () => {
		if (owner) {
			switch (owner.id) {
				case 1:
					return Logo1;
				case 2:
					return Logo2;
				default:
					return "";
			}
		}
		return "";
	};

	const orders = [
		{
			title: "نام محصول",
			name: "name",
			bodyRender: (data) => {
				return `${data.name}`;
			},
		},
		{
			title: "قیمت",
			bodyRender: (data) => {
				return `${Number(data.price).toLocaleString("fa")} تومان`;
			},
		},
		{
			title: "تعداد",
			bodyRender: (data) => {
				return data.orderCount;
			},
		},
		{
			title: "قیمت کل",
			bodyRender: (data) => {
				return `${(Number(data.price) * Number(data.orderCount)).toLocaleString(
					"fa"
				)} تومان`;
			},
		},
		{
			title: "",
		},
	];

	return (
		<Container>
			<Row>
				<GeneralInformation>
					{owner && (
						<div className="box">
							<img src={renderLogo()} className="image" alt={owner.name} />
						</div>
					)}
				</GeneralInformation>
				<GeneralInformation>
					<div className="box">
						<h2>شماره فاکتور: {items.invoiceNumber}</h2>
						<h3>تاریخ: {moment().locale("fa").format("YYYY/M/D - HH:mm")}</h3>
					</div>
				</GeneralInformation>
			</Row>
			<Row>
				<GeneralInformation>
					<h2>مشخصات فروشنده</h2>
					<p>نام فروشنده: {owner.name}</p>
					<p>تلفن: 021 -  88205631 </p>
					<span style={{ direction: "ltr" }}>0922 104 1954</span>
				</GeneralInformation>
				<GeneralInformation>
					<h2>مشخصات خریدار</h2>
					<p>نام خریدار: {items.fullName} </p>
					<p>تلفن: {renderPhoneNumber()}</p>
					<p>آدرس: {items.address}</p>
				</GeneralInformation>
			</Row>
			<Grid
				columns={orders}
				datasets={items.orderItems}
				emptyLabel={"هیچ سفارشی یافت نشده است."}
				loading={isLoading}
			/>
			{!isLoading && (
				<div className="zent-form-row" style={{ flexDirection: "column" }}>
					<BlockHeader
						type="minimum"
						title={`${items.description}`}
					></BlockHeader>
					{Number(items.shippingCost) !== 0 && !items.hasDeliverCost ? (
						<BlockHeader
							type="minimum"
							title={`هزینه ارسال : ${Number(items.shippingCost).toLocaleString(
								"fa"
							)} تومان`}
						></BlockHeader>
					) : (
							<BlockHeader
								type="minimum"
								title={"هزینه ارسال: به عهده مشتری"}
							></BlockHeader>
						)}

					<BlockHeader
						type="minimum"
						title={`هزینه کل: ${renderTotalPrice()} تومان`}
					></BlockHeader>
					<BlockHeader
						type="minimum"
						title={`هزینه کلی با تخفیف: ${Number(
							items.priceWithDiscount
						).toLocaleString("fa")} تومان`}
					></BlockHeader>
					<BlockHeader
						type="minimum"
						title="لطفا مبلغ فاكتور را به شماره كارت ٥٠٢٢٢٩١٠٨٤٠٤٠٥١٦ بنام بابك زرين
            قبا بانك پاسارگاد واريز نماييد"
					></BlockHeader>
				</div>
			)}
		</Container>
	);
};

const Container = styled.div`
  position: relative;
	margin: 30px auto;
	display: block;
  max-width: 86%;
  background-color: #fff;
  .zent-btn {
    margin-top: 30px;
    margin-right: 15px;
    margin-bottom: 15px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
	@media(max-width: 550px) {
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
	}
`;

const GeneralInformation = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  flex: 1;
  :last-of-type {
    border-bottom: 0px;
  }
  .box {
    display: inline-flex;
    flex: 1;
    margin-bottom: 15px;
    flex-direction: column;
    .image {
      display: inline-block;
      width: 80px;
      height: 80px;
      object-fit: contain;
      object-position: center;
    }
  }
  .box:last-child {
    margin-left: 0;
  }
  h2 {
    margin-bottom: 10px;
    font-size: 1.3em;
    color: #000;
  }
  p {
    font-size: 1.1em;
    color: #333;
    margin-bottom: 10px;
  }
  .zent-form-control {
    margin-bottom: 10px;
  }
`;

export default Print;
