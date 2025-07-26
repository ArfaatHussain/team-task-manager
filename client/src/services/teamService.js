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
