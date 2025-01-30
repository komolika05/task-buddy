import { v4 as uuidv4 } from 'uuid';

// Utility function to sanitize sensitive data
const sanitizeData = (data) => {
  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data };
    // Remove or mask sensitive fields if needed
    delete sanitized.password;
    return sanitized;
  }
  return data;
};

const taskLogger = (store) => (next) => (action) => {
  // Actions we want to log
  const taskActions = [
    'tasks/addTask', 
    'tasks/updateTask', 
    'tasks/deleteTask', 
    'tasks/reorderTasks',
  ];
  
  if (taskActions.includes(action.type)) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      id: uuidv4(),
      timestamp,
      type: action.type,
      payload: sanitizeData(action.payload),
      previousState: null,
      nextState: null
    };


    logEntry.previousState = sanitizeData(store.getState().tasks);

    const result = next(action);

    logEntry.nextState = sanitizeData(store.getState().tasks);

    try {
      const existingLogs = JSON.parse(localStorage.getItem('taskLogs') || '[]');
      existingLogs.push(logEntry);
      
      const trimmedLogs = existingLogs.slice(-100);
      localStorage.setItem('taskLogs', JSON.stringify(trimmedLogs));
    } catch (error) {
      console.error('Error saving task logs:', error);
    }

    return result;
  }

  return next(action);
};

export default taskLogger;
