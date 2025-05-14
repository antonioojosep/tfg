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
        enum: ["pending", "completed", "paid"],
        default: "pending",
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    }
}, { timestamps: true });

export default mongoose.model("Command", CommandSchema);