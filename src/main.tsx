import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { inject } from "@vercel/analytics";
import NotificationWrapper from "./notify";
import { StoreWrapper } from "./store";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

inject();

const originalLog = console.log;
console.log = (...args) => {
  toast(
    args.map(arg => typeof arg === 'object' ? JSON.stringify(arg).slice(0, 100) : arg.toString()).join('\n'),
    { autoClose: false }
  );
  return originalLog.call(console, ...args);
};

const originalError = console.error;
console.error = (...args) => {
  toast.error(
    args.map(arg => typeof arg === 'object' ? JSON.stringify(arg).slice(0, 100) : arg.toString()).join('\n'),
    { autoClose: false }
  );
  return originalError.call(console, ...args);
};

const originalWarn = console.warn;
console.warn = (...args) => {
  toast.warn(
    args.map(arg => typeof arg === 'object' ? JSON.stringify(arg).slice(0, 100) : arg.toString()).join('\n'),
    { autoClose: false }
  );
  return originalWarn.call(console, ...args);
};

const originalInfo = console.info;
console.info = (...args) => {
  toast.info(
    args.map(arg => typeof arg === 'object' ? JSON.stringify(arg).slice(0, 100) : arg.toString()).join('\n'),
    { autoClose: false }
  );
  return originalInfo.call(console, ...args);
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <StoreWrapper>
            <NotificationWrapper>
                <App />
            </NotificationWrapper>
        </StoreWrapper>
        <ToastContainer position={'bottom-left'} closeOnClick={true} theme={'dark'} />
    </React.StrictMode>
);
