import axios from "axios"
import { API_URL } from "../Constants"

export const getAllUnassignedTasks = async()=>{
    try {
        const accessToken = localStorage.getItem("accessToken")
        const user = JSON.parse( localStorage.getItem("user") )
        const response = await axios.get(`${API_URL}/task/getAllUnassignedTasks/${user.id}`,{
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

export const createTask = async(creator, teamId, title, description, dueDate)=>{

    try {
        const accessToken = localStorage.getItem("accessToken")
        const requestBody = {
            creatorId: creator,
            teamId,
            title,
            description,
            dueDate: new Date(dueDate).toISOString()
        }
        const response = await axios.post(`${API_URL}/task/create`,requestBody,{
            headers:{
                Authorization: `Bearer ${accessToken}`
            },
            withCredentials: true
        })

        return response
    } catch (error) {
        throw error
    }
}

export const assignTask = async(assignedTo, taskId)=>{

    try {
        const requestBody = {
            assignedTo,
            taskId
        }
        const accessToken = localStorage.getItem("accessToken")
        const response = await axios.patch(`${API_URL}/task/assignTask`,requestBody,{
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

export const deleteTaskFromMember = async(taskId, creatorId)=>{
    try {
        const requestBody = {
            creatorId,
            taskId,
            assignedTo: null
        }
        const accessToken = localStorage.getItem("accessToken")
        const response = await axios.patch(`${API_URL}/task/update`,requestBody,{
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