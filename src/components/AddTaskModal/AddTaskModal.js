import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { addTask } from '../../redux/slices/taskSlice';
import './style.css';
import '../custom.css';

const defaultTask = {
    title: '',
    category: 'work',
    dueDate: '',
    status: 'todo'
}

function AddTaskModal({ onClose }) {
    const dispatch = useDispatch();
    const [newTask, setNewTask] = useState(defaultTask);

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

        setNewTask(defaultTask);

        // Close the modal
        onClose();
    };

    function handleCategoryChange(category) {
        setNewTask(prevTask => ({
            ...prevTask,
            category
        }));
    }

    return (
        <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog" style={{ minWidth: '670px', minHeight: '690px' }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create Task</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body p-0">
                        <form onSubmit={handleAddTask}>
                            <div className="p-3">
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
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        placeholder="Enter task description"
                                        value={newTask.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3 col-12 d-flex flex-row justify-content-between">
                                    <div className="col-3 me-2">
                                        <label className="text-gray mb-2">Task Category</label>
                                        <div className="d-flex flex-row">
                                            <div>
                                                <button className={`btn white-btn me-2 category-btn ${newTask.category === 'work' ? 'active' : ''}`} onClick={() => handleCategoryChange('work')}>Work</button>
                                            </div>
                                            <div>
                                                <button className={`btn white-btn category-btn ${newTask.category === 'personal' ? 'active' : ''}`} onClick={() => handleCategoryChange('personal')}>Personal</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <label htmlFor="dueDate" className="form-label">Due Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="dueDate"
                                            value={newTask.dueDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-4">
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
                                </div>
                                <div>
                                    <label className="text-gray mb-1">Attachment</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="attachment"
                                        onChange={(e) => setNewTask(prevTask => ({
                                            ...prevTask,
                                            attachment: e.target.files[0]
                                        }))}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary white-btn"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button type="submit" onClick={handleAddTask} className="btn btn-primary purple-btn">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddTaskModal;