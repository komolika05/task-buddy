import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { addTask } from '../../redux/slices/taskSlice';

function AddTaskModal({ onClose }) {
    const dispatch = useDispatch();
    const [newTask, setNewTask] = useState({
        title: '',
        category: '',
        dueDate: '',
        status: 'todo'
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setNewTask(prevTask => ({
            ...prevTask,
            [id]: value
        }));
    };

    const handleAddTask = (e) => {
        e.preventDefault();

        dispatch(addTask(newTask));
        
        setNewTask({
            title: '',
            category: '',
            dueDate: '',
            status: 'todo'
        });

        // Close the modal
        onClose();
    };

    return (
        <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create Task</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleAddTask}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    placeholder="Enter task title"
                                    value={newTask.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="category" className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    id="category"
                                    value={newTask.category}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Category</option>
                                    <option value="work">Work</option>
                                    <option value="personal">Personal</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="dueDate" className="form-label">Due Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="dueDate"
                                    value={newTask.dueDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    id="status"
                                    value={newTask.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="todo">To-Do</option>
                                    <option value="inProgress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button type="submit" onClick={handleAddTask} className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddTaskModal;