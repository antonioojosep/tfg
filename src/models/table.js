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
    ticket: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
    }]});

export default mongoose.model("Table", tableSchema);