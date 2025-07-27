import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeams } from '../services/teamService';
import { getEnrolledTeam } from '../services/userService';
import { useNavigate } from 'react-router-dom';
const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [enrolledTeam, setEnrolledTeam] = useState({})
  const [enrollTeamError, setEnrollTeamError] = useState('')
  const [teamError, setTeamError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getAllTeams();
    (async () => {
      try {
        const response = await getEnrolledTeam();
        console.log("Response for Enrolled Team: ", response.data)
        setEnrolledTeam(response.data.team)
      } catch (error) {
        if (error.status == 404) {
          setEnrollTeamError("Not currently enrolled in team")
        }
        console.error("Error getting enrolled team")
      }
    })()
  }, []);

  const getAllTeams = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      const response = await getTeams(user.id)
      console.log("Response from Get ALL Teams: ", response.data)
      setTeams(response.data.teams)
    } catch (error) {
      if (error.status == 404) {
        setTeamError("No teams created.")
      }
    }
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-700 mr-4">
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
          onClick={()=>navigate(`/team/${team.id}/${encodeURIComponent(team.name)}/${team.description}`)}
            key={team.id}
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-4">{team.name}</h3>
            <p className="text-gray-600 mb-4">
              {team.description ? team.description : "No description were added"}
            </p>
            <p className="text-gray-600 mb-4" >
              Total Members: {team.totalMembers}
            </p>
            <Link
              to={`/team/${team.id}/${encodeURIComponent(team.name)}/${team.description}`}
              className="text-blue-600 hover:text-blue-800"
            >
              View Team Details
            </Link>
          </div>
        ))}
        {
          teamError && (
            <p className="text-gray-500 mt-2">
              {teamError}
            </p>
          )
        }

      </div>

      <div className="flex justify-between items-center mb-4 mt-10">
        <h2 className="text-3xl font-bold text-blue-700 mr-4">
          Your Enrolled Team
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.keys(enrolledTeam).length !== 0 ? (
          <div className="col-span-full w-full hover:bg-blue-50 hover:shadow-2xl transform transition-all duration-300 ease-in-out cursor-pointer">
            <div className="flex justify-between items-center p-4 bg-white shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{enrolledTeam.name}</h3>
              <p className="text-gray-600">Total Members: {enrolledTeam.totalMembers}</p>
              <p className="text-gray-600">Created by: {enrolledTeam.creator.username}</p>
              <p className="text-gray-600">Created At: {new Date(enrolledTeam.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ) : null}
        {enrollTeamError && (
          <p className="text-gray-500 mt-2">{enrollTeamError}</p>
        )}
      </div>

    </div>

  );
};

export default TeamsPage;
