// src/services/api.ts
import axios from "axios";

// Create an Axios instance with the server base URL
const api = axios.create({
  baseURL: "http://localhost:8000", // The URL of your FastAPI server
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request/response interceptors if needed

export default api;
