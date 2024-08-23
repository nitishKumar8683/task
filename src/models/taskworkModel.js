import mongoose from "mongoose";

const taskworkSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true, 
    },
    client: {
        type: String,
    },
    project: {
        type: String,
    },
    status: {
        type: String,
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const TaskWork = mongoose.models.taskworks || mongoose.model("taskworks", taskworkSchema);

export default TaskWork;