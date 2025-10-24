import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../../types';
import taskService from '../../services/taskService';

// Define the initial state
interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
  filterStatus: TaskStatus | 'ALL';
  sortBy: 'position' | 'dueDate' | 'status' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  currentProjectNumber: number | null;
}

const initialState: TasksState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  filterStatus: 'ALL',
  sortBy: 'position',
  sortOrder: 'asc',
  currentProjectNumber: null,
};

// Async thunks for API calls
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (projectNumber: number, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getTasks(projectNumber);
      return { tasks, projectNumber };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTask = createAsyncThunk(
  'tasks/fetchTask',
  async ({ projectNumber, taskNumber }: { projectNumber: number; taskNumber: number }, { rejectWithValue }) => {
    try {
      const task = await taskService.getTask(projectNumber, taskNumber);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async ({ projectNumber, taskData }: { projectNumber: number; taskData: CreateTaskRequest }, { rejectWithValue }) => {
    try {
      const newTask = await taskService.createTask(projectNumber, taskData);
      return newTask;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (
    { projectNumber, taskNumber, taskData }: { projectNumber: number; taskNumber: number; taskData: UpdateTaskRequest },
    { rejectWithValue }
  ) => {
    try {
      const updatedTask = await taskService.updateTask(projectNumber, taskNumber, taskData);
      return updatedTask;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async ({ projectNumber, taskNumber }: { projectNumber: number; taskNumber: number }, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(projectNumber, taskNumber);
      return { projectNumber, taskNumber };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async (
    { projectNumber, taskNumber, status }: { projectNumber: number; taskNumber: number; status: TaskStatus },
    { rejectWithValue }
  ) => {
    try {
      const updatedTask = await taskService.updateTaskStatus(projectNumber, taskNumber, status);
      return updatedTask;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update task status');
    }
  }
);

export const updateTaskPosition = createAsyncThunk(
  'tasks/updateTaskPosition',
  async (
    { projectNumber, taskNumber, position }: { projectNumber: number; taskNumber: number; position: number },
    { rejectWithValue }
  ) => {
    try {
      const updatedTask = await taskService.updateTaskPosition(projectNumber, taskNumber, position);
      return updatedTask;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update task position');
    }
  }
);

// Create the slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Synchronous actions
    setFilterStatus: (state, action: PayloadAction<TaskStatus | 'ALL'>) => {
      state.filterStatus = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'position' | 'dueDate' | 'status' | 'createdAt'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.currentTask = null;
      state.currentProjectNumber = null;
    },
    resetTasksState: (state) => {
      state.tasks = [];
      state.currentTask = null;
      state.loading = false;
      state.error = null;
      state.filterStatus = 'ALL';
      state.sortBy = 'position';
      state.sortOrder = 'asc';
      state.currentProjectNumber = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.currentProjectNumber = action.payload.projectNumber;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch single task
    builder
      .addCase(fetchTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
        state.error = null;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        
        // Update in tasks array
        const index = state.tasks.findIndex(
          (t) => t.taskNumber === updatedTask.taskNumber
        );
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
        
        // Update current task if it's the same one
        if (state.currentTask?.taskNumber === updatedTask.taskNumber) {
          state.currentTask = updatedTask;
        }
        
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update task status
    builder
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        
        // Update in tasks array
        const index = state.tasks.findIndex(
          (t) => t.taskNumber === updatedTask.taskNumber
        );
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
        
        // Update current task if it's the same one
        if (state.currentTask?.taskNumber === updatedTask.taskNumber) {
          state.currentTask = updatedTask;
        }
      });

    // Update task position
    builder
      .addCase(updateTaskPosition.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        
        // Update in tasks array
        const index = state.tasks.findIndex(
          (t) => t.taskNumber === updatedTask.taskNumber
        );
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        const { taskNumber } = action.payload;
        
        // Remove from tasks array
        state.tasks = state.tasks.filter(
          (t) => t.taskNumber !== taskNumber
        );
        
        // Clear current task if it's the deleted one
        if (state.currentTask?.taskNumber === taskNumber) {
          state.currentTask = null;
        }
        
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setFilterStatus,
  setSortBy,
  setSortOrder,
  clearCurrentTask,
  clearError,
  clearTasks,
  resetTasksState,
} = tasksSlice.actions;

// Export selectors
export const selectTasks = (state: { tasks: TasksState }) => state.tasks.tasks;
export const selectCurrentTask = (state: { tasks: TasksState }) => state.tasks.currentTask;
export const selectTasksLoading = (state: { tasks: TasksState }) => state.tasks.loading;
export const selectTasksError = (state: { tasks: TasksState }) => state.tasks.error;
export const selectFilterStatus = (state: { tasks: TasksState }) => state.tasks.filterStatus;
export const selectSortBy = (state: { tasks: TasksState }) => state.tasks.sortBy;
export const selectSortOrder = (state: { tasks: TasksState }) => state.tasks.sortOrder;
export const selectCurrentProjectNumber = (state: { tasks: TasksState }) => state.tasks.currentProjectNumber;

// Derived selectors
export const selectFilteredAndSortedTasks = (state: { tasks: TasksState }) => {
  const { tasks, filterStatus, sortBy, sortOrder } = state.tasks;
  
  // Filter by status
  let filteredTasks = tasks;
  if (filterStatus !== 'ALL') {
    filteredTasks = tasks.filter(task => task.status === filterStatus);
  }
  
  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'position':
        comparison = a.position - b.position;
        break;
      case 'dueDate':
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        comparison = aDate - bDate;
        break;
      case 'status':
        const statusOrder = { TODO: 0, IN_PROGRESS: 1, BLOCKED: 2, DONE: 3 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return sortedTasks;
};

export const selectTasksByStatus = (state: { tasks: TasksState }) => {
  const tasks = state.tasks.tasks;
  return {
    todo: tasks.filter(task => task.status === 'TODO'),
    inProgress: tasks.filter(task => task.status === 'IN_PROGRESS'),
    blocked: tasks.filter(task => task.status === 'BLOCKED'),
    done: tasks.filter(task => task.status === 'DONE'),
  };
};

export const selectTaskStats = (state: { tasks: TasksState }) => {
  const tasks = state.tasks.tasks;
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === 'DONE').length;
  const inProgress = tasks.filter(task => task.status === 'IN_PROGRESS').length;
  const blocked = tasks.filter(task => task.status === 'BLOCKED').length;
  const todo = tasks.filter(task => task.status === 'TODO').length;
  
  return {
    total,
    completed,
    inProgress,
    blocked,
    todo,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
};

export const selectTaskByNumber = (taskNumber: number) => (state: { tasks: TasksState }) =>
  state.tasks.tasks.find((task) => task.taskNumber === taskNumber);

// Export the reducer
export default tasksSlice.reducer;