import axios from "axios"
import { API_URL } from "../Constants"

export const login = async(email,password)=>{
    try {
        const requestBody = {
            email,
            password
        }
        const response = await axios.post(`${API_URL}/auth/login`,requestBody)
        console.log("Data: ",response.data)
    } catch (error) {
    console.error(error);
    throw error;
    }
}