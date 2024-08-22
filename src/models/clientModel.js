import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
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

const Client = mongoose.models.clients || mongoose.model("clients", clientSchema);

export default Client;