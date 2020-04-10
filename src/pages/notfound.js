import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

function NotFound({ intl }) {
  document.title = "Dashboard - 404";
  return (
    <Container>
      <Column>
        <h1>404</h1>
        <h3>صفحه مورد نظر یافت نشده است.</h3>
        <Link to="/">بازگشت به دشبورد</Link>
      </Column>
      <Column />
    </Container>
  );
}

export default NotFound;

const Container = styled.div`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  text-align: center;
  height: 100vh;
  position: relative;
`;

const Column = styled.div`
  margin: 0 10px;
  h1 {
    color: #000;
    font-size: 5.5em;
    margin: 0;
  }
  h3 {
    color: #696969;
    font-size: 1.3em;
    margin-bottom: 10px;
  }
  p {
    color: #818181;
    font-size: 14px;
  }
  a {
    display: inline-block;
    border: 1px solid #444;
    color: #444;
    background-color: transparent;
    padding: 8px 10px;
    border-radius: 6px;
    margin-top: 10px;
    transition: background-color 0.3s ease, color 0.3s ease;
    :hover {
      background-color: #444;
      color: #fff;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
  }
`;
