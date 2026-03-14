import axios from "axios";

const api = axios.create({
  baseURL: "https://leecampus-backend.onrender.com/leecampus",
});

export default api;