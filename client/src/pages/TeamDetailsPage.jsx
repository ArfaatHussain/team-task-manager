import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { getMembers, deleteMember } from '../services/teamService';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import AddMemberModal from '../components/AddMemberModal';
const TeamDetailsPage = () => {
    const [members, setMembers] = useState([]);
    const { teamId, name, description } = useParams();
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState('')
    const [showAddMemberModal, setShowAddMemberModal] = useState(false)
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)

    useEffect(() => {
        getAllMembers()
    }, [])

    const getAllMembers = async () => {
        try {
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

    const handleRemoveMember = async (memberId) => {
        try {
            await deleteMember(teamId, memberId)
            await getAllMembers()
        } catch (error) {
            console.error("Error deleting member: ", error)
        }
    };

    const handleAddMember = (userId) => {
        console.log('Selected User ID:', userId);
        setShowAddMemberModal(false);
        // You can now call an API or update your state
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Team: {name}</h1>
            <p className="text-gray-600 text-base mb-6">
                {(!description || description === "null") ? 'No description were added' : description}
            </p>

            <div className="flex justify-end gap-3 mb-4">
                <button 
                onClick={()=>setShowAddMemberModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Add Member
                </button>

                <AddMemberModal
                    isOpen={showAddMemberModal}
                    onClose={() => setShowAddMemberModal(false)}
                    onAdd={handleAddMember}
                    users={members}
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
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <ClipLoader size={36} color="#3B82F6" />
                </div>
            ) : (
                <p className="text-gray-600 text-base mb-6 text-center">{message}</p>

            )}

        </div>
    );
};

export default TeamDetailsPage;
