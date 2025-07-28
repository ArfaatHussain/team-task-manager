import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { getAllAssignedTasks, getCreatedTasks } from '../services/taskService';
import toast from 'react-hot-toast';

const TasksPage = () => {
  const [createdTasks, setCreatedTasks] = useState([]);
  const [originalCreatedTasks, setOriginalCreatedTasks] = useState([])
  const [assignedTasks, setAssignedTasks] = useState([])
  const [originalAssignedTasks, setOriginalAssignedTasks] = useState([])
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [search, setSearch] = useState('')

  useEffect(() => {

    setLoading(true)
    getCreatedTasksLocal();
    assignedTasksLocal();
    setLoading(false)

  }, []);

  useEffect(() => {
    if (!search) {
      setCreatedTasks(originalCreatedTasks)
      return;
    }
    if (createdTasks.length == 0) {
      return;
    }
    const filteredTasks = createdTasks.filter((task) => {
      if (
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.assignedTeam.name.toLowerCase().includes(search.toLowerCase()) ||
        task.assignedUser.username.toLowerCase().includes(search.toLowerCase()) ||
        task.status.toLowerCase().includes(search.toLowerCase())
      ) {
        return task
      }
    })

    setCreatedTasks(filteredTasks)
  }, [search])

  const getCreatedTasksLocal = async () => {
    try {
      const createdTasksResponse = await getCreatedTasks();
      setCreatedTasks(createdTasksResponse.data.tasks);
      setOriginalCreatedTasks(createdTasksResponse.data.tasks)
    } catch (error) {
      if (error.status == 404) {
        toast.error("No tasks created.")
      }
    }
  }

  const assignedTasksLocal = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      const assignedTasksResponse = await getAllAssignedTasks(user.id)
      setAssignedTasks(assignedTasksResponse.data.tasks)
      setOriginalAssignedTasks(assignedTasksResponse.data.tasks)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const formatDate = (date) => {
    const formattedDate = date.toLocaleString('en-US', {
      weekday: 'long',  // Full weekday name, e.g., "Monday"
      year: 'numeric',  // Full year, e.g., "2025"
      month: 'long',    // Full month name, e.g., "July"
      day: 'numeric',   // Numeric day of the month, e.g., "28"
      hour: 'numeric',  // Hour in 12-hour format, e.g., "2"
      minute: 'numeric',// Minute, e.g., "45"
      second: 'numeric',// Second, e.g., "30"
      hour12: true      // Use 12-hour clock (AM/PM format)
    });
    return formattedDate
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-4 mb-6">
        <h1 className="text-3xl font-bold">Your Created Tasks</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Filter tasks..."
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-lg"
        />
      </div>

      <div className="bg-white shadow-md rounded overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 border-b">
          <div className="font-semibold">Task</div>
          <div className="font-semibold">Team</div>
          <div className="font-semibold">Total Members</div>
          <div className="font-semibold">Assigned To</div>
          <div className="font-semibold">Status</div> {/* New column for Status */}
        </div>

        <ul className="divide-y">
          {createdTasks.map((task) => {
            const isSelected = selectedTaskId === task.id;
            return (
              <div
                key={task.id}
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 hover:bg-gray-100 ${isSelected
                  ? 'border-2 border-blue-600 text-blue-600 bg-blue-50 rounded-md'
                  : 'bg-white hover:bg-gray-100 rounded-md'
                  }`}
                onClick={() => setSelectedTaskId((prevId) => prevId === task.id ? null : task.id)}
              >
                <div className="text-md font-medium">{task.title}</div>
                <div className="text-sm text-gray-600">{task.assignedTeam ? task.assignedTeam.name : 'No team assigned'}</div>
                <div className="text-sm text-gray-600">{task.assignedTeam ? task.assignedTeam.totalMembers : 'N/A'}</div>
                <div className="text-sm text-gray-600">{task.assignedUser ? task.assignedUser.username : 'No user assigned'}</div>
                <div className="text-sm text-gray-600">{task.status}</div> {/* Display task status */}
              </div>
            );
          })}
        </ul>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <ClipLoader size={36} color="#3B82F6" />
        </div>
      )}

      {!loading && createdTasks.length === 0 && (
        <p className="text-gray-600 text-base mb-6 text-center">{message}</p>
      )}


      <div className="flex items-center space-x-4 mb-6 mt-10">
        <h1 className="text-3xl font-bold">Your Assigned Tasks</h1>
        <input
          type="text"
          placeholder="Filter tasks..."
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-lg"
        />
      </div>

      <div className="bg-white shadow-md rounded overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 border-b">
          <div className="font-semibold">Task</div>
          <div className="font-semibold">Description</div>
          <div className="font-semibold">Deadline</div>
          <div className="font-semibold">Status</div>
        </div>

        <ul className="divide-y">
          {assignedTasks.map((task) => {
            const isSelected = selectedTaskId === task.id;
            return (
              <div
                key={task.id}
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 hover:bg-gray-100 ${isSelected
                  ? 'border-2 border-blue-600 text-blue-600 bg-blue-50 rounded-md'
                  : 'bg-white hover:bg-gray-100 rounded-md'
                  }`}
                onClick={() => setSelectedTaskId((prevId) => prevId === task.id ? null : task.id)}
              >
                <div className="text-md font-medium">{task.title}</div>
                <div className="text-sm text-gray-600">{task.description ? task.description : 'No description were added'}</div>
                <div className="text-sm text-gray-600">
                  {formatDate(task.dueDate)}
                </div>
                <div
                  className="text-sm text-gray-600"
                >
                  {
                    task.status
                  }
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </div>


  );
};

export default TasksPage;
