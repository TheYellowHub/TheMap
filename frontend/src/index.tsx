import React, { Profiler } from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./bootstrap.min.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

import App from "./App";
import AuthProvider from "./auth/AuthProvider";
import "./index.css";

// eslint-disable-next-line
export function profilerOnRender(id: any, phase: any, actualDuration: any, baseDuration: any, startTime: any, commitTime: any) {
    console.log(`${id} ${phase}: ${Math.floor(actualDuration)}ms`);
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <AuthProvider>
            <Profiler id="App" onRender={profilerOnRender}>
                <App />
            </Profiler>
        </AuthProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
