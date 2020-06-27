import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from "zent";
import moment from "jalali-moment";
import DatePicker from "react-datepicker2";

import { fetchTotalIncomeByDate, fetchTotalIncomeByCustomDate, fetchTotalPaidSalariesByCustomDate } from '../../services/dashboardService';

import Block from "../../components/common/block";

const Reports = () => {
	const [reportsData, setReportsData] = useState({
		totalIncomeByWeek: 0,
		totalIncomeByMonth: 0,
		totalIncomeByYear: 0,
		totalIncomeByLastWeek: 0,
		isLoading: true,
	});

	const [totalIncomeByCustomDate, SetTotalIncomeByCutomDate] = useState(0);
	const [totalPaidSalariesByCustomDate, SetTotalPaidSalariesByCustomDate] = useState(0);

	const [startDateTime, setSartDateTime] = useState(null);
	const [endDateTime, setEndDateTime] = useState(null);

	useEffect(() => {
		fetchTotalIncomeByDate()
			.then((res) => {
				setReportsData({
					totalIncomeByWeek: res[0].data.total,
					totalIncomeByMonth: res[1].data.total,
					totalIncomeByYear: res[2].data.total,
					totalIncomeByLastWeek: res[3].data.total,
					isLoading: false,
				});
			})
			.catch((err) => console.log(err));
	}, []);

	const searchTotalIncomByDate = () => {
		let start = startDateTime ? moment(startDateTime).format("YYYY-MM-DD") + "T00:00:00.000Z" : null,
			end = endDateTime ? moment(endDateTime).format("YYYY-MM-DD") + "T00:00:00.000Z" : null
		fetchTotalIncomeByCustomDate(start, end).then(res => {
			SetTotalIncomeByCutomDate(res.data.total);
		})
	}

	const searchTotalPaidSalariesByDate = () => {
		let start = startDateTime ? moment(startDateTime).format("YYYY-MM-DD") + "T00:00:00.000Z" : null,
			end = endDateTime ? moment(endDateTime).format("YYYY-MM-DD") + "T00:00:00.000Z" : null
		fetchTotalPaidSalariesByCustomDate(start, end).then(res => {
			SetTotalPaidSalariesByCustomDate(res.data.total);
		})
	}


	return (
		<Container className="animated fadeIn">
			<h2>آمار‌ها</h2>
			<Row>
				<Items>
					<span className="title">فروش این هفته</span>
					<span className="order-status status2">{`${reportsData.totalIncomeByWeek.toLocaleString('fa')} تومان`}</span>
				</Items>
				<Items>
					<span className="title">فروش این ماه</span>
					<span className="order-status status2">{`${reportsData.totalIncomeByMonth.toLocaleString('fa')} تومان`}</span>
				</Items>
				<Items>
					<span className="title">فروش ماه گذشته</span>
					<span className="order-status status2">{`${reportsData.totalIncomeByLastWeek.toLocaleString('fa')} تومان`}</span>
				</Items>
				<Items>
					<span className="title">فروش امسال</span>
					<span className="order-status status3">{`${reportsData.totalIncomeByYear.toLocaleString('fa')} تومان`}</span>
				</Items>
			</Row>
			<Block>
				<div className="row">
					<div className="column">
						<div className="zent-form-control">
							<label className="zent-form__control-label">از تاریخ</label>
							<DatePicker
								isGregorian={false}
								timePicker={false}
								value={startDateTime}
								onChange={(startDateTime) => setSartDateTime(startDateTime)}
								className={"zent-input"}
								placeholder=""
							/>
						</div>
						<div className="zent-form-control">
							<label className="zent-form__control-label">تا تاریخ</label>
							<DatePicker
								isGregorian={false}
								timePicker={false}
								value={endDateTime}
								onChange={(endDateTime) => setEndDateTime(endDateTime)}
								className={"zent-input"}
								placeholder=""
							/>
						</div>
						<Button
							className="action-btn"
							onClick={searchTotalIncomByDate}
						>
							فیلتر
          </Button>
					</div>
					<div className="box">
						<span className="title">مجموع فروش</span>
						<span className="order-status status3">{`${totalIncomeByCustomDate.toLocaleString('fa')} تومان`}</span>
					</div>
				</div>
			</Block>
			<Block>
				<div className="row">
					<div className="column">
						<div className="zent-form-control">
							<label className="zent-form__control-label">از تاریخ</label>
							<DatePicker
								isGregorian={false}
								timePicker={false}
								value={startDateTime}
								onChange={(startDateTime) => setSartDateTime(startDateTime)}
								className={"zent-input"}
								placeholder=""
							/>
						</div>
						<div className="zent-form-control">
							<label className="zent-form__control-label">تا تاریخ</label>
							<DatePicker
								isGregorian={false}
								timePicker={false}
								value={endDateTime}
								onChange={(endDateTime) => setEndDateTime(endDateTime)}
								className={"zent-input"}
								placeholder=""
							/>
						</div>
						<Button
							className="action-btn"
							onClick={searchTotalPaidSalariesByDate}
						>
							فیلتر
          </Button>
					</div>
					<div className="box">
						<span className="title">مجموع حقوق‌ پرداختی</span>
						<span className="order-status status3">{`${totalPaidSalariesByCustomDate.toLocaleString('fa')} تومان`}</span>
					</div>
				</div>
			</Block>
		</Container>
	);
};

const Container = styled.div`
  position: relative;
  h2 {
    margin: 25px 0;
    color: #fff;
    font-size: 2em;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 25px;
	@media(max-width: 550px) {
		flex-direction: column;
	}
  :last-child {
    margin-bottom: 0;
  }
`;

const Items = styled.div`
  flex: 1;
  min-height: 100px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 4px;
  margin-left: 25px;
  background-color: #fff;
  font-size: 14px;
	@media(max-width: 550px) {
		width: calc(100% - 25px);
		margin-bottom: 25px;
	}
  :last-child {
    margin-left: 0;
  }
  .title {
    font-size: 2em;
    color: #222;
		margin-bottom: 15px;
		@media(max-width: 1024px) {
			font-size: 1.7em;
		}
  }
  .order-status {
		font-size: 1.5em;
		@media(max-width: 1024px) {
			font-size: 1.2em;
		}
  }
`;

export default Reports;
