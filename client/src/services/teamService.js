import axios from "axios"
import { API_URL } from "../Constants"

export const getTeams = async (userId) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        const response = await axios.get(`${API_URL}/user/getTeams/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            withCredentials: true
        });

        return response
    } catch (error) {
        throw error
    }
}

export const getMembers = async (teamId) => {
    try {
        const accessToken = localStorage.getItem("accessToken")

        const response = await axios.get(`${API_URL}/team/getMembers/${teamId}`, {
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

export const deleteMember = async (teamId, userId) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.delete(`${API_URL}/team/removeUser`, {
            data: {
                teamId,
                userId,
                creatorId: user.id
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            withCredentials: true
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const addMember = async (teamId, userId) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        const response = await axios.post(`${API_URL}/team/addUser`, {
            teamId,
            userId
        },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                withCredentials: true
            }
        )

        return response

    } catch (error) {
        throw error
    }
}

export const deleteTeam = async (teamId) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"))
        const requestBody = {
            teamId,
            creatorId: user.id
        };

        const accessToken = localStorage.getItem("accessToken");

        return await axios.delete(`${API_URL}/team/delete`, {
            data: requestBody,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
        });
    } catch (error) {
        throw error;
    }
};

export const createTeam = async(name, description)=>{
    try {
        const accessToken = localStorage.getItem("accessToken")
        const user = JSON.parse(localStorage.getItem("user"))

        const requestBody = {
            name,
            description,
            creatorId: user.id
        }

        const response = await axios.post(`${API_URL}/team/create`, requestBody,{
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

