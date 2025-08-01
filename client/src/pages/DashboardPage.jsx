import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // To navigate to the Teams page

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  return (
    <div className="min-h-screen">
      <div className="text-center max-w-2xl mx-auto mt-6">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to Team Task Manager! {user.username}</h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage your teams, collaborate on tasks, and stay organized. Everything you need is here.
        </p>
        <Link
          to="/teams"
          className="bg-blue-600 text-white px-6 py-2 rounded-md text-lg hover:bg-blue-700 transition duration-300"
        >
          View Your Teams
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
