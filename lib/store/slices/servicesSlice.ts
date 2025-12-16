import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Service {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  faqs: { question: string; answer: string }[];
  image: string;
  gallery: string[];
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: ServicesState = {
  services: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunks
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/service', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.error);
      }
      
      return data.services;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addService = createAsyncThunk(
  'services/addService',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/service', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.error);
      }
      
      return data.service;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/service/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.error);
      }
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateServiceStatus = createAsyncThunk(
  'services/updateStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/service/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.error);
      }
      
      return data.service;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch services
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.loading = false;
        state.services = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add service
    builder
      .addCase(addService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addService.fulfilled, (state, action: PayloadAction<Service>) => {
        state.loading = false;
        state.services.unshift(action.payload);
      })
      .addCase(addService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete service
    builder
      .addCase(deleteService.pending, (state, action) => {
        state.error = null;
        // Optimistic delete - remove from UI immediately
        const id = action.meta.arg;
        state.services = state.services.filter(service => service._id !== id);
      })
      .addCase(deleteService.fulfilled, (state, action: PayloadAction<string>) => {
        // Already removed in pending
        // Just ensure it's gone
        state.services = state.services.filter(service => service._id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.error = action.payload as string;
        // Note: May need to refresh data if delete fails
      });

    // Update service status
    builder
      .addCase(updateServiceStatus.pending, (state, action) => {
        state.error = null;
        // Optimistic update - update UI immediately
        const { id, status } = action.meta.arg;
        const service = state.services.find(s => s._id === id);
        if (service) {
          service.status = status as Service['status'];
        }
      })
      .addCase(updateServiceStatus.fulfilled, (state, action: PayloadAction<Service>) => {
        // Already updated in pending, just ensure consistency
        const index = state.services.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
        // Clear cache timestamp to force fresh fetch on next load
        state.lastFetched = null;
      })
      .addCase(updateServiceStatus.rejected, (state, action) => {
        state.error = action.payload as string;
        // Note: The UI will revert when fetchServices is called on error
      });
  },
});

export const { clearError } = servicesSlice.actions;
export default servicesSlice.reducer;
