import React, { useEffect, useState } from 'react';

const AddMemberModal = ({ isOpen, onClose, onAdd, users }) => {
    const [allUsers, setAllUsers] = useState([])
    console.log("User received in Modal: ", users)
    const [selectedUserId, setSelectedUserId] = useState(null);
    const initialUsers = users
    const [search, setSearch] = useState('');

    useEffect(() => {
        setAllUsers(users || []);
    }, [users]);

    useEffect(() => {
        if (!search) {
            setAllUsers(users || []);
            return;
        }

        const lowerSearch = search.toLowerCase();
        const filtered = (users || []).filter((user) =>
            user.username.toLowerCase().includes(lowerSearch) ||
            String(user.id) === search
        );

        setAllUsers(filtered);
    }, [search]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
        >
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-center">Add a Member</h2>

                <div className="w-full mb-4">
                    <input
                        type="text"
                        placeholder="Search by username"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="max-h-60 overflow-y-auto">
                    {allUsers.map((user) => {
                        const isSelected = selectedUserId === user.id;
                        return (
                            <div
                                key={user.id}
                                onClick={() => setSelectedUserId(user.id)}
                                className={`w-full cursor-pointer p-4 mb-3 shadow rounded-lg transition duration-200 ${isSelected
                                    ? 'border-2 border-blue-600 text-blue-600 bg-blue-50'
                                    : 'bg-white hover:bg-gray-100'
                                    }`}
                            >
                                <p className="font-medium">{user.username}</p>
                                <p className="text-sm text-gray-500">ID: {user.id}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onAdd(selectedUserId)}
                        disabled={!selectedUserId}
                        className={`px-4 py-2 rounded ${selectedUserId
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-blue-300 text-white cursor-not-allowed'
                            }`}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>

    );
};

export default AddMemberModal;
