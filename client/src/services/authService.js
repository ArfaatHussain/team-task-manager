import axiosInstance from "./api"
import { API_URL } from "../Constants"

export const login = async (email, password) => {
    try {
        const requestBody = {
            email,
            password
        }
        const response = await axiosInstance.post(`${API_URL}/auth/login`, requestBody)
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
        const response = await axiosInstance.post(`${API_URL}/auth/register`, requestBody)
        return response
    } catch (error) {
        throw error
    }
}

export const logout = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        console.log("AccessToken: ",accessToken)
        const response = await axiosInstance.post(`${API_URL}/auth/logout`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }, 
            withCredentials: true
        })
        return response
    } catch (error) {
        throw error
    }
}