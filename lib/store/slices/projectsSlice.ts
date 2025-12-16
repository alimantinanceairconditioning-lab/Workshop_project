import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface IProject {
    _id: string;
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

interface ProjectsState {
    projects: IProject[];
    loading: boolean;
    error: string | null;
}

const initialState: ProjectsState = {
    projects: [],
    loading: false,
    error: null,
};

// Fetch all projects
export const fetchProjects = createAsyncThunk(
    "projects/fetchProjects",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/project");
            const data = await response.json();

            if (!data.success) {
                return rejectWithValue(data.message || "Failed to fetch projects");
            }

            return data.data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch projects");
        }
    }
);

// Add new project
export const addProject = createAsyncThunk(
    "projects/addProject",
    async (projectData: { title: string; titleAr?: string; description: string; descriptionAr?: string; images: string[] }, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/project", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(projectData),
            });

            const data = await response.json();

            if (!data.success) {
                return rejectWithValue(data.message || "Failed to add project");
            }

            return data.data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to add project");
        }
    }
);

// Update project
export const updateProject = createAsyncThunk(
    "projects/updateProject",
    async ({ id, updates }: { id: string; updates: Partial<IProject> }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/project/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });

            const data = await response.json();

            if (!data.success) {
                return rejectWithValue(data.message || "Failed to update project");
            }

            return data.data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update project");
        }
    }
);

// Delete project
export const deleteProject = createAsyncThunk(
    "projects/deleteProject",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/project/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!data.success) {
                return rejectWithValue(data.message || "Failed to delete project");
            }

            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to delete project");
        }
    }
);

const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch projects
        builder.addCase(fetchProjects.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProjects.fulfilled, (state, action: PayloadAction<IProject[]>) => {
            state.loading = false;
            state.projects = action.payload;
        });
        builder.addCase(fetchProjects.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Add project
        builder.addCase(addProject.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addProject.fulfilled, (state, action: PayloadAction<IProject>) => {
            state.loading = false;
            state.projects.unshift(action.payload);
        });
        builder.addCase(addProject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update project
        builder.addCase(updateProject.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateProject.fulfilled, (state, action: PayloadAction<IProject>) => {
            state.loading = false;
            const index = state.projects.findIndex((p) => p._id === action.payload._id);
            if (index !== -1) {
                state.projects[index] = action.payload;
            }
        });
        builder.addCase(updateProject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Delete project
        builder.addCase(deleteProject.pending, (state, action) => {
            // Optimistic delete
            state.projects = state.projects.filter((p) => p._id !== action.meta.arg);
        });
        builder.addCase(deleteProject.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });
        builder.addCase(deleteProject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            // Refetch on error - ideally we would restore the deleted item
        });
    },
});

export default projectsSlice.reducer;
