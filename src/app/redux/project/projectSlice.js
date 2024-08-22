import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    projectAllAPIData: null,
    isLoading: false,
    error: null,
};

// Async thunk for fetching project data
export const fetchProjectData = createAsyncThunk(
    'projectAll/fetchProjectData',
    async () => {
        try {
            const response = await fetch('/api/project/getUser'); 
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("API Response Data:", data);
            return data;
        } catch (error) {
            console.error("Error fetching project data:", error);
            throw error;
        }
    }
);

const projectSlice = createSlice({
    name: 'projectAll',
    initialState,
    reducers: {
        clearProjectData: (state) => {
            state.projectAllAPIData = null;
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProjectData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.projectAllAPIData = action.payload.clientData; 
            })
            .addCase(fetchProjectData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearProjectData } = projectSlice.actions;
export default projectSlice.reducer;
