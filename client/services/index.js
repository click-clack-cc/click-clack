import axios from "axios";

export const http = axios.create({
  baseURL: "https://click-clack.cc:5000/api",
});

http.interceptors.request.use((config) => {
    return config;
});

