import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    setTeams([
      { id: 1, name: "Team Alpha", members: 5, tasksCount: 12 },
      { id: 2, name: "Team Beta", members: 4, tasksCount: 8 }
    ]);
    setTasks([
      { id: 1, title: "Task 1", status: "Pending", dueDate: "2025-07-30" },
      { id: 2, title: "Task 2", status: "Completed", dueDate: "2025-07-25" }
    ]);
  }, []);
  
  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome back, User!</h1>
        <p className="text-gray-500">Here’s an overview of your teams and tasks.</p>
      </div>
      
      {/* Teams Overview */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Your Teams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">{team.name}</h3>
              <p>{team.members} members</p>
              <p>{team.tasksCount} tasks</p>
              <button className="mt-4 text-blue-500 hover:text-blue-700">View Team</button>
            </div>
          ))}
        </div>
      </div>

      {/* Task Overview */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p>Status: {task.status}</p>
              <p>Due Date: {task.dueDate}</p>
              <button className="mt-4 text-blue-500 hover:text-blue-700">View Task</button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md">Create Task</button>
          <button className="bg-green-500 text-white py-2 px-4 rounded-md">Create Team</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
