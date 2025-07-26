import React, { useState } from 'react';

const AddMemberModal = ({ isOpen, onClose, onAdd }) => {
    const [selectedUserId, setSelectedUserId] = useState(null);

    const users = [
        { id: '1', name: 'Arfaat Hussain' },
        { id: '2', name: 'Ali Ahmed' },
        { id: '3', name: 'Sara Khan' },
        { id: '4', name: 'Fatima Noor' },
        { id: '5', name: 'Zain Raza' },
        { id: '6', name: 'John Doe' },
        { id: '7', name: 'Jane Smith' },
        { id: '8', name: 'Ayesha Khan' },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
        >
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-2xl">
                <h2 className="text-xl font-bold mb-4">Add a Member</h2>

                <div className="max-h-60 overflow-y-auto">
                    {users.map((user) => {
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
                                <p className="font-medium">{user.name}</p>
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
