// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./components/Dashboard/traductor/feed/store";
import Modal from "react-modal";
import "./style/main.scss";
import "react-datetime/css/react-datetime.css";

function main() {
  const container = document.querySelector(".app-wrapper") || document.getElementById("root");
  if (!container) {
    console.error("No se encontró el contenedor .app-wrapper (o #root).");
    return;
  }

  // Importantísimo: configurar el elemento de la app ANTES del primer render
  Modal.setAppElement(container);

  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </Provider>
  );
}

// Si el DOM ya está listo, corre de una vez; si no, espera el evento.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}
