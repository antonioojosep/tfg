import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ["available", "reserved", "occupied", "waiting"],
        default: "available",
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
});

export default mongoose.model("Table", tableSchema);