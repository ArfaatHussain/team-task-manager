import React, { useEffect, useState } from 'react';
import { getMembers, } from '../services/teamService';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
const ViewEnrolledTeamDetails = () => {
    const [members, setMembers] = useState([]);
    const { teamId, name, description } = useParams();
    const [user, setUser] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState('')
    const [selectedUserId, setSelectedUserId] = useState('')

    const navigate = useNavigate()

    useEffect(() => {

        getAllMembers()
        const userFromLocal = JSON.parse(localStorage.getItem("user"))
        setUser(userFromLocal)
    }, [])

    const getAllMembers = async () => {
        try {
            setMessage('')
            setLoading(true)
            const response = await getMembers(teamId)
            setMembers(response.data.members)
        } catch (error) {
            if (error.status == 404) {
                setMessage("No members")
            }
            console.error(error)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Team: {name}</h1>
            <p className="text-gray-600 text-base mb-6">
                {(!description || description === "null") ? 'No description were added' : description}
            </p>

            <ul className="bg-white shadow-md rounded divide-y">
                {members.map((member) => {
                    const isSelected = selectedUserId === member.id;
                    return (
                        <div
                            key={member.id}
                            className={`flex justify-between items-center p-4 hover:bg-gray-100 ${isSelected
                                ? 'border-2 border-blue-600 text-blue-600 bg-blue-50 rounded-md'
                                : 'bg-white hover:bg-gray-100 rounded-md'
                                }`}
                            onClick={() => setSelectedUserId((prevId) => prevId === member.id ? null : member.id)}
                        >
                            <div>
                                <p className="font-semibold">{member.username}</p>
                                <p className="text-sm text-gray-600">{member.email}</p>
                            </div>
                        </div>
                    );
                })}



            </ul >
            {loading && (
                <div className="flex justify-center items-center h-40">
                    <ClipLoader size={36} color="#3B82F6" />
                </div>
            )}

            {
                !loading && members.length === 0 && (
                    <p className="text-gray-600 text-base mb-6 text-center">{message}</p>
                )
            }


        </div >
    );
};


export default ViewEnrolledTeamDetails;
