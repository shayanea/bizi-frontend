import React from "react";
import styled from "styled-components";

const Block = ({ children }) => {
	return <Container>{children}</Container>;
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  .title {
    font-size: 2em;
    font-weight: bold;
    color: #fff;
  }
  @media (max-width: 1024px) {
    .title {
      font-size: 1em;
    }
  }

	.box {
		flex: 1;
		min-height: 50px;
		width: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 10px;
		border-radius: 4px;
		margin-right: 25px;
		background-color: #fff;
		font-size: 14px;
		.title {
			font-size: 1.5em;
			color: #222;
			margin-bottom: 15px;
		}
	}

  .row {
    display: inline-flex;
    &.with-column {
      justify-content: space-evenly;
      flex-direction: column;
    }

    .column {
      flex: 1;
      display: inline-flex;
      flex-direction: row;
      align-items: flex-end;
    }

    .column:first-child {
      margin-bottom: 15px;
    }

    .zent-input-wrapper,
    .zent-select,
    .datepicker-input {
      margin-right: 15px;
      border-radius: 6px;
      width: 220px;
      @media (max-width: 1024px) {
        width: 170px;
      }
    }

    .add-btn {
      background-color: #00b075;
      border-color: #00b075;
      color: #fff;
      font-weight: bold;
      @media (max-width: 1024px) {
        padding: 0 16px;
      }
    }

    .add-btn:hover {
      background-color: #006f4a;
      border-color: #006f4a;
    }

    .zent-form__control-label {
      display: inline-block;
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }

    .datepicker-input {
      color: #323233;
      display: inline-block;
      flex: 1 1;
      height: 35px;
      box-sizing: border-box;
      padding: 0 10px;
      margin: 0;
      font-size: 14px;
      box-shadow: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      outline: none;
      border: 0;
    }

    .zent-form-control {
      margin-right: 15px;
    }

    .zent-btn {
      margin-right: 15px;
    }

    .zent-select {
      text-align: right;
    }

    .zent-select .zent-select-text {
      border-radius: 6px;
    }
    .zent-select-text::after {
      right: auto;
      left: 8px;
    }
  }
`;

export default Block;
