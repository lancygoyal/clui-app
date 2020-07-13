import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import CLUI from "./CLUI";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <CLUI />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
