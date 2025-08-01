import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { completeTask, deleteTask, getAllAssignedTasks, getCreatedTasks } from '../services/taskService';
import toast from 'react-hot-toast';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { FaTrash } from 'react-icons/fa';

const TasksPage = () => {
  const [createdTasks, setCreatedTasks] = useState([]);
  const [originalCreatedTasks, setOriginalCreatedTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [originalAssignedTasks, setOriginalAssignedTasks] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [search, setSearch] = useState('');
  const [assignedTaskSearch, setAssignedTaskSearch] = useState('');

  // Track loading state per task
  const [loadingTasks, setLoadingTasks] = useState({});

  useEffect(() => {
    setLoading(true);
    getCreatedTasksLocal();
    assignedTasksLocal();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!search) {
      setCreatedTasks(originalCreatedTasks);
      return;
    }
    if (createdTasks.length === 0) {
      return;
    }
    const filteredTasks = createdTasks.filter((task) => {
      if (
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.assignedTeam.name.toLowerCase().includes(search.toLowerCase()) ||
        task.assignedUser.username.toLowerCase().includes(search.toLowerCase()) ||
        task.status.toLowerCase().includes(search.toLowerCase())
      ) {
        return task;
      }
    });
    setCreatedTasks(filteredTasks);
  }, [search]);

  useEffect(() => {
    if (!assignedTaskSearch) {
      setAssignedTasks(originalAssignedTasks);
      return;
    }
    if (assignedTasks.length === 0) {
      return;
    }
    const filteredTasks = assignedTasks.filter((task) => {
      if (
        task.title.toLowerCase().includes(assignedTaskSearch.toLowerCase()) ||
        task.status.toLowerCase().includes(assignedTaskSearch.toLowerCase())
      ) {
        return task;
      }
    });
    setAssignedTasks(filteredTasks);
  }, [assignedTaskSearch]);

  const getCreatedTasksLocal = async () => {
    try {
      const createdTasksResponse = await getCreatedTasks();
      setCreatedTasks(createdTasksResponse.data.tasks);
      setOriginalCreatedTasks(createdTasksResponse.data.tasks);
    } catch (error) {
      if (error.status === 404) {
        toast.error('No tasks created.');
      }
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      setLoadingTasks((prevState) => ({
        ...prevState,
        [taskId]: true, // Set this task to loading
      }));

      const response = await completeTask(taskId);
      console.log('Response: ', response.data);

      const filteredAssignedTasks = assignedTasks.filter((task) => task.id !== taskId);
      setAssignedTasks(filteredAssignedTasks);
      setOriginalAssignedTasks(filteredAssignedTasks);
    } catch (error) {
      toast.success('Task Completed.');
    } finally {
      setLoadingTasks((prevState) => ({
        ...prevState,
        [taskId]: false, // Set this task to not loading after the completion
      }));
    }
  };

  const assignedTasksLocal = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const assignedTasksResponse = await getAllAssignedTasks(user.id);
      setAssignedTasks(assignedTasksResponse.data.tasks);
      setOriginalAssignedTasks(assignedTasksResponse.data.tasks);
    } catch (error) {
      toast.error("No tasks assigned to you.");
    }
  };

  const formatDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const formattedDate = dateObj.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour12: true,
    });
    return formattedDate;
  };

  const handleDelete = async (taskId) => {
    try {
    await deleteTask(taskId)
    const filteredTasks = createdTasks.filter((task)=>task.id !== taskId)
    setCreatedTasks(filteredTasks)
    setOriginalCreatedTasks(filteredTasks)
    toast.success("Task Deleted.")
    } catch (error) {
      console.error("Error deleting task: ", error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
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
        <Table className="min-w-full">
          <Thead>
            <Tr>
              <Th className="font-semibold px-4 py-2">Task</Th>
              <Th className="font-semibold px-4 py-2">Team</Th>
              <Th className="font-semibold px-4 py-2">Total Members</Th>
              <Th className="font-semibold px-4 py-2">Assigned To</Th>
              <Th className="font-semibold px-4 py-2">Status</Th>
              <Th className="font-semibold px-4 py-2">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {createdTasks.map((task) => {
              const isSelected = selectedTaskId === task.id;
              return (
                <Tr
                  key={task.id}
                  className={`hover:bg-gray-100 ${isSelected ? 'border-2 border-blue-600 text-blue-600 bg-blue-50 rounded-md' : 'bg-white hover:bg-gray-100'
                    }`}
                  onClick={() => setSelectedTaskId((prevId) => (prevId === task.id ? null : task.id))}
                >
                  <Td className="text-md font-medium px-4 py-3 text-center">{task.title}</Td>
                  <Td className="text-sm text-gray-600 px-4 py-3 text-center">{task.assignedTeam ? task.assignedTeam.name : 'No team assigned'}</Td>
                  <Td className="text-sm text-gray-600 px-4 py-3 text-center">{task.assignedTeam ? task.assignedTeam.totalMembers : 'N/A'}</Td>
                  <Td className="text-sm text-gray-600 px-4 py-3 text-center">{task.assignedUser ? task.assignedUser.username : 'No user assigned'}</Td>
                  <Td className="text-sm text-gray-600 px-4 py-3 text-center">{task.status.toLowerCase()}</Td>
                  <Td className="text-sm px-4 py-3 flex justify-center items-center">
                    <FaTrash size={18} color='red' className='cursor-pointer' onClick={()=>handleDelete(task.id)} />
                  </Td>

                </Tr>
              );
            })}
          </Tbody>
        </Table>
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
          value={assignedTaskSearch}
          onChange={(e) => setAssignedTaskSearch(e.target.value)}
          type="text"
          placeholder="Filter tasks..."
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-lg"
        />
      </div>

      <div className="bg-white shadow-lg rounded overflow-hidden">
        <Table className="min-w-full">
          <Thead>
            <Tr>
              <Th className="font-semibold">Task</Th>
              <Th className="font-semibold">Description</Th>
              <Th className="font-semibold">Deadline</Th>
              <Th className="font-semibold">Status</Th>
              <Th className="font-semibold">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {assignedTasks.map((task) => {
              const isSelected = selectedTaskId === task.id;
              return (
                <Tr
                  key={task.id}
                  className={`hover:bg-gray-100 ${isSelected ? 'border-2 border-blue-600 text-blue-600 bg-blue-50 rounded-md' : 'bg-white hover:bg-gray-100'}`}
                  onClick={() => setSelectedTaskId((prevId) => (prevId === task.id ? null : task.id))}
                >
                  <Td className="text-md font-medium px-3 py-3 text-center">{task.title}</Td>
                  <Td className="text-sm text-gray-600 py-3 text-center">{task.description ? task.description : 'No description was added'}</Td>
                  <Td className="text-sm text-gray-600 py-3 text-center">{formatDate(task.dueDate)}</Td>
                  <Td className="text-sm text-gray-600 py-3 text-center">{task.status.toLowerCase()}</Td>
                  <Td className="text-center py-3 ">
                    <button
                      className="mt-2 p-2 text-blue-600 hover:text-blue-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteTask(task.id);
                      }}
                    >
                      {loadingTasks[task.id] ? (
                        <ClipLoader size={30} color={'blue-600'} />
                      ) : (
                        <i className="fas fa-check-circle"></i>
                      )}
                    </button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};

export default TasksPage;
