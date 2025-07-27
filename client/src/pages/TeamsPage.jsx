import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeams } from '../services/teamService';
const TeamsPage = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getAllTeams()
  }, []);

  const getAllTeams = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      const response = await getTeams(user.id)
      setTeams(response.data.teams)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-700 flex-grow text-center">
          Your Created Teams
        </h2>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
          title="Create Team"
        >
          Create Team
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-4">{team.name}</h3>
            <p className="text-gray-600 mb-4">
              {team.description ? team.description : "No description were added"}
            </p>
            <Link
              to={`/team/${team.id}/${encodeURIComponent(team.name)}/${team.description}`}
              className="text-blue-600 hover:text-blue-800"
            >
              View Team Details
            </Link>
          </div>
        ))}
      </div>
    </div>

  );
};

export default TeamsPage;
