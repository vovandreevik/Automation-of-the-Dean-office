// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// CDN import for Montserrat
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
