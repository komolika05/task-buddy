import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, closeEditModal } from '../../redux/slices/taskSlice';

const ActivityLogItem = ({ log }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderLogDetails = () => {
    switch (log.action) {
      case 'created':
        return 'Task was created';
      case 'updated':
        if (log.changes) {
          return Object.entries(log.changes).map(([field, change]) => 
            `${field} changed from "${change.from}" to "${change.to}"`
          ).join(', ');
        }
        return 'Task was updated';
      case 'deleted':
        return 'Task was deleted';
      default:
        return log.action;
    }
  };

  return (
    <div className="activity-log-item">
      <div className="log-timestamp">{formatTimestamp(log.timestamp)}</div>
      <div className="log-description">{renderLogDetails()}</div>
    </div>
  );
};

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
          <div className="modal-body p-3 d-flex">
            <div className="edit-form-container col-6">
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
            <div className="activity-log-container col-6">
              <h6>Activity Log</h6>
              {task.activityLog && task.activityLog.length > 0 ? (
                task.activityLog.map(log => (
                  <ActivityLogItem key={log.id} log={log} />
                ))
              ) : (
                <div className="text-center text-muted">No activity recorded</div>
              )}
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-between">
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
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
