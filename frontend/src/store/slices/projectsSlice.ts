import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../../types';
import projectService from '../../services/projectService';

// Define the initial state
interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  sortBy: 'name' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  searchTerm: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

// Async thunks for API calls
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const projects = await projectService.getProjects();
      return projects;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchProject',
  async (projectNumber: number, { rejectWithValue }) => {
    try {
      const project = await projectService.getProject(projectNumber);
      return project;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch project');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: CreateProjectRequest, { rejectWithValue }) => {
    try {
      const newProject = await projectService.createProject(projectData);
      return newProject;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async (
    { projectNumber, projectData }: { projectNumber: number; projectData: UpdateProjectRequest },
    { rejectWithValue }
  ) => {
    try {
      const updatedProject = await projectService.updateProject(projectNumber, projectData);
      return updatedProject;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectNumber: number, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(projectNumber);
      return projectNumber;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete project');
    }
  }
);

// Create the slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Synchronous actions
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'createdAt' | 'updatedAt'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetProjectsState: (state) => {
      state.projects = [];
      state.currentProject = null;
      state.loading = false;
      state.error = null;
      state.searchTerm = '';
      state.sortBy = 'createdAt';
      state.sortOrder = 'desc';
    },
  },
  extraReducers: (builder) => {
    // Fetch projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch single project
    builder
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
        state.error = null;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload); // Add to beginning of array
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update project
    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload;
        
        // Update in projects array
        const index = state.projects.findIndex(
          (p) => p.projectNumber === updatedProject.projectNumber
        );
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        
        // Update current project if it's the same one
        if (state.currentProject?.projectNumber === updatedProject.projectNumber) {
          state.currentProject = updatedProject;
        }
        
        state.error = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete project
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        const deletedProjectNumber = action.payload;
        
        // Remove from projects array
        state.projects = state.projects.filter(
          (p) => p.projectNumber !== deletedProjectNumber
        );
        
        // Clear current project if it's the deleted one
        if (state.currentProject?.projectNumber === deletedProjectNumber) {
          state.currentProject = null;
        }
        
        state.error = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setSearchTerm,
  setSortBy,
  setSortOrder,
  clearCurrentProject,
  clearError,
  resetProjectsState,
} = projectsSlice.actions;

// Export selectors
export const selectProjects = (state: { projects: ProjectsState }) => state.projects.projects;
export const selectCurrentProject = (state: { projects: ProjectsState }) => state.projects.currentProject;
export const selectProjectsLoading = (state: { projects: ProjectsState }) => state.projects.loading;
export const selectProjectsError = (state: { projects: ProjectsState }) => state.projects.error;
export const selectSearchTerm = (state: { projects: ProjectsState }) => state.projects.searchTerm;
export const selectSortBy = (state: { projects: ProjectsState }) => state.projects.sortBy;
export const selectSortOrder = (state: { projects: ProjectsState }) => state.projects.sortOrder;

// Derived selectors
export const selectFilteredAndSortedProjects = (state: { projects: ProjectsState }) => {
  const { projects, searchTerm, sortBy, sortOrder } = state.projects;
  
  // Filter by search term
  let filteredProjects = projects;
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredProjects = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term)
    );
  }
  
  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return sortedProjects;
};

export const selectProjectByNumber = (projectNumber: number) => (state: { projects: ProjectsState }) =>
  state.projects.projects.find((project) => project.projectNumber === projectNumber);

// Export the reducer
export default projectsSlice.reducer;