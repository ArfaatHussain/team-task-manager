import React, { useState } from 'react';

function TaskModal({ closeModal }) {
  const [taskName, setTaskName] = useState('');

  const handleSave = () => {
    console.log('Task Saved:', taskName);
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shado-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task name"
          className="w-full p-2 border rounded-md mb-4"
        />
        <div className="flex justify-between">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
