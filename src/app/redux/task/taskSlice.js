import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch task data by ID
export const fetchTaskData = createAsyncThunk('task/fetchData', async () => {
    const response = await axios.get('/api/worktask/getTaskById'); // Adjust API endpoint as needed
    return response.data;
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
                state.taskData = action.payload.taskworkData;
            })
            .addCase(fetchTaskData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearTaskData } = taskSlice.actions;
export default taskSlice.reducer;
