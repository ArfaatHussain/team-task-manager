import React, { useState } from 'react';

const CreateTaskModal = ({ isOpen, onClose }) => {
  const [userId, setUserId] = useState('');

  const users = [
    { id: '1', name: 'Arfaat Hussain' },
    { id: '2', name: 'Ali Ahmed' },
    { id: '3', name: 'Sara Khan' },
    { id: '4', name: 'Fatima Noor' },
    { id: '5', name: 'Zain Raza' },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(userId.toLowerCase()) ||
    user.id.includes(userId)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-md relative">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Assign to (User ID or Name):
        </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Search by user ID or name..."
        />

        <div className="max-h-40 overflow-y-auto border rounded">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                onClick={() => setUserId(user.id)}
              >
                {user.name} ({user.id})
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-gray-500 py-4">
              No users found
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
