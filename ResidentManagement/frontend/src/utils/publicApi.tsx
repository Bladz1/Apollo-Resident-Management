import axios from "axios";

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/resident-management",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default publicApi;
