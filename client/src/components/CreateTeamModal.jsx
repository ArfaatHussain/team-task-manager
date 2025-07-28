import React, { useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';
import { createTask } from '../services/taskService';
const CreateTeamModal = ({ isOpen, onClose, handleCreateTeam }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-center">Create New Task</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Team Name:
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter team name..."
          required
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Team Description:
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter team description..."
          required
        />

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
          >
            Cancel
          </button>

          <button
            onClick={()=>handleCreateTeam(name,description)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
