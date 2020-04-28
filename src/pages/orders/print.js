import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Grid, Notify, BlockHeader, Button, Select } from "zent";
import { fetchSingleOrder } from "../../services/orderService";
import moment from "jalali-moment";

import Logo1 from "../../assets/img/bizi-logo.png";
import Logo2 from "../../assets/img/snb-logo.png";
import { renderSize } from "../../utils/services";

const Print = ({ match }) => {
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
    fetchSingleOrder(match.params.id)
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        Notify.error(
          "در برقراری ارتباط مشکلی به وجود آمده است، مجددا تلاش نمایید."
        );
      });
  }, []);

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

  const printPage = () => {
    return window.print();
  };

  const orders = [
    {
      title: "نام محصول",
      name: "name",
      bodyRender: (data) => {
        return `${data.name} (${renderSize(data.size)} - ${data.color})`;
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
          <div className="zent-form-control" id="owner">
            <label className="zent-form-label zent-form-label-required">
              فهرست فروشنده‌ها
            </label>
            <Select
              data={owners}
              autoWidth
              optionText="name"
              optionValue="id"
              placeholder="انتخاب فروشنده"
              emptyText="هیچ آیتمی یافت نشده است."
              onChange={(e, item) => {
                setOwner(item);
              }}
              filter={(item, keyword) => item.name.indexOf(keyword) > -1}
            />
          </div>
          <p>تلفن: 021 - 88205631</p>
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
          <BlockHeader
            type="minimum"
            title={`هزینه ارسال : ${Number(items.shippingCost).toLocaleString(
              "fa"
            )} تومان`}
          ></BlockHeader>
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
          <Button
            id="print"
            htmlType="submit"
            type="primary"
            onClick={printPage}
          >
            پرینت
          </Button>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  margin: 30px auto;
  max-width: 100%;
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
