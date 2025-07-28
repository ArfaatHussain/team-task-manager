import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { getMembers, deleteMember, addMember, deleteTeam } from '../services/teamService';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import AddMemberModal from '../components/AddMemberModal';
import { getAllUnassignedUsers } from '../services/userService';
import CreateTaskModal from '../components/CreateTaskModal';
import AssignTaskModal from '../components/AssignTaskModal';
import { assignTask, getAllUnassignedTasks } from '../services/taskService';
import toast from 'react-hot-toast';
import { createTask } from '../services/taskService';
import ViewTasksOfMember from './ViewTasksOfMember';
import { useNavigate } from 'react-router-dom';
const TeamDetailsPage = () => {
    const [members, setMembers] = useState([]);
    const { teamId, name, description } = useParams();
    const [user, setUser] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState('')
    const [showAddMemberModal, setShowAddMemberModal] = useState(false)
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
    const [showAssignTaskModal, setShowAssignTaskModal] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState('')

    const [allUnassignedUsers, setAllUnassignedUsers] = useState([])
    const [allUnassignedTasks, setAllUnassignedTasks] = useState([])

    const navigate = useNavigate()

    useEffect(() => {

        getAllMembers()
        getAllUnassigned()
        getAllUnassignedTasksLocal()
        const userFromLocal = JSON.parse(localStorage.getItem("user"))
        setUser(userFromLocal)
    }, [])

    const getAllMembers = async () => {
        try {
            setMessage('')
            setLoading(true)
            const response = await getMembers(teamId)
            // console.log("Response: ", response)
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
            // console.log("All Un assigned users: ", response.data.data)
            setAllUnassignedUsers(response.data.data)
        } catch (error) {
            console.error(error)
        }
    }

    const getAllUnassignedTasksLocal = async () => {
        try {
            const response = await getAllUnassignedTasks();
            // console.log("All Unassigned Task: ",response.data)
            setAllUnassignedTasks(response.data.tasks)
        } catch (error) {
            if (error.status !== 404) {
                console.error("Error getting Unassigned tasks: ", error)
            }
        }
    }

    const handleRemoveMember = async (memberId) => {
        try {
            await deleteMember(teamId, memberId)
            const updatedMembers = members.filter((member) => member.id !== memberId);
            setMembers(updatedMembers);
            await getAllUnassigned()
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

    const handleAssignTask = async (taskId) => {
        console.log('Selected Task ID:', taskId);
        try {
            await assignTask(selectedUserId, taskId, teamId)
            toast.success("Task Assigned.")
            setShowAssignTaskModal(false)
            setSelectedUserId(null)
            const filterTasks = allUnassignedTasks.filter((task) => task.id != taskId)
            setAllUnassignedTasks(filterTasks)

        } catch (error) {
            console.error("Error Assigning Task: ", error)
        }
    }

    const handleCreateTask = async (taskTitle, taskDescription, dueDate, creator) => {

        if (!taskTitle || !taskDescription || !dueDate) {
            toast.error("Please fill all fields")
            return;
        }

        try {
            const response = await createTask(creator, teamId, taskTitle, taskDescription, dueDate)
            toast.success("Task Created.")
            setShowCreateTaskModal(false)
            
            const newTask = {
                id: response.data.newTask.id,
                title: response.data.newTask.title
            }

            setAllUnassignedTasks(prevTasks => [...prevTasks, newTask])

        } catch (error) {
            console.error("Error: ", error)
            toast.error("Error creating task: ", error)
        }
    };

    const handleTeamDelete = async () => {
        try {
            await deleteTeam(teamId)
            navigate(-1)
        } catch (error) {
            console.error("Error deleting team")
        }
    }


    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Team: {name}</h1>
            <p className="text-gray-600 text-base mb-6">
                {(!description || description === "null") ? 'No description were added' : description}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4">
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
                <button
                    onClick={() => {
                        if (allUnassignedTasks.length == 0) {
                            toast.error("No tasks found. Please create first.")
                            return;
                        }
                        if (!selectedUserId) {
                            toast.error("Please select a member first.")
                            return;
                        }
                        setShowAssignTaskModal(true)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Assign Task
                </button>
                <AssignTaskModal
                    isOpen={showAssignTaskModal}
                    onClose={() => setShowAssignTaskModal(false)}
                    onAssign={handleAssignTask}
                    tasks={allUnassignedTasks}
                />
                <button
                    onClick={() => setShowCreateTaskModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Create Task
                </button>

                <CreateTaskModal
                    isOpen={showCreateTaskModal}
                    onClose={() => { setShowCreateTaskModal(false) }}
                    teamId={teamId}
                    creatorId={user.id}
                    handleCreateTask={handleCreateTask}
                />
                <button
                    onClick={handleTeamDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Delete Team
                </button>
            </div>

            <ul className="bg-white shadow-md rounded divide-y">
                {members.map((member) => {
                    const isSelected = selectedUserId === member.id;
                    return (
                        <div
                            key={member.id}
                            className={`flex flex-col sm:flex-row justify-between items-center sm:space-x-4 p-4 hover:bg-gray-100 ${isSelected
                                    ? 'border-2 border-blue-600 text-blue-600 bg-blue-50 rounded-md'
                                    : 'bg-white hover:bg-gray-100 rounded-md'
                                }`}
                            onClick={() => setSelectedUserId((prevId) => prevId === member.id ? null : member.id)}
                        >
                            <div className="flex-1">
                                <p className="font-semibold">{member.username}</p>
                                <p className="text-sm text-gray-600">{member.email}</p>
                            </div>

                            <div className="flex flex-row space-x-4 mt-2 sm:mt-0">
                                <button
                                    className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                                    title="Show Assigned Tasks"
                                    onClick={() => navigate(`/team/${member.id}`)}
                                >
                                    View Tasks
                                </button>

                                {/* Remove member button */}
                                <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    title="Remove member"
                                >
                                    <FaTrash size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </ul>


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


export default TeamDetailsPage;
