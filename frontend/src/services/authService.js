import axios from "axios";

const API = "http://localhost:8080/api/auth";

export const loginUser = (userData) => {
    return axios.post(`${API}/login`, userData);
};

export const registerUser = (userData) => {
    return axios.post(`${API}/register`, userData);
};