import axios from "axios"
import { API_URL } from "../Constants"

export const getAllUnassignedTasks = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        const user = JSON.parse(localStorage.getItem("user"))
        const response = await axios.get(`${API_URL}/task/getAllUnassignedTasks/${user.id}`, {
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

export const createTask = async (creator, teamId, title, description, dueDate) => {

    try {
        const accessToken = localStorage.getItem("accessToken")
        const requestBody = {
            creatorId: creator,
            teamId,
            title,
            description,
            dueDate: new Date(dueDate).toISOString()
        }
        const response = await axios.post(`${API_URL}/task/create`, requestBody, {
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

export const assignTask = async (assignedTo, taskId, teamId) => {

    try {
        const requestBody = {
            assignedTo,
            taskId,
            teamId
        }
        const accessToken = localStorage.getItem("accessToken")
        const response = await axios.patch(`${API_URL}/task/assignTask`, requestBody, {
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

export const deleteTaskFromMember = async (taskId, creatorId) => {
    try {
        const requestBody = {
            creatorId,
            taskId,
            assignedTo: null
        }
        const accessToken = localStorage.getItem("accessToken")
        const response = await axios.patch(`${API_URL}/task/update`, requestBody, {
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

export const getAllAssignedTasks = async (userId) => {

    try {
        const accessToken = localStorage.getItem("accessToken")
        const response = await axios.get(`${API_URL}/task/getAllAssignedTasks/${userId}`, {
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

export const getCreatedTasks = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        const user = JSON.parse(localStorage.getItem("user"))
        const response = await axios.get(`${API_URL}/task/getAllCreatedTasks/${user.id}`,{
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

export const completeTask = async(taskId)=>{

    try {
        const accessToken = localStorage.getItem("accessToken")
        const requestBody = {
            taskId,
            status: "completed"
        }
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
