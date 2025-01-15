import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Check if it's the first visit
const hasSeenIntro = localStorage.getItem('hasSeenIntro');

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App initialShowIntro={!hasSeenIntro} />
  </React.StrictMode>
);
