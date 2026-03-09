import axios from "axios";

export const api = axios.create({
    baseURL: "https://api-j6d6.onrender.com",
    headers: {
        "Content-Type": "application/json",
    }
});

export const apiPrivate = axios.create({
    baseURL: "https://api-j6d6.onrender.com",
    headers: {
        "Content-Type": "application/json",
    }
})