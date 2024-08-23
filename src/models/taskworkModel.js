import mongoose from "mongoose";

const taskworkSchema = new mongoose.Schema({    
    client: {
        type: String,
    },
    project: {
        type: String,
    },
    status: {
        type: String,
        default: "",
    },
    task: {
        type: String,
    },
    isDelete: {
        type: String,
        default: "",
    },
    time: {
        type: String,
        default: "",
    },
    assigned : {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const TaskWork = mongoose.models.taskworks || mongoose.model("taskworks", taskworkSchema);

export default TaskWork;