import React, { useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';
import { createTask } from '../services/taskService';
const CreateTaskModal = ({ isOpen, onClose, creatorId, teamId, handleCreateTask }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const creator = creatorId


  // const handleCreateTask = async() => {
   
  //   if(!taskTitle || !taskDescription || !dueDate){
  //     toast.error("Please fill all fields")
  //     return;
  //   }

  //   try {
  //     await createTask(creator,teamId, taskTitle,taskDescription,dueDate)
  //     onClose()
  //   } catch (error) {
  //     console.error("Error: ",error)
  //     toast.error("Error creating task: ",error)
  //   }
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-center">Create New Task</h2>

        {/* Task Title */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Task Title:
        </label>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter task title..."
          // required
        />

        {/* Task Description */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Task Description:
        </label>
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter task description..."
          // required
        />

        {/* Due Date */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Due Date:
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          
        />

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
          >
            Cancel
          </button>

          <button
            onClick={()=>handleCreateTask(taskTitle,taskDescription, dueDate, creator)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
