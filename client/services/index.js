import axios from "axios";
import https from "https";

export const http = axios.create({
  baseURL: "https://localhost:5001/api", // Get from environment variables later
  httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Insecure, only for local testing
});


http.interceptors.request.use((config) => {
  // Setup a way to get the token automatically  
  // const token = getToken();

    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
});

