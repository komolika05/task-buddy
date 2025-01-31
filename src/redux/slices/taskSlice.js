import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Helper function to load tasks from localStorage
const loadTasksFromLocalStorage = () => {
  try {
    const serializedTasks = localStorage.getItem('tasks');
    if (serializedTasks === null) {
      return [
        {
          id: '1',
          title: 'Welcome to ToDo!',
          description: 'This is a sample task. You can edit it by clicking on it.',
          category: 'work',
          status: 'todo',
          createdAt: new Date().toISOString(),
          order: 0,
          activityLog: []
        },
        {
          id: '2',
          title: 'This is a sample in-progress task',
          category: 'personal',
          status: 'in-progress',
          createdAt: new Date().toISOString(),
          order: 0,
          activityLog: []
        }
      ];
    }
    return JSON.parse(serializedTasks);
  } catch (e) {
    console.warn('Error loading tasks from localStorage:', e);
    return [];
  }
};

const initialState = {
  tasks: loadTasksFromLocalStorage(),
  categories: ['work', 'personal'],
  statuses: ['todo', 'in-progress', 'completed'],
  editModal: {
    isOpen: false,
    taskId: null
  },
  searchQuery: '',
  categoryFilter: '',
  dueDateFilter: ''
};

const createActivityLogEntry = (action, details = {}) => ({
  id: uuidv4(),
  timestamp: new Date().toISOString(),
  action,
  ...details
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        order: state.tasks.filter(task => task.status === action.payload.status).length,
        activityLog: [
          createActivityLogEntry('created', { 
            taskDetails: { ...action.payload } 
          })
        ]
      };
      
      state.tasks.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    updateTask: (state, action) => {
      const { id, ...updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      
      if (taskIndex !== -1) {
        const oldTask = state.tasks[taskIndex];
        const updatedTask = { 
          ...oldTask, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };

        // Create activity log entry for changes
        const changedFields = Object.keys(updates).filter(
          key => oldTask[key] !== updates[key] && key !== 'activityLog'
        );

        const activityDetails = changedFields.reduce((acc, field) => {
          acc[field] = {
            from: oldTask[field] instanceof File ? oldTask[field].name : oldTask[field],
            to: updates[field] instanceof File ? updates[field].name : updates[field]
          };
          return acc;
        }, {});

        updatedTask.activityLog = [
          ...oldTask.activityLog,
          createActivityLogEntry('updated', { 
            changes: activityDetails 
          })
        ];

        state.tasks[taskIndex] = updatedTask;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    deleteTask: (state, action) => {
      const taskIndex = state.tasks.findIndex(task => task.id === action.payload);
      
      if (taskIndex !== -1) {
        const deletedTask = state.tasks[taskIndex];
        
        // Log the deletion
        deletedTask.activityLog.push(
          createActivityLogEntry('deleted', {
            taskDetails: { ...deletedTask }
          })
        );

        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    reorderTasks: (state, action) => {
      const { sourceId, sourceIndex, destinationIndex } = action.payload;

      // Extract the status of the task being moved
      const sourceTask = state.tasks.find(task => task.id === sourceId);
      if (!sourceTask) return; // Exit if the task is not found
      const targetStatus = sourceTask.status;

      // Filter tasks with the same status
      const tasksWithSameStatus = state.tasks
        .filter(task => task.status === targetStatus)
        .sort((a, b) => a.order - b.order); // Sort by current order

      // Remove the task being moved from the array
      const [movedTask] = tasksWithSameStatus.splice(sourceIndex, 1);

      // Insert the task at the new index
      tasksWithSameStatus.splice(destinationIndex, 0, movedTask);

      // Recalculate the order for all tasks with the same status
      tasksWithSameStatus.forEach((task, index) => {
        task.order = index;

        // Log the reordering
        task.activityLog.push(
          createActivityLogEntry('reordered', {
            oldIndex: sourceIndex,
            newIndex: destinationIndex
          })
        );
      });

      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    openEditModal: (state, action) => {
      state.editModal.isOpen = true;
      state.editModal.taskId = action.payload;
    },
    closeEditModal: (state) => {
      state.editModal.isOpen = false;
      state.editModal.taskId = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setDueDateFilter: (state, action) => {
      state.dueDateFilter = action.payload;
    }
  },
});

export const { 
  addTask, 
  updateTask, 
  deleteTask, 
  reorderTasks, 
  openEditModal, 
  closeEditModal,
  setSearchQuery,
  clearSearchQuery,
  setCategoryFilter,
  setDueDateFilter
} = taskSlice.actions;
export default taskSlice.reducer;
