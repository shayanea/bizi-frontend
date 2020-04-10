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
    .zent-input-wrapper {
      margin-left: 15px;
      border-radius: 6px;
    }
  }
`;

export default Block;
