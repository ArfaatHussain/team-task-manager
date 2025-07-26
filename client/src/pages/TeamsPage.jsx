import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    setTeams([
      { id: 1, name: "Team Alpha", description: "A high-performing team." },
      { id: 2, name: "Team Beta", description: "Focused on product development." },
      { id: 3, name: "Team Gamma", description: "A creative marketing team." }
    ]);
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">Your Teams</h2> {/* Reduced margin-bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map((team) => (
          <div key={team.id} className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">{team.name}</h3>
            <p className="text-gray-600 mb-4">{team.description}</p>
            <Link
              to={`/team/${team.id}`} 
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
