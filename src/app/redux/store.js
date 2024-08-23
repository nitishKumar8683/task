import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice'; 
import userAllReducer from './user/userSlice'; 
import clientAllReducer from './client/clientSlice';
import projectAllReducer from './project/projectSlice';
import TaskWorkAllReducer from './taskwork/taskworkSlice'
import taskReducer from './task/taskSlice'

const makeStore = () => {
    return configureStore({
        reducer: {
            user: userReducer,       
            userAll: userAllReducer, 
            clientAll: clientAllReducer,
            projectAll: projectAllReducer,
            taskworkAll : TaskWorkAllReducer,
            task: taskReducer 
        },
    });
};

export default makeStore;
