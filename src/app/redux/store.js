import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice'; 
import userAllReducer from './user/userSlice'; 

const makeStore = () => {
    return configureStore({
        reducer: {
            user: userReducer,       
            userAll: userAllReducer, 
        },
    });
};

export default makeStore;
