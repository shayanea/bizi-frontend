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
  .row {
    display: inline-flex;
    .zent-input-wrapper,
    .zent-select {
      margin-right: 15px;
      border-radius: 6px;
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
