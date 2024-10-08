import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch task data by ID
export const fetchTaskData = createAsyncThunk('task/fetchData', async () => {
    try {
        const response = await axios.post('/api/worktask/getTaskById');
        const taskData = response.data.taskworkData || [];
        // Sort task data by `createdAt` in descending order
        const sortedData = taskData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return sortedData;
    } catch (error) {
        console.error("Error fetching task data:", error);
        throw error;
    }
});

// Create slice for task management
const taskSlice = createSlice({
    name: 'task',
    initialState: {
        taskData: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        clearTaskData: (state) => {
            state.taskData = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTaskData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchTaskData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.taskData = action.payload; // Already sorted in descending order
            })
            .addCase(fetchTaskData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearTaskData } = taskSlice.actions;
export default taskSlice.reducer;
