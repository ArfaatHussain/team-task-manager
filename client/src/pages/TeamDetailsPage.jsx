import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { getMembers, deleteMember, addMember } from '../services/teamService';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import AddMemberModal from '../components/AddMemberModal';
import { getAllUnassignedUsers } from '../services/userService';
const TeamDetailsPage = () => {
    const [members, setMembers] = useState([]);
    const { teamId, name, description } = useParams();
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState('')
    const [showAddMemberModal, setShowAddMemberModal] = useState(false)
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)

    const [allUnassignedUsers, setAllUnassignedUsers] = useState([])

    useEffect(() => {

        getAllMembers()
        getAllUnassigned()

    }, [])

    const getAllMembers = async () => {
        try {
            setMessage('')
            setLoading(true)
            const response = await getMembers(teamId)
            console.log("Response: ", response)
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

    const getAllUnassigned = async () => {
        try {
            const response = await getAllUnassignedUsers()
            console.log("All Un assigned users: ", response.data.data)
            setAllUnassignedUsers(response.data.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleRemoveMember = async (memberId) => {
        try {
            await deleteMember(teamId, memberId)
            const updatedMembers = members.filter((member) => member.id !== memberId);
            setMembers(updatedMembers);
        } catch (error) {
            console.error("Error deleting member: ", error)
        }
    };

    const handleAddMember = async (userId) => {
        console.log('Selected User ID:', userId);
        try {
            await addMember(teamId, userId)
            await getAllMembers()
            const filterUsers = allUnassignedUsers.filter((user) => user.id != userId)
            setAllUnassignedUsers(filterUsers)
            setShowAddMemberModal(false);
        } catch (error) {
            console.error("Error Adding Member: ", error)
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Team: {name}</h1>
            <p className="text-gray-600 text-base mb-6">
                {(!description || description === "null") ? 'No description were added' : description}
            </p>

            <div className="flex justify-end gap-3 mb-4">
                <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Add Member
                </button>

                <AddMemberModal
                    isOpen={showAddMemberModal}
                    onClose={() => setShowAddMemberModal(false)}
                    onAdd={handleAddMember}
                    users={allUnassignedUsers}
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Assign Task
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Delete Team
                </button>
            </div>

            <ul className="bg-white shadow-md rounded divide-y">
                {members.map((member) => (
                    <li
                        key={member.id}
                        className="flex justify-between items-center p-4 hover:bg-gray-100"
                    >
                        <div>
                            <p className="font-semibold">{member.username}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                        <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            title="Remove member"
                        >
                            <FaTrash size={18} />
                        </button>
                    </li>
                ))
                }

            </ul>
            {loading && (
                <div className="flex justify-center items-center h-40">
                    <ClipLoader size={36} color="#3B82F6" />
                </div>
            )}

            {!loading && members.length === 0 && (
                <p className="text-gray-600 text-base mb-6 text-center">{message}</p>
            )}


        </div>
    );
};

export default TeamDetailsPage;
