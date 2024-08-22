import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state for user slice
const initialState = {
    userAPIData: null,
    isLoading: true,
    error: null,
};

// Async thunk for fetching user data
export const fetchApiUsers = createAsyncThunk(
    "user/fetchApiUsers",
    async (_, { dispatch }) => {
        const response = await fetch("/api/users/me");
        console.log(response)

        if (response.status === 401) {
            dispatch(logout()); 
            throw new Error("Unauthorized. Redirecting to login.");
        }

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        return response.json();
    }
);

// Async thunk for logging out
export const logout = createAsyncThunk(
    "user/logout",
    async (_, { dispatch }) => {
        const response = await fetch("/api/users/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Logout failed. Please try again.");
        }

        return response.json();
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Synchronous logout reducer
        clearUserData: (state) => {
            state.userAPIData = null;
            state.isLoading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchApiUsers actions
            .addCase(fetchApiUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchApiUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userAPIData = action.payload.dataUser;
            })
            .addCase(fetchApiUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            // Handle logout actions
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.userAPIData = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
    },
});

export const { clearUserData } = userSlice.actions;
export default userSlice.reducer;
