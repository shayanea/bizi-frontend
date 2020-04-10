import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

export const getQueryParam = name => {
  var q = window.location.search.match(new RegExp("[?&]" + name + "=([^&#]*)"));
  return q && q[1];
};
