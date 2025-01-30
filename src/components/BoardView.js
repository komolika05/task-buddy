import react, { useState } from "react";
import './custom.css';
import './boardView.css';
import { useSelector, useDispatch } from 'react-redux';
import { openEditModal, deleteTask } from '../redux/slices/taskSlice';

export default function BoardView() {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.tasks);

    const statuses = ['todo', 'inProgress', 'completed'];

    const handleEditTask = (taskId) => {
        dispatch(openEditModal(taskId));
    };

    const handleDeleteTask = (taskId) => {
        dispatch(deleteTask(taskId));
    };

    return (
        <div className="d-flex flex-row p-3">
            {
                statuses.map(status => (
                    <div key={status} className="gray-box me-3 p-2">
                        <div className={`${status}-tag text-center mb-3`}>{status.toUpperCase()}</div>
                        {
                            tasks.filter(task => task.status === status).map(task => (
                                <div 
                                    key={task.id} 
                                    className="card mb-2 d-flex flex-column justify-content-between"
                                >
                                    <div className="p-3 d-flex justify-content-between">
                                        <strong>{task.title}</strong>
                                        <div className="dropdown ms-2">
                                            <button
                                                className="btn dropdown-btn d-flex align-items-center"
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
                                                        Edit
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => handleDeleteTask(task.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="gray card-category-text p-2">{task.category}</div>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    );
}