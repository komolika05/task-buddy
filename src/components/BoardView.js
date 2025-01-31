import React from "react";
import './custom.css';
import './boardView.css';
import { useSelector, useDispatch } from 'react-redux';
import { openEditModal, deleteTask } from '../redux/slices/taskSlice';

export default function BoardView() {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.tasks);
    const searchQuery = useSelector((state) => state.tasks.searchQuery);
    const categoryFilter = useSelector((state) => state.tasks.categoryFilter);
    const dueDateFilter = useSelector((state) => state.tasks.dueDateFilter);

    const statuses = ['todo', 'inProgress', 'completed'];

    const handleEditTask = (taskId) => {
        dispatch(openEditModal(taskId));
    };

    const handleDeleteTask = (taskId) => {
        dispatch(deleteTask(taskId));
    };

    const filterTasksByStatusAndSearch = (status) => {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        return tasks.filter(task => {
            const matchesStatus = task.status === status;
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
            
            // If no category filter is set, include all tasks
            const matchesCategory = !categoryFilter || task.category === categoryFilter;
            
            // If no due date filter is set, include all tasks
            let matchesDueDate = true;
            if (dueDateFilter === 'Today') {
              matchesDueDate = task.dueDate === today;
            } else if (dueDateFilter === 'Tomorrow') {
              matchesDueDate = task.dueDate === tomorrow;
            }

            return matchesStatus && matchesSearch && matchesCategory && matchesDueDate;
        });
    };

    return (
        <div className="d-flex flex-row p-3">
            {
                statuses.map(status => (
                    <div key={status} className="gray-box me-3 p-2">
                        <div className={`${status}-tag text-center mb-3`}>
                            {status.toUpperCase()} ({filterTasksByStatusAndSearch(status).length})
                        </div>
                        {
                            filterTasksByStatusAndSearch(status).map(task => (
                                <div 
                                    key={task.id} 
                                    className="card mb-2 d-flex flex-column justify-content-between"
                                >
                                    <div className="p-3 d-flex justify-content-between">
                                        <strong>{task.title}</strong>
                                        <div className="dropdown ms-2">
                                            <button
                                                className="actions-btn d-flex align-items-center"
                                                type="button"
                                                id="actionDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <i className="fas fa-ellipsis-h gray"></i>
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="actionDropdown">
                                                <li>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => handleEditTask(task.id)}
                                                    >
                                                        <i className="fa-solid fa-pen me-1"></i>
                                                        Edit
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="dropdown-item red"
                                                        onClick={() => handleDeleteTask(task.id)}
                                                    >
                                                        <i className="fa-solid fa-trash-can me-1"></i>
                                                        Delete
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="p-3 d-flex flex-row justify-content-between">
                                        <div className="gray card-category-text">{task.category}</div>
                                        <div className="gray card-category-text">{task.dueDate}</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    );
}