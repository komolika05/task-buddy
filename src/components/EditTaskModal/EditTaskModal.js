import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, closeEditModal } from '../../redux/slices/taskSlice';
import './style.css';
import '../custom.css';

const ActivityLogItem = ({ log }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${month} ${day}, at ${time}`;
  };

  const renderLogDetails = () => {
    switch (log.action) {
      case 'created':
        return 'You created this task';
      case 'updated':
        if (log.changes) {
          return Object.entries(log.changes).map(([field, change]) => 
            `You changed ${field} from "${change.from}" to "${change.to}"`
          ).join(', ');
        }
        return 'You updated this task';
      case 'deleted':
        return 'You deleted this task';
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

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

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
      <div className="modal-dialog" style={{ minWidth: '1020px', minHeight: '570px' }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Task</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseModal}
            ></button>
          </div>
          <div className="modal-body p-3 d-flex justify-content-between">
            <div className="edit-form-container col-7 me-2">
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
              <div className='col-12 d-flex flex-row justify-content-between'>
                <div className='col-4'>
                  <label className="text-gray mb-2">Category</label>
                  <div className="d-flex flex-row">
                      <div>
                          <button className={`btn white-btn me-2 category-btn ${editedTask.category === 'work' ? 'active' : ''}`} onClick={() => handleInputChange({target: {id: 'category', value: 'work'}})}>Work</button>
                      </div>
                      <div>
                          <button className={`btn white-btn category-btn ${editedTask.category === 'personal' ? 'active' : ''}`} onClick={() => handleInputChange({target: {id: 'category', value: 'personal'}})}>Personal</button>
                      </div>
                  </div>
                </div>
                <div className='col-4 me-3'>
                    <label htmlFor="dueDate" className="form-label">Due Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="dueDate"
                        value={editedTask.dueDate || ''}
                        onChange={handleInputChange}
                        min={getTodayDate()}
                    />
                </div>
                <div className='col-3'>
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="status"
                      value={editedTask.status}
                      onChange={handleInputChange}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
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
                      onChange={(e) => setEditedTask(prevTask => ({
                          ...prevTask,
                          attachment: e.target.files[0]
                      }))}
                  />
                  {editedTask.attachment && (
                    <a href={URL.createObjectURL(editedTask.attachment)} target="_blank" rel="noopener noreferrer">
                      {editedTask.attachment.name}
                    </a>
                  )}
                </div>
            </div>
            <div className="activity-log-container col-5">
              <h6>Activity Log</h6>
              {task.activityLog && task.activityLog.length > 0 ? (
                task.activityLog.map(log => (
                  <ActivityLogItem className='activity-log-item' key={log.id} log={log} />
                ))
              ) : (
                <div className="text-center text-muted">No activity recorded</div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary white-btn"
              onClick={handleCloseModal}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary purple-btn"
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
