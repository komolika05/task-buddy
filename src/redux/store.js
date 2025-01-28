import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';
import taskLogger from './middleware/taskLogger';

const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(taskLogger),
});

export default store;
