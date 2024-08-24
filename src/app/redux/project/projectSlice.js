import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
            const response = await axios.post('/api/project/getUser');
            console.log("API Response Data:", response.data);

            // Access 'clientData' from the API response
            const data = response.data.clientData;

            // Ensure data is an array
            const projectData = Array.isArray(data) ? data : [];

            // Sort data by 'createdAt' field in descending order
            const sortedData = projectData.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

            return { projectData: sortedData };  // Return sorted data wrapped in an object
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
                // Ensure that the action payload contains the sorted data
                state.projectAllAPIData = action.payload.projectData;
            })
            .addCase(fetchProjectData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearProjectData } = projectSlice.actions;
export default projectSlice.reducer;
