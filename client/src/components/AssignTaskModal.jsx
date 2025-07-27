import React, { useEffect, useState } from 'react';

const AssignTaskModal = ({ isOpen, onClose, onAssign, tasks }) => {
    const [allTasks, setAllTasks] = useState([])
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setAllTasks(tasks || []);
    }, [tasks]);

    useEffect(() => {
        if (!search) {
            setAllTasks(tasks || []);
            return;
        }

        const lowerSearch = search.toLowerCase();

        const filtered = (tasks || []).filter((task) =>
            task.title.toLowerCase().includes(lowerSearch) ||
            String(task.id) === search
        );

        setAllTasks(filtered);
    }, [search]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
        >
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-center">Assign a Task</h2>

                <div className="w-full mb-4">
                    <input
                        type="text"
                        placeholder="Search by title or ID"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="max-h-60 overflow-y-auto">
                    {allTasks.map((task) => {
                        const isSelected = selectedTaskId === task.id;
                        return (
                            <div
                                key={task.id}
                                onClick={() => setSelectedTaskId( (prevId)=> prevId === task.id? null: task.id )}
                                className={`w-full cursor-pointer p-4 mb-3 shadow rounded-lg transition duration-200 ${isSelected
                                    ? 'border-2 border-blue-600 text-blue-600 bg-blue-50'
                                    : 'bg-white hover:bg-gray-100'
                                    }`}
                            >
                                <p className="font-medium">{task.title}</p>
                                <p className="text-sm text-gray-500">ID: {task.id}</p>
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
                        onClick={() => onAssign(selectedTaskId)}
                        disabled={!selectedTaskId}
                        className={`px-4 py-2 rounded ${selectedTaskId
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-blue-300 text-white cursor-not-allowed'
                            }`}
                    >
                        Assign
                    </button>
                </div>
            </div>
        </div>

    );
};

export default AssignTaskModal;
