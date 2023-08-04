import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./components/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRating size={32} color="blue" defaultRating={3} />
    <Test /> */}
  </React.StrictMode>
);
