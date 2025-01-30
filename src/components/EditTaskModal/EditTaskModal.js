import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, closeEditModal } from '../../redux/slices/taskSlice';

const EditTaskModal = ({ task }) => {
    const [editedTask, setEditedTask] = useState(task);
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEditedTask(prevTask => ({
            ...prevTask,
            [id]: value
        }));
    };

    const handleSaveTask = () => {
        dispatch(updateTask(editedTask));
        dispatch(closeEditModal());
    };

    const handleCloseModal = () => {
        dispatch(closeEditModal());
    };

    return (
        <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog" style={{ minWidth: '670px', minHeight: '690px' }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Task</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleCloseModal}
                        ></button>
                    </div>
                    <div className="modal-body p-0">
                        <form>
                            <div className="p-3">
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        value={editedTask.title}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        value={editedTask.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <select
                                        className="form-select"
                                        id="category"
                                        value={editedTask.category}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Work">Work</option>
                                        <option value="Personal">Personal</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <select
                                        className="form-select"
                                        id="status"
                                        value={editedTask.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="inProgress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSaveTask}
                                >
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;
