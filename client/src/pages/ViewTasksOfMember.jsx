import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa'; // Assuming you're using react-icons for the trash icon
import { useParams } from 'react-router-dom';
import { getAllAssignedTasks } from '../services/taskService';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { deleteTaskFromMember } from '../services/taskService';
const ViewTasksOfMember = () => {
    const { memberId } = useParams()
    const [tasks, setTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        (async () => {
            try {
                setLoading(true)
                const response = await getAllAssignedTasks(memberId)
                setTasks(response.data.tasks)
            } catch (error) {
                if (error.status == 404) {
                    toast.error("No tasks assigned to this member")
                }
                console.error(error)
            }
            finally {
                setLoading(false)
            }
        })()
    }, []);


    const handleDelete = async (taskId) => {
        const filteredTasks = tasks.filter((task) => task.id != taskId)
        setTasks(filteredTasks)

        try {
            const user = JSON.parse(localStorage.getItem("user"))
            const response = await deleteTaskFromMember(taskId, user.id)
            console.log("Response Data: ", response.data)
            toast.success("Task deleted successfully")
        } catch (error) {
            console.error("Error deleting task: ", error)
        }
    };

    const filteredTasks = tasks.filter(
        (task) =>
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.id.toString().includes(search)
    );

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-center">Task List</h2>

                {/* Search Input */}
                <div className="w-full mb-4">
                    <input
                        type="text"
                        placeholder="Search by title or ID"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Task List */}
                <ul className="bg-white shadow-md rounded divide-y">
                    {filteredTasks.map((task) => {
                        const isSelected = selectedTaskId === task.id;
                        return (
                            <li key={task.id}>
                                <div
                                    className={`flex justify-between items-center p-4 hover:bg-gray-100 ${isSelected
                                        ? 'border-2 border-blue-600 text-blue-600 bg-blue-50 rounded-md'
                                        : 'bg-white hover:bg-gray-100 rounded-md'
                                        }`}
                                    onClick={() => setSelectedTaskId((prevId) => prevId === task.id ? null : task.id)}
                                >
                                    <div>
                                        <p className="font-semibold">{task.title}</p>
                                        <p className="text-sm text-gray-500">ID: {task.id}</p>
                                    </div>

                                    {/* Delete Task Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(task.id);
                                        }}
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                        title="Remove Task"
                                    >
                                        <FaTrash size={18} />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                {
                    loading ? (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                            <ClipLoader size={36} color="#3B82F6" />
                        </div>
                    ) : null
                }

            </div>
        </div>
    );
};

export default ViewTasksOfMember;
