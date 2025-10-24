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
      const response = await projectService.getProjects();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchProject',
  async (projectNumber: number, { rejectWithValue }) => {
    try {
      // Mock project for now - replace with actual API call
      const mockProject: Project = {
        id: `project-${projectNumber}`,
        projectNumber,
        name: `Project ${projectNumber}`,
        description: 'Sample project description',
        userId: 'mock-user-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return mockProject;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch project');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: CreateProjectRequest, { rejectWithValue }) => {
    try {
      const response = await projectService.createProject(projectData);
      return response;
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
      const response = await projectService.updateProject(projectNumber, projectData);
      return response;
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
        state.projects.unshift(action.payload);
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
        
        const index = state.projects.findIndex(
          (p) => p.projectNumber === updatedProject.projectNumber
        );
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        
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
        
        state.projects = state.projects.filter(
          (p) => p.projectNumber !== deletedProjectNumber
        );
        
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

// Export selectors with RootState
export const selectProjects = (state: any) => state.projects.projects;
export const selectCurrentProject = (state: any) => state.projects.currentProject;
export const selectProjectsLoading = (state: any) => state.projects.loading;
export const selectProjectsError = (state: any) => state.projects.error;
export const selectSearchTerm = (state: any) => state.projects.searchTerm;
export const selectSortBy = (state: any) => state.projects.sortBy;
export const selectSortOrder = (state: any) => state.projects.sortOrder;

// Derived selectors
export const selectFilteredAndSortedProjects = (state: any) => {
  const { projects, searchTerm, sortBy, sortOrder } = state.projects;
  
  let filteredProjects = projects;
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredProjects = projects.filter(
      (project: Project) =>
        project.name.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term)
    );
  }
  
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