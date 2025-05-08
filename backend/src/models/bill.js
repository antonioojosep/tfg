import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
    table:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table",
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    method : {
        type: String,
        enum: ["cash", "card"],
        required: true,
    },
    status: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid",
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    }
}, { timestamps: true });

export default mongoose.model("Bill", billSchema);