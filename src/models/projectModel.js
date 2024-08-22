import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    isDelete: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Project = mongoose.models.projects || mongoose.model("projects", projectSchema);

export default Project;