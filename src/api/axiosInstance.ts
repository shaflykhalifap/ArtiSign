import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.API_BASE_URL ||
    "https://backendv2-production-8d04.up.railway.app/",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance;
