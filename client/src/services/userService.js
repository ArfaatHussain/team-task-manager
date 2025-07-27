import axios from "axios"
import { API_URL } from "../Constants"

export const getAllUnassignedUsers = async()=>{
    try {
        const accessToken = localStorage.getItem("accessToken")

        const response = await axios.get(`${API_URL}/user/getAllUnassignedUsers`,{
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
