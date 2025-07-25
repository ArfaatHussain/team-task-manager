import React, { useState } from 'react';
import TaskModal from './TaskModal';

function Dashboard() {
  const [showModal, setShowModal] = useState(false);

  const teams = [
    { id: 1, name: 'Team A', tasks: ['Task 1', 'Task 2'] },
    { id: 2, name: 'Team B', tasks: ['Task 3', 'Task 4'] },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="space-y-6">
        {teams.map((team) => (
          <div key={team.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-medium">{team.name}</h2>
            <ul>
              {team.tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="mt-4 py-2 px-4 bg-green-600 text-white rounded-md"
      >
        Add Task
      </button>

      {showModal && <TaskModal closeModal={() => setShowModal(false)} />}
    </div>
  );
}

export default Dashboard;
