import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    clientAllAPIData: null,
    isLoading: false,
    error: null,
};

// Async thunk for fetching client data
export const fetchClientData = createAsyncThunk(
    'clientAll/fetchClientData',
    async () => {
        try {
            const response = await axios.post('/api/client/getUser');
            console.log("API Response Data:", response.data.clientData);

            // Ensure data is an array and sort it
            const clientData = Array.isArray(response.data.clientData) ? response.data.clientData : [];
            const sortedData = clientData.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

            return { clientData: sortedData };
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }
);

const clientSlice = createSlice({
    name: 'clientAll',
    initialState,
    reducers: {
        clearClientData: (state) => {
            state.clientAllAPIData = null;
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClientData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchClientData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clientAllAPIData = action.payload.clientData;
            })
            .addCase(fetchClientData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearClientData } = clientSlice.actions;
export default clientSlice.reducer;
