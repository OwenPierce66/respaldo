import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./components/Dashboard/traductor/feed/store";

import "./style/main.scss";
import "react-datetime/css/react-datetime.css";

function main() {
  const container = document.querySelector(".app-wrapper");
  const root = createRoot(container);

  root.render(
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </Provider>
  );
}

document.addEventListener("DOMContentLoaded", main);
