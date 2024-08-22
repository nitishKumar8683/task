import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    isDelete: {
        type: String,
        default: "",
    },
    phonenumber: {
        type: String,
        default: "",
    },
    image_url: {
        type: String,
        default: "",
    },
    public_id: {
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