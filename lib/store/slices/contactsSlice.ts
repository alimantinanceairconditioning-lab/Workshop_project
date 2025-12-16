import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  serviceType: string;
  phoneNumber: string;
  message: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

interface ContactsState {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  contacts: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.error);
      }
      
      return data.contacts;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContactStatus = createAsyncThunk(
  'contacts/updateStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
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
      
      return data.contact;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
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

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch contacts
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action: PayloadAction<Contact[]>) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update contact status
    builder
      .addCase(updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Optimistic update - update UI immediately
        const { id, status } = action.meta.arg;
        const contact = state.contacts.find(c => c._id === id);
        if (contact) {
          contact.status = status as Contact['status'];
        }
      })
      .addCase(updateContactStatus.fulfilled, (state, action: PayloadAction<Contact>) => {
        // Already updated in pending, just ensure consistency
        const index = state.contacts.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      .addCase(updateContactStatus.rejected, (state, action) => {
        state.error = action.payload as string;
        // Note: The UI will revert when fetchContacts is called on error
      });

    // Delete contact
    builder
      .addCase(deleteContact.pending, (state, action) => {
        state.error = null;
        // Optimistic delete - remove from UI immediately
        const id = action.meta.arg;
        state.contacts = state.contacts.filter(contact => contact._id !== id);
      })
      .addCase(deleteContact.fulfilled, (state, action: PayloadAction<string>) => {
        // Already removed in pending
        // Just ensure it's gone
        state.contacts = state.contacts.filter(contact => contact._id !== action.payload);
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.error = action.payload as string;
        // Note: May need to refresh data if delete fails
      });
  },
});

export const { clearError } = contactsSlice.actions;
export default contactsSlice.reducer;
