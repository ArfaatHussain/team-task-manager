import React, { useState } from 'react';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      console.log('Registering:', email, password);
    } else {
      alert("Passwords don't match!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-lg w-80">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm">Email</label>
        <input
          type="email"
          id="email"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm">Password</label>
        <input
          type="password"
          id="password"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-sm">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">Register</button>
    </form>
  );
}

export default RegisterForm;
