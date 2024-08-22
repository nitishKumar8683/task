import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
            const response = await fetch('/api/client/getUser');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("API Response Data:", data.clientData); 
            return data;
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
                state.clientAllAPIData = action.payload.clientData
            })
            .addCase(fetchClientData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearClientData } = clientSlice.actions;
export default clientSlice.reducer;
