import axios from "axios"
import { API_URL } from "../Constants"

export const login = async (email, password) => {
    try {
        const requestBody = {
            email,
            password
        }
        const response = await axios.post(`${API_URL}/auth/login`, requestBody)
        return response
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const register = async (username, email, password) => {
    try {
        const requestBody = {
            username,
            email,
            password
        }
        const response = await axios.post(`${API_URL}/auth/register`, requestBody)
        return response
    } catch (error) {
        throw error
    }
}