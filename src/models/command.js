import mongoose from "mongoose";

const CommandSchema = new mongoose.Schema({
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table",
        required: true,
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true },
        amount: {
            type: Number,
            required: true}
        }],
    status: {
        type: String,
        enum: ["pending", "in_progress", "completed"],
        default: "pending",
    },
}, { timestamps: true });

export default mongoose.model("Command", CommandSchema);