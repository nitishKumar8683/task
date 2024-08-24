import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    taskworkAllAPIData: null,
    isLoading: false,
    error: null,
};

// Async thunk for fetching taskwork data
export const fetchTaskWorkData = createAsyncThunk(
    'taskworkAll/fetchTaskWorkData',
    async () => {
        try {
            const response = await fetch('/api/worktask/getWorkTask');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("API Response Data:", data.taskworkData);
            const taskworkData = Array.isArray(data.taskworkData) ? data.taskworkData : [];
            const sortedData = taskworkData.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            return sortedData
        } catch (error) {
            console.error("Error fetching taskwork data:", error);
            throw error;
        }
    }
);

const taskworkSlice = createSlice({
    name: 'taskworkAll',
    initialState,
    reducers: {
        clearTaskWorkData: (state) => {
            state.taskworkAllAPIData = null; // Corrected property name
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTaskWorkData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTaskWorkData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.taskworkAllAPIData = action.payload; // Set the data directly
            })
            .addCase(fetchTaskWorkData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearTaskWorkData } = taskworkSlice.actions;
export default taskworkSlice.reducer;
