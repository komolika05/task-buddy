const taskLogger = (store) => (next) => (action) => {
  // Actions we want to log
  const taskActions = ['tasks/addTask', 'tasks/updateTask', 'tasks/deleteTask', 'tasks/reorderTasks'];
  
  if (taskActions.includes(action.type)) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Action: ${action.type}`);
    
    switch (action.type) {
      case 'tasks/addTask':
        console.log('New task:', action.payload);
        break;
      case 'tasks/updateTask':
        console.log('Updated task:', action.payload);
        break;
      case 'tasks/deleteTask':
        console.log('Deleted task ID:', action.payload);
        break;
      case 'tasks/reorderTasks':
        console.log('Task reorder:', action.payload);
        break;
    }
  }

  return next(action);
};

export default taskLogger;
